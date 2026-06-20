import { sql, SEVERITY_RANK, type DashboardRow, type IncidentRow, type Severity } from './db';
import { isTechnical, notifyTelegram } from './notify';
import type { IncomingEvent } from './types';

// Re-notify cadence for an UNACKNOWLEDGED incident that keeps firing. Critical/
// emergency nag hourly (escalation pressure until someone acks); lower severities
// every 6h. Once acknowledged, we don't re-notify unless the severity escalates.
const RENOTIFY_ACKED_MS = Infinity; // acked → silent (until escalation)
const RENOTIFY_URGENT_MS = 60 * 60 * 1000; // 1h for critical/emergency
const RENOTIFY_NORMAL_MS = 6 * 60 * 60 * 1000; // 6h otherwise

type IngestResult = { stored: number; incidentsOpened: number; notified: number };

/**
 * Process one dashboard's event batch:
 *  - dedup against active incidents by fingerprint
 *  - open or update an incident (state machine)
 *  - store the raw event
 *  - fire Telegram for fresh/escalated data alerts (technical stays silent)
 */
export async function ingestBatch(
  dashboard: DashboardRow,
  events: IncomingEvent[],
): Promise<IngestResult> {
  let stored = 0;
  let incidentsOpened = 0;
  let notified = 0;

  for (const ev of events) {
    const fingerprint = ev.fingerprint ?? `${ev.detectorId}`;
    const severity = ev.severity as Severity;
    const linkPath = ev.linkPath ?? null;
    // $ at risk, for ranking the feed. Detectors set payload.exposureUsd where
    // it's meaningful (a pool's supply, a market's size); null otherwise.
    const exp = ev.payload?.exposureUsd;
    const exposureUsd = typeof exp === 'number' && Number.isFinite(exp) ? exp : null;

    // Look for an existing active incident with this fingerprint.
    const existing = (await sql`
      SELECT * FROM incidents
      WHERE fingerprint = ${fingerprint} AND status = 'active'
      ORDER BY opened_at DESC
      LIMIT 1
    `) as IncidentRow[];

    let incidentId: string;
    let shouldNotify = false;

    if (existing.length === 0) {
      // New incident.
      const rows = (await sql`
        INSERT INTO incidents
          (dashboard_id, detector_id, fingerprint, status, severity, message, link_path, last_event_at, event_count, notified_at, exposure_usd)
        VALUES
          (${dashboard.id}, ${ev.detectorId}, ${fingerprint}, 'active', ${severity}, ${ev.message}, ${linkPath}, now(), 1, NULL, ${exposureUsd})
        RETURNING id
      `) as { id: string }[];
      incidentId = rows[0].id;
      incidentsOpened += 1;
      shouldNotify = true;
    } else {
      const inc = existing[0];
      incidentId = inc.id;
      const escalated = SEVERITY_RANK[severity] > SEVERITY_RANK[inc.severity];

      // Muted → never notify until the mute expires (regardless of escalation).
      const muted = inc.muted_until && new Date(inc.muted_until).getTime() > Date.now();
      // Acknowledged → someone's on it; only ping again if severity escalates.
      const acked = Boolean(inc.acknowledged_at);
      const window = acked
        ? RENOTIFY_ACKED_MS
        : SEVERITY_RANK[severity] >= SEVERITY_RANK.critical
          ? RENOTIFY_URGENT_MS
          : RENOTIFY_NORMAL_MS;
      const stale =
        !inc.notified_at || Date.now() - new Date(inc.notified_at).getTime() > window;
      shouldNotify = !muted && (escalated || stale);

      const newSeverity = escalated ? severity : inc.severity;
      await sql`
        UPDATE incidents SET
          event_count = event_count + 1,
          last_event_at = now(),
          severity = ${newSeverity},
          message = ${ev.message},
          link_path = ${linkPath},
          exposure_usd = COALESCE(${exposureUsd}, exposure_usd)
        WHERE id = ${incidentId}
      `;
    }

    // Store the raw event regardless.
    await sql`
      INSERT INTO events
        (dashboard_id, detector_id, category, severity, message, payload, link_path, fingerprint, incident_id)
      VALUES
        (${dashboard.id}, ${ev.detectorId}, ${ev.category}, ${severity}, ${ev.message},
         ${JSON.stringify(ev.payload ?? {})}, ${linkPath}, ${fingerprint}, ${incidentId})
    `;
    stored += 1;

    // Telegram routing: data alerts only, and only when fresh/escalated.
    // info severity never pages; technical category never pages.
    if (shouldNotify && severity !== 'info' && !isTechnical(ev.category)) {
      const deepLink = buildDeepLink(dashboard.base_url, linkPath, incidentId);
      const sent = await notifyTelegram({
        dashboardName: dashboard.name,
        severity,
        category: ev.category,
        message: ev.message,
        deepLink,
        incidentId,
      });
      // Only mark notified if it actually went out. A failed send is
      // dead-lettered; leaving notified_at null lets the next run retry.
      if (sent) {
        await sql`UPDATE incidents SET notified_at = now() WHERE id = ${incidentId}`;
        notified += 1;
      }
    }
  }

  return { stored, incidentsOpened, notified };
}

/**
 * Persist metric samples reported by a detector run. Best-effort, batched.
 * These feed the time-series store (adaptive thresholds, charts, backtesting).
 */
export async function recordSamples(
  dashboardId: string,
  samples: { metricKey: string; value: number; source?: string }[],
): Promise<number> {
  if (!samples.length) return 0;
  // Batch insert via unnest — one round-trip.
  const keys = samples.map((s) => s.metricKey);
  const values = samples.map((s) => s.value);
  const sources = samples.map((s) => s.source ?? 'dashboard');
  await sql`
    INSERT INTO metric_samples (dashboard_id, metric_key, value, source)
    SELECT ${dashboardId}, k, v, src
    FROM unnest(${keys}::text[], ${values}::float8[], ${sources}::text[]) AS t(k, v, src)
  `;
  return samples.length;
}

/**
 * Record a daily collection heartbeat. Called on every authenticated cron
 * check-in, regardless of whether any alerts fired — this is the signal that
 * a dashboard is alive and collecting data today.
 */
export async function recordCheckin(dashboardId: string): Promise<void> {
  await sql`
    INSERT INTO dashboard_health (dashboard_id, day, checks, last_check_at)
    VALUES (${dashboardId}, current_date, 1, now())
    ON CONFLICT (dashboard_id, day)
    DO UPDATE SET checks = dashboard_health.checks + 1, last_check_at = now()
  `;
}

export function buildDeepLink(baseUrl: string, linkPath: string | null, incidentId: string): string {
  const base = baseUrl.replace(/\/$/, '');
  const path = linkPath ?? '/';
  const sep = path.includes('?') ? '&' : '?';
  return `${base}${path}${sep}setnel=${incidentId}`;
}

/**
 * Auto-resolve: any active incident with no new event in 30 min flips to
 * resolved. Called by the resolve cron.
 */
export async function resolveStale(): Promise<number> {
  const rows = (await sql`
    UPDATE incidents
    SET status = 'resolved', resolved_at = now()
    WHERE status = 'active' AND last_event_at < now() - interval '30 minutes'
    RETURNING id
  `) as { id: string }[];
  return rows.length;
}
