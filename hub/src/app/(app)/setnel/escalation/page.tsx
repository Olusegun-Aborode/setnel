import { redirect } from 'next/navigation';
import { isAuthed } from '@/lib/session';
import { getEscalation, getRecentEscalations } from '@/lib/admin';
import { saveEscalation } from '../config-actions';

export const dynamic = 'force-dynamic';

const SEV: Record<string, string> = { info: 'sev-info', warning: 'sev-warning', critical: 'sev-critical', emergency: 'sev-emergency' };

function fmtTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default async function EscalationPage() {
  if (!(await isAuthed())) redirect('/login');
  const [esc, recent] = await Promise.all([getEscalation(), getRecentEscalations()]);

  return (
    <>
      <section className="panel">
        <div className="panel-head"><h2>Escalation &amp; on-call</h2><span className="panel-note">who gets paged when nobody acks</span></div>
        <p className="panel-note" style={{ marginBottom: 14 }}>
          When a <b>critical</b> or <b>emergency</b> incident stays unacknowledged past the window below, Setnel re-pages
          Telegram tagged <code>⏫ ESCALATION</code> with the on-call name. Acknowledging or muting an incident stops its escalation.
        </p>
        <form action={saveEscalation}>
          <div className="kpis" style={{ marginTop: 0 }}>
            <label className="kpi" style={{ display: 'block' }}>
              <div className="kpi-label">Escalate after (minutes)</div>
              <input className="actor-input" style={{ width: '100%', marginTop: 8 }} name="minutes" type="number" min="1" max="1440" defaultValue={esc.escalateAfterMin} />
            </label>
            <label className="kpi" style={{ display: 'block' }}>
              <div className="kpi-label">On-call name</div>
              <input className="actor-input" style={{ width: '100%', marginTop: 8 }} name="oncallName" maxLength={80} defaultValue={esc.oncallName ?? ''} placeholder="e.g. Olusegun" />
            </label>
            <label className="kpi" style={{ display: 'block' }}>
              <div className="kpi-label">On-call contact</div>
              <input className="actor-input" style={{ width: '100%', marginTop: 8 }} name="oncallContact" maxLength={120} defaultValue={esc.oncallContact ?? ''} placeholder="@handle / phone" />
            </label>
            <label className="kpi" style={{ display: 'block' }}>
              <div className="kpi-label">Escalation</div>
              <select className="actor-input" style={{ width: '100%', marginTop: 8 }} name="enabled" defaultValue={String(esc.enabled)}>
                <option value="true">enabled</option>
                <option value="false">paused</option>
              </select>
            </label>
          </div>
          <div className="actions"><button className="act act-primary" type="submit">Save escalation policy</button></div>
        </form>
      </section>

      <section className="panel">
        <div className="panel-head"><h2>Recent escalations</h2><span className="panel-note">last {recent.length} paged past the window</span></div>
        {recent.length === 0 ? (
          <p className="panel-note">No escalations yet. Incidents that get acknowledged in time never reach here.</p>
        ) : (
          <ul className="timeline">
            {recent.map((r) => (
              <li key={r.id} className="tl-note">
                <span className="tl-time">{fmtTime(r.escalated_at)}</span>
                <span className={`badge ${SEV[r.severity] ?? ''}`}>{r.severity}</span>{' '}
                <b>{r.dashboard_name}</b> — <a className="card-detail" href={`/setnel/incident/${r.id}`}>{r.message}</a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
