import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { isAuthed } from '@/lib/session';
import { getDashboardsAdmin, getSloTargets, getHeartbeats } from '@/lib/admin';
import { getUsersWithActivity, USER_ROLES } from '@/lib/users';
import { emailConfigured } from '@/lib/notify';
import { timeAgo } from '@/lib/format';
import { addDashboard, setDashboardEnabled, savePreferences, addUser, updateUserRole, removeUser, saveSlo } from '../config-actions';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  if (!(await isAuthed())) redirect('/login');
  const [dashboards, users, slo, heartbeats, jar] = await Promise.all([
    getDashboardsAdmin(), getUsersWithActivity(), getSloTargets(), getHeartbeats(), cookies(),
  ]);

  let prefs = { density: 'comfortable', timeRange: '30', colorblind: false };
  try { prefs = { ...prefs, ...JSON.parse(jar.get('setnel_prefs')?.value ?? '{}') }; } catch { /* default */ }

  const integrations = [
    { name: 'Telegram alerts', ok: Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID), note: 'incident + escalation paging' },
    { name: 'Email (Resend)', ok: emailConfigured(), note: 'magic-link login, per-severity email, weekly digest' },
    { name: 'Cron ingest secret', ok: Boolean(process.env.SETNEL_CRON_SECRET), note: 'authenticates GitHub Actions runs' },
    { name: 'Database', ok: Boolean(process.env.DATABASE_URL), note: 'Neon Postgres store' },
  ];

  return (
    <>
      <section className="panel">
        <div className="panel-head"><h2>Team &amp; access</h2><span className="panel-note">{users.length} users · roles are attribution today (enforcement lands with SSO)</span></div>
        {users.length === 0 ? (
          <p className="panel-note">No users yet. Add one below, then they sign in via <a className="card-detail" href="/login/identify">magic link</a> to get verified attribution.</p>
        ) : (
          <div className="cov-wrap">
            <table className="cov-table">
              <thead><tr><th align="left">Name</th><th align="left">Email</th><th align="left">Role</th><th>Actions</th><th>Last login</th><th></th></tr></thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td align="left" className="cov-risk">{u.name}</td>
                    <td align="left">{u.email}</td>
                    <td align="left">
                      <form action={updateUserRole} className="actor-form">
                        <input type="hidden" name="id" value={u.id} />
                        <select name="role" defaultValue={u.role} className="actor-input" style={{ width: 120 }}>
                          {USER_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <button className="ghost-btn" type="submit">Set</button>
                      </form>
                    </td>
                    <td>{u.actions}</td>
                    <td>{u.lastLogin ? timeAgo(u.lastLogin) : 'never'}</td>
                    <td><form action={removeUser}><input type="hidden" name="id" value={u.id} /><button className="ghost-btn" type="submit">Remove</button></form></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="panel-head" style={{ marginTop: 18 }}><h2 style={{ fontSize: 14 }}>Add user</h2></div>
        <form action={addUser} className="actor-form" style={{ flexWrap: 'wrap' }}>
          <input className="actor-input" style={{ width: 180 }} name="name" placeholder="Full name" maxLength={80} required />
          <input className="actor-input" style={{ width: 220 }} name="email" type="email" placeholder="email@datumlab.xyz" required />
          <select name="role" defaultValue="Responder" className="actor-input" style={{ width: 120 }}>
            {USER_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <button className="act act-primary" type="submit">Add user</button>
        </form>
      </section>

      <section className="panel">
        <div className="panel-head"><h2>Service-level targets</h2><span className="panel-note">the goals your response metrics are measured against</span></div>
        <form action={saveSlo}>
          <div className="kpis" style={{ marginTop: 0 }}>
            <label className="kpi" style={{ display: 'block' }}><div className="kpi-label">Ack within (min)</div><input className="actor-input" style={{ width: '100%', marginTop: 8 }} name="mtta" type="number" min="1" defaultValue={slo.mttaTargetMin} /></label>
            <label className="kpi" style={{ display: 'block' }}><div className="kpi-label">Resolve within (min)</div><input className="actor-input" style={{ width: '100%', marginTop: 8 }} name="mttr" type="number" min="1" defaultValue={slo.mttrTargetMin} /></label>
            <label className="kpi" style={{ display: 'block' }}><div className="kpi-label">Ack rate target (%)</div><input className="actor-input" style={{ width: '100%', marginTop: 8 }} name="ackRate" type="number" min="0" max="100" defaultValue={slo.ackRateTarget} /></label>
            <label className="kpi" style={{ display: 'block' }}><div className="kpi-label">False-positive ceiling (%)</div><input className="actor-input" style={{ width: '100%', marginTop: 8 }} name="fpRate" type="number" min="0" max="100" defaultValue={slo.fpRateTarget} /></label>
          </div>
          <div className="actions"><button className="act act-primary" type="submit">Save targets</button></div>
        </form>
      </section>

      <section className="panel">
        <div className="panel-head"><h2>System health</h2><span className="panel-note">Setnel monitoring itself · a job is stale past ~3× its interval</span></div>
        {heartbeats.length === 0 ? (
          <p className="panel-note">No cron heartbeats recorded yet. They appear after the next scheduled run.</p>
        ) : (
          <div className="cov-wrap">
            <table className="cov-table">
              <thead><tr><th align="left">Job</th><th>Every</th><th>Last run</th><th>Runs</th><th>Status</th></tr></thead>
              <tbody>
                {heartbeats.map((h) => (
                  <tr key={h.job}>
                    <td align="left" className="cov-risk">{h.job}</td>
                    <td>{h.expectedMin}m</td>
                    <td>{timeAgo(h.lastRunAt)}</td>
                    <td>{h.runs}</td>
                    <td className={h.stale ? 'cov-blocked' : 'cov-yes'}>{h.stale ? '✕ stale' : '✓ healthy'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="panel">
        <div className="panel-head"><h2>Dashboards registry</h2><span className="panel-note">{dashboards.length} onboarded surfaces</span></div>
        <div className="cov-wrap">
          <table className="cov-table">
            <thead><tr><th align="left">ID</th><th align="left">Name</th><th align="left">Base URL</th><th>State</th></tr></thead>
            <tbody>
              {dashboards.map((d) => (
                <tr key={d.id}>
                  <td align="left" className="cov-risk"><a className="card-detail" href={`/setnel/dashboards/${d.id}`}>{d.id}</a></td>
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
        <div className="panel-head" style={{ marginTop: 20 }}><h2 style={{ fontSize: 14 }}>Onboard a dashboard</h2></div>
        <form action={addDashboard} className="actor-form" style={{ flexWrap: 'wrap' }}>
          <input className="actor-input" name="id" placeholder="id (e.g. sparklend)" maxLength={40} required />
          <input className="actor-input" style={{ width: 180 }} name="name" placeholder="Display name" maxLength={80} required />
          <input className="actor-input" style={{ width: 240 }} name="baseUrl" placeholder="https://dashboard.url" required />
          <input className="actor-input" name="protocolSlug" placeholder="protocol slug (optional)" maxLength={80} />
          <button className="act act-primary" type="submit">Add dashboard</button>
        </form>
        <p className="panel-note" style={{ marginTop: 10 }}>Also needs a per-dashboard ingest secret + detector code. See <code>docs/ONBOARD_A_DASHBOARD.md</code>.</p>
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
        <div className="panel-head"><h2>Preferences</h2><span className="panel-note">display only · stored in your browser</span></div>
        <form action={savePreferences}>
          <div className="kpis" style={{ marginTop: 0 }}>
            <label className="kpi" style={{ display: 'block' }}>
              <div className="kpi-label">Density</div>
              <select className="actor-input" style={{ width: '100%', marginTop: 8 }} name="density" defaultValue={prefs.density}>
                <option value="comfortable">comfortable</option>
                <option value="compact">compact</option>
              </select>
            </label>
            <label className="kpi" style={{ display: 'block' }}>
              <div className="kpi-label">Default time range</div>
              <select className="actor-input" style={{ width: '100%', marginTop: 8 }} name="timeRange" defaultValue={prefs.timeRange}>
                <option value="7">7 days</option><option value="14">14 days</option><option value="30">30 days</option><option value="90">90 days</option>
              </select>
            </label>
            <label className="kpi" style={{ display: 'block' }}>
              <div className="kpi-label">Colorblind-safe status</div>
              <div style={{ marginTop: 12 }}><label className="chan-check"><input type="checkbox" name="colorblind" defaultChecked={prefs.colorblind} /> add letters + shapes to status</label></div>
            </label>
          </div>
          <div className="actions"><button className="act act-primary" type="submit">Save preferences</button></div>
        </form>
      </section>
    </>
  );
}
