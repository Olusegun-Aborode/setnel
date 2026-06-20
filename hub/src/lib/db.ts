import { neon, type NeonQueryFunction } from '@neondatabase/serverless';

// Lazily-created SQL client. Initialising at import time would throw during
// `next build` (no DATABASE_URL in the build env). The Proxy defers creation
// until the first query at request time.
let _sql: NeonQueryFunction<false, false> | null = null;
function client(): NeonQueryFunction<false, false> {
  if (_sql) return _sql;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL not set');
  _sql = neon(url);
  return _sql;
}

// `sql` is callable as a tagged template, same as a normal neon client.
export const sql = ((strings: TemplateStringsArray, ...values: unknown[]) =>
  client()(strings, ...values)) as NeonQueryFunction<false, false>;

export type DashboardRow = {
  id: string;
  name: string;
  protocol_slug: string;
  base_url: string;
  enabled: boolean;
};

export type IncidentRow = {
  id: string;
  dashboard_id: string;
  detector_id: string;
  fingerprint: string;
  status: 'active' | 'resolved';
  severity: Severity;
  message: string;
  link_path: string | null;
  opened_at: string;
  resolved_at: string | null;
  last_event_at: string;
  event_count: number;
  notified_at: string | null;
  exposure_usd: number | null;
};

export type Severity = 'info' | 'warning' | 'critical' | 'emergency';
export const SEVERITY_RANK: Record<Severity, number> = {
  info: 0,
  warning: 1,
  critical: 2,
  emergency: 3,
};
