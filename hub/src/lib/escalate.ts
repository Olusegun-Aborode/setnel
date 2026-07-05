import { sql } from './db';
import { notifyTelegram } from './notify';
import { getEscalation } from './admin';
import { buildDeepLink } from './ingest';

// Escalation engine: re-page unacknowledged critical/emergency incidents that
// have gone unanswered longer than the configured window, tagging on-call.
// Runs in the analyze pass. Uses escalated_at to avoid spamming.
export async function runEscalations(): Promise<{ escalated: number }> {
  const esc = await getEscalation();
  if (!esc.enabled) return { escalated: 0 };

  const rows = (await sql`
    SELECT i.id, i.dashboard_id, i.severity, i.message, i.link_path, d.name AS dashboard_name, d.base_url
    FROM incidents i JOIN dashboards d ON d.id = i.dashboard_id
    WHERE i.status = 'active'
      AND i.acknowledged_at IS NULL
      AND i.severity IN ('critical', 'emergency')
      AND i.opened_at < now() - (${esc.escalateAfterMin} || ' minutes')::interval
      AND (i.escalated_at IS NULL OR i.escalated_at < now() - (${esc.escalateAfterMin} || ' minutes')::interval)
      AND (i.muted_until IS NULL OR i.muted_until < now())
  `) as { id: string; dashboard_id: string; severity: string; message: string; link_path: string | null; dashboard_name: string; base_url: string }[];

  let escalated = 0;
  for (const r of rows) {
    const oncall = esc.oncallName ? ` — on-call: ${esc.oncallName}${esc.oncallContact ? ` (${esc.oncallContact})` : ''}` : '';
    const sent = await notifyTelegram({
      dashboardName: r.dashboard_name,
      severity: r.severity as 'critical' | 'emergency',
      category: 'escalation',
      message: `⏫ ESCALATION — unacknowledged ${esc.escalateAfterMin}m+: ${r.message}${oncall}`,
      deepLink: buildDeepLink(r.base_url, r.link_path, String(r.id)),
      incidentId: r.id,
    });
    await sql`UPDATE incidents SET escalated_at = now() WHERE id = ${r.id}`;
    if (sent) escalated += 1;
  }
  return { escalated };
}
