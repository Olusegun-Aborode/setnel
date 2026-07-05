import { redirect } from 'next/navigation';
import { isAuthed } from '@/lib/session';
import { getDashboardsAdmin, getMembers } from '@/lib/admin';
import { addDashboard, setDashboardEnabled } from '../config-actions';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  if (!(await isAuthed())) redirect('/login');
  const [dashboards, members] = await Promise.all([getDashboardsAdmin(), getMembers()]);

  const integrations = [
    { name: 'Telegram alerts', ok: Boolean(process.env.SETNEL_TELEGRAM_TOKEN && process.env.SETNEL_TELEGRAM_CHAT_ID), note: 'incident + escalation paging' },
    { name: 'Cron ingest secret', ok: Boolean(process.env.SETNEL_CRON_SECRET), note: 'authenticates GitHub Actions runs' },
    { name: 'Database', ok: Boolean(process.env.DATABASE_URL), note: 'Neon Postgres store' },
  ];

  return (
    <>
      <section className="panel">
        <div className="panel-head"><h2>Dashboards registry</h2><span className="panel-note">{dashboards.length} onboarded surfaces</span></div>
        <div className="cov-wrap">
          <table className="cov-table">
            <thead>
              <tr><th align="left">ID</th><th align="left">Name</th><th align="left">Base URL</th><th>State</th></tr>
            </thead>
            <tbody>
              {dashboards.map((d) => (
                <tr key={d.id}>
                  <td align="left" className="cov-risk">{d.id}</td>
                  <td align="left">{d.name}</td>
                  <td align="left"><a className="card-detail" href={d.baseUrl} target="_blank" rel="noreferrer">{d.baseUrl.replace(/^https?:\/\//, '')}</a></td>
                  <td align="left">
                    <form action={setDashboardEnabled}>
                      <input type="hidden" name="id" value={d.id} />
                      <input type="hidden" name="enabled" value={d.enabled ? 'false' : 'true'} />
                      <button className={`act ${d.enabled ? '' : 'act-primary'}`} type="submit">{d.enabled ? 'Enabled' : 'Paused'}</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="panel-head" style={{ marginTop: 20 }}><h2>Onboard a dashboard</h2><span className="panel-note">registers it for ingest &amp; heartbeat</span></div>
        <form action={addDashboard} className="actor-form" style={{ flexWrap: 'wrap' }}>
          <input className="actor-input" name="id" placeholder="id (e.g. sparklend)" maxLength={40} required />
          <input className="actor-input" style={{ width: 180 }} name="name" placeholder="Display name" maxLength={80} required />
          <input className="actor-input" style={{ width: 240 }} name="baseUrl" placeholder="https://dashboard.url" required />
          <input className="actor-input" name="protocolSlug" placeholder="protocol slug (optional)" maxLength={80} />
          <button className="act act-primary" type="submit">Add dashboard</button>
        </form>
        <p className="panel-note" style={{ marginTop: 10 }}>
          Onboarding also needs a per-dashboard ingest secret and detector code in the dashboard&rsquo;s repo. See <code>docs/ONBOARD_A_DASHBOARD.md</code>.
        </p>
      </section>

      <section className="panel">
        <div className="panel-head"><h2>Integrations</h2><span className="panel-note">delivery &amp; storage</span></div>
        <div className="cov-wrap">
          <table className="cov-table">
            <thead><tr><th align="left">Integration</th><th align="left">Purpose</th><th>Status</th></tr></thead>
            <tbody>
              {integrations.map((it) => (
                <tr key={it.name}>
                  <td align="left" className="cov-risk">{it.name}</td>
                  <td align="left">{it.note}</td>
                  <td className={it.ok ? 'cov-yes' : 'cov-blocked'}>{it.ok ? '✓ connected' : '✕ not set'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <div className="panel-head"><h2>Members</h2><span className="panel-note">operators seen in the audit log</span></div>
        {members.length === 0 ? (
          <p className="panel-note">No actions recorded yet. Names are set from the topbar &ldquo;your name&rdquo; field.</p>
        ) : (
          <div className="cov-wrap">
            <table className="cov-table">
              <thead><tr><th align="left">Member</th><th>Actions</th></tr></thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m.actor}><td align="left" className="cov-risk">{m.actor}</td><td>{m.actions}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
