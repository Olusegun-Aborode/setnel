// Phase 2 — cross-source verification.
//
// For each configured check: read the dashboard's latest stored sample for a
// metric, read the same metric from an independent source (DeFiLlama), and if
// they diverge beyond tolerance, raise a data-integrity incident. This catches
// dashboards serving wrong/stale data — the failure class the SparkLend
// utilization bug demonstrated (Setnel faithfully reported the wrong number).
//
// Only metrics that are genuinely comparable are configured here. Where a
// dashboard's metric definition differs from the source (e.g. Aave's all-chain
// v3+v4 "market size" vs DeFiLlama's net TVL), we deliberately DON'T cross-check
// — a guaranteed-divergent check would just be a false-positive machine.

import { sql, type DashboardRow } from './db';
import { ingestBatch, recordSamples } from './ingest';
import { getProtocolTvlUsd } from './sources/defillama';
import type { IncomingEvent } from './types';

type Check = {
  dashboardId: string;
  metricKey: string;        // the stored dashboard sample to compare
  scaleToUsd: number;       // multiply the sample to get USD (sui.*.tvl is in $M)
  llamaSlug: string;        // DeFiLlama protocol slug
  tolerancePct: number;     // divergence above this raises an incident
  label: string;            // human label for the message
};

// Verified comparable on 2026-06-20 (dashboard sample vs DeFiLlama /tvl):
//   navi 123 vs 126 · suilend 106 vs 108 · scallop 14 vs 14.5 · bucket 58 vs 57.6
// AlphaLend excluded (DeFiLlama reports $0); Aave excluded (definitional mismatch).
const CHECKS: Check[] = [
  { dashboardId: 'sui', metricKey: 'sui.navi.tvl',    scaleToUsd: 1e6, llamaSlug: 'navi-lending',    tolerancePct: 15, label: 'Navi TVL' },
  { dashboardId: 'sui', metricKey: 'sui.suilend.tvl', scaleToUsd: 1e6, llamaSlug: 'suilend',         tolerancePct: 15, label: 'Suilend TVL' },
  { dashboardId: 'sui', metricKey: 'sui.scallop.tvl', scaleToUsd: 1e6, llamaSlug: 'scallop-lend',    tolerancePct: 20, label: 'Scallop TVL' },
  { dashboardId: 'sui', metricKey: 'sui.bucket.tvl',  scaleToUsd: 1e6, llamaSlug: 'bucket-protocol', tolerancePct: 20, label: 'Bucket TVL' },
];

type CheckResult = {
  metricKey: string;
  status: 'ok' | 'diverged' | 'skipped';
  dashboardUsd?: number;
  sourceUsd?: number;
  divergencePct?: number;
  reason?: string;
};

const fmtM = (usd: number) => `$${(usd / 1e6).toFixed(1)}M`;

export async function runCrossChecks(): Promise<{ ran: number; diverged: number; results: CheckResult[] }> {
  const results: CheckResult[] = [];
  // Group raised incidents per dashboard so we can run them through ingestBatch.
  const eventsByDashboard = new Map<string, IncomingEvent[]>();

  for (const c of CHECKS) {
    // Latest stored dashboard sample for this metric.
    const rows = (await sql`
      SELECT value FROM metric_samples
      WHERE dashboard_id = ${c.dashboardId} AND metric_key = ${c.metricKey} AND source = 'dashboard'
      ORDER BY ts DESC LIMIT 1
    `) as { value: number }[];
    const sample = rows[0]?.value;
    if (sample == null) {
      results.push({ metricKey: c.metricKey, status: 'skipped', reason: 'no dashboard sample yet' });
      continue;
    }

    const sourceUsd = await getProtocolTvlUsd(c.llamaSlug);
    if (sourceUsd == null) {
      results.push({ metricKey: c.metricKey, status: 'skipped', reason: 'source unavailable' });
      continue;
    }

    // Persist the independent read for provenance + future charting.
    await recordSamples(c.dashboardId, [{ metricKey: c.metricKey, value: sourceUsd / c.scaleToUsd, source: 'defillama' }]);

    const dashboardUsd = sample * c.scaleToUsd;
    const divergencePct = (Math.abs(dashboardUsd - sourceUsd) / sourceUsd) * 100;

    if (divergencePct > c.tolerancePct) {
      results.push({ metricKey: c.metricKey, status: 'diverged', dashboardUsd, sourceUsd, divergencePct });
      const list = eventsByDashboard.get(c.dashboardId) ?? [];
      list.push({
        detectorId: 'crosscheck.tvl',
        category: 'technical',
        severity: 'warning',
        message: `${c.label}: dashboard ${fmtM(dashboardUsd)} vs DeFiLlama ${fmtM(sourceUsd)} (${divergencePct.toFixed(1)}% divergence)`,
        fingerprint: `crosscheck:${c.metricKey}`,
        linkPath: '/',
        payload: { metricKey: c.metricKey, dashboardUsd, sourceUsd, divergencePct, source: 'defillama' },
      });
      eventsByDashboard.set(c.dashboardId, list);
    } else {
      results.push({ metricKey: c.metricKey, status: 'ok', dashboardUsd, sourceUsd, divergencePct });
    }
  }

  // Route raised incidents through the normal state machine (dedup, auto-resolve
  // when it recovers, dead-letter on delivery failure).
  let diverged = 0;
  for (const [dashboardId, events] of eventsByDashboard) {
    const dash = (await sql`SELECT * FROM dashboards WHERE id = ${dashboardId} LIMIT 1`) as DashboardRow[];
    if (dash[0]) {
      await ingestBatch(dash[0], events);
      diverged += events.length;
    }
  }

  return { ran: CHECKS.length, diverged, results };
}
