import { sql, type Severity } from './db';
import { deliverAlert } from './notify';
import { getEscalation, getChannelConfigMap, channelsFor, parseRecipients, getCurrentOnCall } from './admin';
import { shouldEscalate } from './incident-logic';
import { cached } from './config-cache';
import { buildDeepLink } from './ingest';

// Escalation engine: re-page unacknowledged critical/emergency incidents that
// have gone unanswered longer than the configured window, tagging on-call.
// Runs in the analyze pass. The timing decision lives in the tested
// shouldEscalate() helper; escalated_at prevents spamming.
export async function runEscalations(): Promise<{ escalated: number }> {
  const esc = await getEscalation();
  if (!esc.enabled) return { escalated: 0 };
  const channelMap = await cached('channelMap', getChannelConfigMap);
  const emailRecipients = parseRecipients(esc.emailRecipients);
  const onCall = await getCurrentOnCall(); // rotation-aware; falls back to static on-call

  const candidates = (await sql`
    SELECT i.id, i.dashboard_id, i.severity, i.message, i.link_path,
           i.opened_at, i.acknowledged_at, i.muted_until, i.escalated_at,
           d.name AS dashboard_name, d.base_url
    FROM incidents i JOIN dashboards d ON d.id = i.dashboard_id
    WHERE i.status = 'active' AND i.severity IN ('critical', 'emergency')
  `) as {
    id: string; dashboard_id: string; severity: Severity; message: string; link_path: string | null;
    opened_at: string; acknowledged_at: string | null; muted_until: string | null; escalated_at: string | null;
    dashboard_name: string; base_url: string;
  }[];

  const now = Date.now();
  const rows = candidates.filter((r) =>
    shouldEscalate(
      { severity: r.severity, acknowledgedAt: r.acknowledged_at, mutedUntil: r.muted_until, openedAt: r.opened_at, escalatedAt: r.escalated_at },
      now,
      esc.escalateAfterMin,
    ),
  );

  let escalated = 0;
  for (const r of rows) {
    const oncall = onCall.name ? ` — on-call: ${onCall.name}${onCall.contact ? ` (${onCall.contact})` : ''}` : '';
    const routed = await deliverAlert({
      dashboardName: r.dashboard_name,
      severity: r.severity as 'critical' | 'emergency',
      category: 'escalation',
      message: `⏫ ESCALATION — unacknowledged ${esc.escalateAfterMin}m+: ${r.message}${oncall}`,
      deepLink: buildDeepLink(r.base_url, r.link_path, String(r.id)),
      incidentId: r.id,
      channels: channelsFor(channelMap, r.severity),
      emailRecipients,
    });
    await sql`UPDATE incidents SET escalated_at = now() WHERE id = ${r.id}`;
    if (routed.anySent) escalated += 1;
  }
  return { escalated };
}
