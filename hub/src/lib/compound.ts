// Phase 3 — compound / correlated detection.
//
// The dangerous moments are usually combinations, not single metrics: e.g. a
// utilization spike AND a TVL drop AND an oracle issue happening together. This
// engine watches the ACTIVE incidents and, when a configured set of conditions
// co-occur within a window, raises a single escalation incident. Built on the
// same state machine, so it dedups and auto-resolves when the cluster clears.

import { sql, type DashboardRow } from './db';
import { ingestBatch } from './ingest';
import type { IncomingEvent } from './types';

type CompoundRule = {
  id: string;
  name: string;
  dashboardId: string;
  // Each entry is matched against active incidents' fingerprint/detector_id by
  // substring. ALL must be present (within windowMin) to fire.
  requires: string[];
  windowMin: number;
  severity: 'warning' | 'critical' | 'emergency';
};

// Illustrative rules. Won't fire until the conditions genuinely co-occur.
const RULES: CompoundRule[] = [
  {
    id: 'aave-liquidity-stress',
    name: 'Aave liquidity stress',
    dashboardId: 'aave',
    requires: ['liquidity-crunch', 'high-utilization'],
    windowMin: 60,
    severity: 'emergency',
  },
  {
    id: 'sui-data-and-risk',
    name: 'Sui: high-risk pool while data is degraded',
    dashboardId: 'sui',
    requires: ['high-risk-pool', 'data-source'],
    windowMin: 60,
    severity: 'critical',
  },
];

export async function runCompound(): Promise<{ rules: number; fired: number }> {
  const eventsByDashboard = new Map<string, IncomingEvent[]>();

  for (const rule of RULES) {
    const active = (await sql`
      SELECT detector_id, fingerprint, message, last_event_at
      FROM incidents
      WHERE dashboard_id = ${rule.dashboardId}
        AND status = 'active'
        AND detector_id <> 'compound.rule'
        AND last_event_at > now() - (${rule.windowMin} || ' minutes')::interval
    `) as { detector_id: string; fingerprint: string; message: string }[];

    const matchedMessages: string[] = [];
    const allPresent = rule.requires.every((needle) => {
      const hit = active.find(
        (i) => i.fingerprint.includes(needle) || i.detector_id.includes(needle),
      );
      if (hit) matchedMessages.push(hit.message);
      return Boolean(hit);
    });

    if (allPresent) {
      const ev: IncomingEvent = {
        detectorId: 'compound.rule',
        category: 'risk-parameters',
        severity: rule.severity,
        message: `${rule.name} — ${rule.requires.length} conditions co-occurring: ${matchedMessages.join(' | ')}`,
        fingerprint: `compound:${rule.id}`,
        linkPath: '/',
        payload: { rule: rule.id, conditions: matchedMessages },
      };
      const list = eventsByDashboard.get(rule.dashboardId) ?? [];
      list.push(ev);
      eventsByDashboard.set(rule.dashboardId, list);
    }
  }

  let fired = 0;
  for (const [dashboardId, events] of eventsByDashboard) {
    const dash = (await sql`SELECT * FROM dashboards WHERE id = ${dashboardId} LIMIT 1`) as DashboardRow[];
    if (dash[0]) {
      await ingestBatch(dash[0], events);
      fired += events.length;
    }
  }

  return { rules: RULES.length, fired };
}
