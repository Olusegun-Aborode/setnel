import { sql, type IncidentRow } from './db';

export type IncidentWithDashboard = IncidentRow & {
  dashboard_name: string;
  protocol_slug: string;
  base_url: string;
};

export type Filters = {
  status?: 'active' | 'resolved' | 'all';
  dashboardId?: string;
  category?: string;
  severity?: string;
  sinceHours?: number;
};

/** Incidents for the console, newest first, with dashboard info joined. */
export async function getIncidents(f: Filters = {}): Promise<IncidentWithDashboard[]> {
  const status = f.status ?? 'all';
  const sinceHours = f.sinceHours ?? 24 * 7; // default last 7 days

  const rows = (await sql`
    SELECT i.*, d.name AS dashboard_name, d.protocol_slug, d.base_url
    FROM incidents i
    JOIN dashboards d ON d.id = i.dashboard_id
    WHERE i.opened_at > now() - (${sinceHours} || ' hours')::interval
      AND (${status} = 'all' OR i.status = ${status})
      AND (${f.dashboardId ?? null}::text IS NULL OR i.dashboard_id = ${f.dashboardId ?? null})
      AND (${f.severity ?? null}::text IS NULL OR i.severity = ${f.severity ?? null})
      AND (${f.category ?? null}::text IS NULL OR EXISTS (
            SELECT 1 FROM events e WHERE e.incident_id = i.id AND e.category = ${f.category ?? null}
          ))
    ORDER BY i.last_event_at DESC
    LIMIT 500
  `) as IncidentWithDashboard[];
  return rows;
}

export type Summary = {
  activeCount: number;
  criticalActive: number;
  last24h: number;
  dashboards: { id: string; name: string }[];
};

export async function getSummary(): Promise<Summary> {
  const active = (await sql`SELECT count(*)::int AS n FROM incidents WHERE status = 'active'`) as { n: number }[];
  const crit = (await sql`SELECT count(*)::int AS n FROM incidents WHERE status = 'active' AND severity IN ('critical','emergency')`) as { n: number }[];
  const day = (await sql`SELECT count(*)::int AS n FROM incidents WHERE opened_at > now() - interval '24 hours'`) as { n: number }[];
  const dash = (await sql`SELECT id, name FROM dashboards WHERE enabled = true ORDER BY name`) as { id: string; name: string }[];
  return {
    activeCount: active[0]?.n ?? 0,
    criticalActive: crit[0]?.n ?? 0,
    last24h: day[0]?.n ?? 0,
    dashboards: dash,
  };
}

// ── Collection health ──────────────────────────────────────────────────

export type DayCell = { day: string; checks: number };
export type DashboardHealth = {
  id: string;
  name: string;
  lastCheckAt: string | null;
  checksToday: number;
  cells: DayCell[]; // oldest → newest, one per day in the window
  status: 'healthy' | 'stale' | 'down'; // today ok / >1 day old / never
};

const HEALTH_WINDOW_DAYS = 14;
// A dashboard checking in every 5 min should log ~288/day. Anything well below
// that for a full day means it stopped collecting partway through.
const EXPECTED_CHECKS_PER_DAY = 288;

/** Per-dashboard daily check-in matrix for the last N days. */
export async function getHealthMatrix(): Promise<DashboardHealth[]> {
  const dashboards = (await sql`
    SELECT id, name FROM dashboards WHERE enabled = true ORDER BY name
  `) as { id: string; name: string }[];

  const rows = (await sql`
    SELECT dashboard_id, to_char(day, 'YYYY-MM-DD') AS day, checks
    FROM dashboard_health
    WHERE day > current_date - ${HEALTH_WINDOW_DAYS}::int
    ORDER BY day ASC
  `) as { dashboard_id: string; day: string; checks: number }[];

  const last = (await sql`
    SELECT dashboard_id,
           max(last_check_at) AS last_check_at,
           coalesce(sum(checks) FILTER (WHERE day = current_date), 0)::int AS checks_today
    FROM dashboard_health
    GROUP BY dashboard_id
  `) as { dashboard_id: string; last_check_at: string | null; checks_today: number }[];

  // Build the day axis (oldest → newest).
  const days: string[] = [];
  const today = new Date();
  for (let i = HEALTH_WINDOW_DAYS - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }

  const byDash = new Map<string, Map<string, number>>();
  for (const r of rows) {
    if (!byDash.has(r.dashboard_id)) byDash.set(r.dashboard_id, new Map());
    byDash.get(r.dashboard_id)!.set(r.day, r.checks);
  }
  const lastByDash = new Map(last.map((l) => [l.dashboard_id, l]));

  return dashboards.map((d) => {
    const dayMap = byDash.get(d.id) ?? new Map();
    const cells = days.map((day) => ({ day, checks: dayMap.get(day) ?? 0 }));
    const l = lastByDash.get(d.id);
    const lastCheckAt = l?.last_check_at ?? null;
    const checksToday = l?.checks_today ?? 0;
    let status: DashboardHealth['status'] = 'down';
    if (lastCheckAt) {
      const ageH = (Date.now() - new Date(lastCheckAt).getTime()) / 3.6e6;
      status = ageH < 24 ? 'healthy' : 'stale';
    }
    return { id: d.id, name: d.name, lastCheckAt, checksToday, cells, status };
  });
}

export const HEALTH_EXPECTED_PER_DAY = EXPECTED_CHECKS_PER_DAY;
export const HEALTH_WINDOW = HEALTH_WINDOW_DAYS;

/** Total check-ins per day across all dashboards, for the trend line chart. */
export async function getDailyCheckTotals(days = 30): Promise<DayCell[]> {
  const rows = (await sql`
    SELECT to_char(day, 'YYYY-MM-DD') AS day, sum(checks)::int AS checks
    FROM dashboard_health
    WHERE day > current_date - ${days}::int
    GROUP BY day
    ORDER BY day ASC
  `) as { day: string; checks: number }[];

  // Fill gaps so the line shows real drops to zero, not skipped days.
  const map = new Map(rows.map((r) => [r.day, r.checks]));
  const out: DayCell[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - i);
    const key = d.toISOString().slice(0, 10);
    out.push({ day: key, checks: map.get(key) ?? 0 });
  }
  return out;
}
