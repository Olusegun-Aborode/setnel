import { redirect } from 'next/navigation';
import { isAuthed } from '@/lib/session';
import { getEscalation, getRecentEscalations, getChannels } from '@/lib/admin';
import { saveEscalation, saveChannel } from '../config-actions';

export const dynamic = 'force-dynamic';

const SEV: Record<string, string> = { info: 'sev-info', warning: 'sev-warning', critical: 'sev-critical', emergency: 'sev-emergency' };

function fmtTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default async function EscalationPage() {
  if (!(await isAuthed())) redirect('/login');
  const [esc, recent, channels] = await Promise.all([getEscalation(), getRecentEscalations(), getChannels()]);
  const telegramOk = Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);
  const emailOk = Boolean(process.env.RESEND_API_KEY && process.env.SETNEL_EMAIL_FROM);

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
            <label className="kpi" style={{ display: 'block', gridColumn: '1 / -1' }}>
              <div className="kpi-label">Email recipients <span className="kpi-sub" style={{ textTransform: 'none', letterSpacing: 0 }}>· comma or space separated</span></div>
              <input className="actor-input" style={{ width: '100%', marginTop: 8 }} name="emailRecipients" maxLength={500} defaultValue={esc.emailRecipients ?? ''} placeholder="oncall@datumlab.xyz, lead@datumlab.xyz" />
            </label>
          </div>
          <div className="actions"><button className="act act-primary" type="submit">Save escalation policy</button></div>
        </form>
      </section>

      <section className="panel">
        <div className="panel-head"><h2>Notification channels</h2><span className="panel-note">where each severity is delivered</span></div>
        <div className="legend" style={{ marginTop: 0, marginBottom: 12 }}>
          <span className="legend-item"><i className={`cov-key ${telegramOk ? 'cov-yes' : 'cov-blocked'}`}>{telegramOk ? '✓' : '✕'}</i> Telegram {telegramOk ? 'connected' : 'not configured'}</span>
          <span className="legend-item"><i className={`cov-key ${emailOk ? 'cov-yes' : 'cov-blocked'}`}>{emailOk ? '✓' : '✕'}</i> Email {emailOk ? 'connected' : 'needs RESEND_API_KEY + SETNEL_EMAIL_FROM'}</span>
        </div>
        <div className="cov-wrap">
          <table className="cov-table">
            <thead><tr><th align="left">Severity</th><th>Telegram</th><th>Email</th><th></th></tr></thead>
            <tbody>
              {channels.map((c) => (
                <tr key={c.severity}>
                  <td align="left"><span className={`badge ${SEV[c.severity] ?? ''}`}>{c.severity}</span></td>
                  <td colSpan={3} align="left">
                    <form action={saveChannel} className="actor-form">
                      <input type="hidden" name="severity" value={c.severity} />
                      <label className="chan-check"><input type="checkbox" name="telegram" defaultChecked={c.telegram} /> Telegram</label>
                      <label className="chan-check"><input type="checkbox" name="email" defaultChecked={c.email} /> Email</label>
                      <button className="act" type="submit">Save</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="panel-note" style={{ marginTop: 10 }}>
          <b>info</b> never pages. If a severity has Email on but no provider key is set, the send is skipped and dead-lettered — Telegram stays the reliable default.
        </p>
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
