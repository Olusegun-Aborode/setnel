import { sql } from './db';

// Central audit — every human action records here (shown on the Inbox page).
export async function audit(actor: string, action: string, target?: string, detail?: string): Promise<void> {
  try {
    await sql`INSERT INTO audit_log (actor, action, target, detail) VALUES (${actor}, ${action}, ${target ?? null}, ${detail ?? null})`;
  } catch (e) {
    console.error('[audit] failed', e);
  }
}

// ── Detector config (enable/disable + severity override), read by ingest ──
export type DetectorConfig = { enabled: boolean; severityOverride: string | null };
export async function getDetectorConfigMap(): Promise<Map<string, DetectorConfig>> {
  const rows = (await sql`SELECT dashboard_id, detector_id, enabled, severity_override FROM detector_config`) as
    { dashboard_id: string; detector_id: string; enabled: boolean; severity_override: string | null }[];
  return new Map(rows.map((r) => [`${r.dashboard_id}:${r.detector_id}`, { enabled: r.enabled, severityOverride: r.severity_override }]));
}

// ── Baseline overrides, read by the anomaly runner ──
export type BaselineOverride = { z: number | null; minPct: number | null; enabled: boolean };
export async function getBaselineConfigMap(): Promise<Map<string, BaselineOverride>> {
  const rows = (await sql`SELECT metric_key, z, min_pct, enabled FROM baseline_config`) as
    { metric_key: string; z: number | null; min_pct: number | null; enabled: boolean }[];
  return new Map(rows.map((r) => [r.metric_key, { z: r.z, minPct: r.min_pct, enabled: r.enabled }]));
}

// ── Detector registry for the Detectors page (fired ∪ configured) ──
export type DetectorRow = {
  dashboardId: string;
  detectorId: string;
  enabled: boolean;
  severityOverride: string | null;
  total: number;
  falsePositives: number;
  lastSeen: string | null;
};
export async function getDetectorRegistry(days = 90): Promise<DetectorRow[]> {
  const rows = (await sql`
    WITH fired AS (
      SELECT dashboard_id, detector_id,
             count(*)::int AS total,
             count(*) FILTER (WHERE false_positive)::int AS fp,
             max(last_event_at) AS last_seen
      FROM incidents WHERE opened_at > now() - (${days} || ' days')::interval
      GROUP BY dashboard_id, detector_id
    ),
    keys AS (
      SELECT dashboard_id, detector_id FROM fired
      UNION SELECT dashboard_id, detector_id FROM detector_config
    )
    SELECT k.dashboard_id, k.detector_id,
           COALESCE(c.enabled, true) AS enabled,
           c.severity_override,
           COALESCE(f.total, 0) AS total,
           COALESCE(f.fp, 0) AS fp,
           f.last_seen
    FROM keys k
    LEFT JOIN fired f ON f.dashboard_id = k.dashboard_id AND f.detector_id = k.detector_id
    LEFT JOIN detector_config c ON c.dashboard_id = k.dashboard_id AND c.detector_id = k.detector_id
    ORDER BY k.dashboard_id, total DESC, k.detector_id
  `) as { dashboard_id: string; detector_id: string; enabled: boolean; severity_override: string | null; total: number; fp: number; last_seen: string | null }[];
  return rows.map((r) => ({
    dashboardId: r.dashboard_id, detectorId: r.detector_id, enabled: r.enabled,
    severityOverride: r.severity_override, total: r.total, falsePositives: r.fp, lastSeen: r.last_seen,
  }));
}

// ── Baseline metrics for the Detectors page (distinct sampled metrics ∪ overrides) ──
export type BaselineMetric = { metricKey: string; samples: number; z: number | null; minPct: number | null; enabled: boolean };
export async function getBaselineMetrics(): Promise<BaselineMetric[]> {
  const rows = (await sql`
    WITH m AS (
      SELECT metric_key, count(*)::int AS samples
      FROM metric_samples WHERE source = 'dashboard'
      GROUP BY metric_key
    )
    SELECT COALESCE(m.metric_key, c.metric_key) AS metric_key,
           COALESCE(m.samples, 0) AS samples, c.z, c.min_pct, c.enabled
    FROM m FULL OUTER JOIN baseline_config c ON c.metric_key = m.metric_key
    ORDER BY samples DESC, metric_key
  `) as { metric_key: string; samples: number; z: number | null; min_pct: number | null; enabled: boolean | null }[];
  return rows.map((r) => ({ metricKey: r.metric_key, samples: r.samples, z: r.z, minPct: r.min_pct, enabled: r.enabled ?? true }));
}

// ── Recently escalated incidents, for the Escalation page ──
export type EscalatedIncident = { id: string; severity: string; message: string; escalated_at: string; dashboard_name: string };
export async function getRecentEscalations(limit = 20): Promise<EscalatedIncident[]> {
  return (await sql`
    SELECT i.id, i.severity, i.message, i.escalated_at, d.name AS dashboard_name
    FROM incidents i JOIN dashboards d ON d.id = i.dashboard_id
    WHERE i.escalated_at IS NOT NULL
    ORDER BY i.escalated_at DESC LIMIT ${limit}
  `) as EscalatedIncident[];
}

// ── Escalation / on-call ──
export type Escalation = { escalateAfterMin: number; oncallName: string | null; oncallContact: string | null; enabled: boolean };
export async function getEscalation(): Promise<Escalation> {
  const r = (await sql`SELECT escalate_after_min, oncall_name, oncall_contact, enabled FROM escalation_config WHERE id = 1`) as
    { escalate_after_min: number; oncall_name: string | null; oncall_contact: string | null; enabled: boolean }[];
  const x = r[0];
  return { escalateAfterMin: x?.escalate_after_min ?? 15, oncallName: x?.oncall_name ?? null, oncallContact: x?.oncall_contact ?? null, enabled: x?.enabled ?? true };
}

// ── Settings: dashboards admin + members ──
export type DashboardAdmin = { id: string; name: string; protocolSlug: string; baseUrl: string; enabled: boolean };
export async function getDashboardsAdmin(): Promise<DashboardAdmin[]> {
  const rows = (await sql`SELECT id, name, protocol_slug, base_url, enabled FROM dashboards ORDER BY enabled DESC, name`) as
    { id: string; name: string; protocol_slug: string; base_url: string; enabled: boolean }[];
  return rows.map((r) => ({ id: r.id, name: r.name, protocolSlug: r.protocol_slug, baseUrl: r.base_url, enabled: r.enabled }));
}
export async function getMembers(): Promise<{ actor: string; actions: number }[]> {
  return (await sql`
    SELECT actor, count(*)::int AS actions FROM audit_log GROUP BY actor ORDER BY actions DESC LIMIT 50
  `) as { actor: string; actions: number }[];
}

// ── Inbox / audit feed ──
export type AuditRow = { id: string; actor: string; action: string; target: string | null; detail: string | null; created_at: string };
export async function getAuditLog(limit = 200): Promise<AuditRow[]> {
  return (await sql`SELECT id, actor, action, target, detail, created_at FROM audit_log ORDER BY created_at DESC LIMIT ${limit}`) as AuditRow[];
}
