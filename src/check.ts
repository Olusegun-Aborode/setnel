import type { Config, DashboardSpec, MetricSpec, Alert, MetricSample } from './types.js';
import { fetchJson } from './fetcher.js';
import { coerceNumber, getPath } from './extract.js';
import {
  appendHistory,
  claimAlertSlot,
  getSnapshot,
  getSnapshotAtAge,
  setSnapshot,
} from './storage.js';

export type CheckResult = {
  alerts: Alert[];
  samples: MetricSample[];
};

/**
 * Run one check pass over every enabled dashboard × metric. Emits:
 *  - `technical` alerts for HTTP failures, timeouts, non-JSON, or missing fields
 *  - `metric` alerts when extracted values breach the configured rules
 * Also writes fresh snapshots + rolling history to Redis.
 */
export async function runCheck(config: Config): Promise<CheckResult> {
  const alerts: Alert[] = [];
  const samples: MetricSample[] = [];

  for (const dashboard of config.dashboards) {
    if (!dashboard.enabled) continue;

    // Health probe first. A failing health check is itself an alert, but we
    // still continue to metrics — some API routes may still work even if
    // /api/health is misconfigured.
    await probeHealth(dashboard, alerts);

    // Group metrics by path so we only hit each endpoint once per run.
    const byPath = new Map<string, MetricSpec[]>();
    for (const m of dashboard.metrics) {
      const list = byPath.get(m.path);
      if (list) list.push(m);
      else byPath.set(m.path, [m]);
    }

    for (const [path, metrics] of byPath) {
      const url = joinUrl(dashboard.baseUrl, path);
      const res = await fetchJson(url);
      if (!res.ok) {
        alerts.push({
          kind: 'technical',
          dashboardId: dashboard.id,
          dashboardName: dashboard.name,
          message: `GET ${path} failed — ${res.error} (after ${res.latencyMs}ms)`,
          critical: true,
          timestamp: Date.now(),
        });
        continue;
      }

      // Aave's overview response carries a `warnings` array whenever a
      // version-specific upstream failed. Surface those so we catch partial
      // outages that still return 200.
      const warnings = getPath(res.data, 'warnings');
      if (Array.isArray(warnings) && warnings.length > 0) {
        alerts.push({
          kind: 'technical',
          dashboardId: dashboard.id,
          dashboardName: dashboard.name,
          message: `Partial fetch on ${path}: ${warnings.map(String).join('; ')}`,
          critical: false,
          timestamp: Date.now(),
        });
      }

      for (const metric of metrics) {
        await evaluateMetric(dashboard, metric, res.data, alerts, samples);
      }
    }
  }

  return { alerts, samples };
}

async function probeHealth(dashboard: DashboardSpec, alerts: Alert[]): Promise<void> {
  const url = joinUrl(dashboard.baseUrl, dashboard.healthPath);
  const res = await fetchJson(url);
  if (!res.ok) {
    alerts.push({
      kind: 'technical',
      dashboardId: dashboard.id,
      dashboardName: dashboard.name,
      message: `Health probe failed — ${res.error}`,
      critical: true,
      timestamp: Date.now(),
    });
    return;
  }
  // Soft signal: if /api/health returns { status: 'degraded' } surface it.
  const status = getPath(res.data, 'status');
  if (typeof status === 'string' && status !== 'ok') {
    alerts.push({
      kind: 'technical',
      dashboardId: dashboard.id,
      dashboardName: dashboard.name,
      message: `Health status is "${status}"`,
      critical: status === 'down',
      timestamp: Date.now(),
    });
  }
}

async function evaluateMetric(
  dashboard: DashboardSpec,
  metric: MetricSpec,
  payload: unknown,
  alerts: Alert[],
  samples: MetricSample[],
): Promise<void> {
  const raw = getPath(payload, metric.extract);
  const value = coerceNumber(raw);

  if (value == null) {
    if (!metric.allowMissing) {
      alerts.push({
        kind: 'technical',
        dashboardId: dashboard.id,
        dashboardName: dashboard.name,
        metricId: metric.id,
        label: metric.label,
        message: `Extraction failed: "${metric.extract}" was ${describe(raw)}`,
        critical: false,
        timestamp: Date.now(),
      });
    }
    return;
  }

  // Pull prior snapshot *before* we write the new one.
  const rule = metric.alert;
  const windowMs = rule?.windowHours ? rule.windowHours * 60 * 60 * 1000 : null;
  const prior = windowMs
    ? await getSnapshotAtAge(dashboard.id, metric.id, windowMs)
    : await getSnapshot(dashboard.id, metric.id);

  const now = Date.now();
  samples.push({
    dashboardId: dashboard.id,
    dashboardName: dashboard.name,
    metricId: metric.id,
    label: metric.label,
    unit: metric.unit,
    value,
    previousValue: prior?.value ?? null,
    previousTimestamp: prior?.timestamp ?? null,
    timestamp: now,
  });

  if (rule) {
    // Absolute bounds fire regardless of prior snapshot.
    if (rule.absoluteMin != null && value < rule.absoluteMin) {
      await maybeFire(dashboard, metric, 'absoluteMin', {
        current: value,
        previous: prior?.value ?? value,
        ruleText: `value ${value} below floor ${rule.absoluteMin}`,
        critical: rule.critical === true,
      }, alerts);
    }
    if (rule.absoluteMax != null && value > rule.absoluteMax) {
      await maybeFire(dashboard, metric, 'absoluteMax', {
        current: value,
        previous: prior?.value ?? value,
        ruleText: `value ${value} above ceiling ${rule.absoluteMax}`,
        critical: rule.critical === true,
      }, alerts);
    }
    // Percent change against prior snapshot.
    if (rule.percentChange != null && prior && prior.value !== 0) {
      const deltaPct = ((value - prior.value) / prior.value) * 100;
      if (Math.abs(deltaPct) > rule.percentChange) {
        await maybeFire(dashboard, metric, 'percentChange', {
          current: value,
          previous: prior.value,
          ruleText:
            `|Δ| ${Math.abs(deltaPct).toFixed(2)}% > threshold ${rule.percentChange}%` +
            (rule.windowHours ? ` over ${rule.windowHours}h` : ''),
          critical: rule.critical === true,
        }, alerts);
      }
    }
  }

  // Persist fresh data regardless of alerting.
  await setSnapshot(dashboard.id, metric.id, value, now);
  await appendHistory(dashboard.id, metric.id, value, now);
}

async function maybeFire(
  dashboard: DashboardSpec,
  metric: MetricSpec,
  ruleName: string,
  details: { current: number; previous: number; ruleText: string; critical: boolean },
  alerts: Alert[],
): Promise<void> {
  const allowed = await claimAlertSlot(dashboard.id, metric.id, ruleName);
  if (!allowed) return;
  const deltaPct =
    details.previous === 0
      ? 0
      : ((details.current - details.previous) / details.previous) * 100;
  alerts.push({
    kind: 'metric',
    dashboardId: dashboard.id,
    dashboardName: dashboard.name,
    metricId: metric.id,
    label: metric.label,
    unit: metric.unit,
    current: details.current,
    previous: details.previous,
    deltaPct,
    rule: details.ruleText,
    critical: details.critical,
    timestamp: Date.now(),
  });
}

function joinUrl(base: string, path: string): string {
  const b = base.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${b}${p}`;
}

function describe(v: unknown): string {
  if (v === undefined) return 'undefined (path not found)';
  if (v === null) return 'null';
  if (typeof v === 'object') return `object (${Object.keys(v as object).length} keys)`;
  return `${typeof v}:${String(v).slice(0, 40)}`;
}
