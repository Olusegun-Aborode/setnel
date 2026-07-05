import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { isAuthed } from '@/lib/session';
import { getDashboardsAdmin, getMembers, MEMBER_ROLES } from '@/lib/admin';
import { addDashboard, setDashboardEnabled, setMemberRole, savePreferences } from '../config-actions';

export const dynamic = 'force-dynamic';

function timeAgo(iso: string | null): string {
  if (!iso) return 'never';
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return h < 24 ? `${h}h ago` : `${Math.floor(h / 24)}d ago`;
}

export default async function SettingsPage() {
  if (!(await isAuthed())) redirect('/login');
  const [dashboards, members, jar] = await Promise.all([getDashboardsAdmin(), getMembers(), cookies()]);

  let prefs = { density: 'comfortable', timeRange: '30', colorblind: false };
  try { prefs = { ...prefs, ...JSON.parse(jar.get('setnel_prefs')?.value ?? '{}') }; } catch { /* default */ }

  const integrations = [
    { name: 'Telegram alerts', ok: Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID), note: 'incident + escalation paging' },
    { name: 'Email (Resend)', ok: Boolean(process.env.RESEND_API_KEY && process.env.SETNEL_EMAIL_FROM), note: 'per-severity email delivery' },
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
                <option value="7">7 days</option>
                <option value="14">14 days</option>
                <option value="30">30 days</option>
                <option value="90">90 days</option>
              </select>
            </label>
            <label className="kpi" style={{ display: 'block' }}>
              <div className="kpi-label">Colorblind-safe status</div>
              <div style={{ marginTop: 12 }}><label className="chan-check"><input type="checkbox" name="colorblind" defaultChecked={prefs.colorblind} /> use shape + text, not just color</label></div>
            </label>
          </div>
          <div className="actions"><button className="act act-primary" type="submit">Save preferences</button></div>
        </form>
      </section>

      <section className="panel">
        <div className="panel-head"><h2>Members</h2><span className="panel-note">operators seen in the audit log</span></div>
        <p className="panel-note" style={{ marginBottom: 12 }}>
          Setnel uses one shared team password today, so <b>Role is a label, not a permission</b> — it documents who does what. Enforced roles (admin can edit thresholds, viewer read-only) arrive with per-user login.
        </p>
        {members.length === 0 ? (
          <p className="panel-note">No actions recorded yet. Names are set from the topbar &ldquo;your name&rdquo; field.</p>
        ) : (
          <div className="cov-wrap">
            <table className="cov-table">
              <thead><tr><th align="left">Member</th><th align="left">Role (label)</th><th>Actions</th><th>Last active</th></tr></thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m.actor}>
                    <td align="left" className="cov-risk">{m.actor}</td>
                    <td align="left">
                      <form action={setMemberRole} className="actor-form">
                        <input type="hidden" name="actor" value={m.actor} />
                        <select name="role" defaultValue={m.role} className="actor-input" style={{ width: 130 }}>
                          {MEMBER_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <button className="ghost-btn" type="submit">Set</button>
                      </form>
                    </td>
                    <td>{m.actions}</td>
                    <td>{timeAgo(m.lastSeen)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
