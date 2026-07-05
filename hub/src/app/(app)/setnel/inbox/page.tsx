import { redirect } from 'next/navigation';
import { isAuthed } from '@/lib/session';
import { getAuditLog } from '@/lib/admin';

export const dynamic = 'force-dynamic';

// Human-readable labels + a category class for each audit action.
const ACTIONS: Record<string, { label: string; kind: 'incident' | 'detector' | 'config' | 'dashboard' }> = {
  'incident.ack': { label: 'acknowledged incident', kind: 'incident' },
  'incident.mute': { label: 'muted incident', kind: 'incident' },
  'incident.false_positive': { label: 'marked false positive', kind: 'incident' },
  'incident.resolve': { label: 'resolved incident', kind: 'incident' },
  'detector.mute': { label: 'muted detector', kind: 'detector' },
  'detector.enable': { label: 'enabled detector', kind: 'detector' },
  'detector.disable': { label: 'disabled detector', kind: 'detector' },
  'detector.severity': { label: 'set detector severity', kind: 'detector' },
  'baseline.tune': { label: 'tuned baseline', kind: 'config' },
  'escalation.save': { label: 'updated escalation policy', kind: 'config' },
  'dashboard.add': { label: 'onboarded dashboard', kind: 'dashboard' },
  'dashboard.enable': { label: 'enabled dashboard', kind: 'dashboard' },
  'dashboard.disable': { label: 'paused dashboard', kind: 'dashboard' },
};

const KIND_BADGE: Record<string, string> = {
  incident: 'badge-count', detector: 'badge-exp', config: 'sev-info', dashboard: 'badge-resolved',
};

function fmtTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// If the audit target is an incident id (integer), link to its page.
function targetHref(action: string, target: string | null): string | null {
  if (!target) return null;
  if (action.startsWith('incident.') && /^\d+$/.test(target)) return `/setnel/incident/${target}`;
  return null;
}

export default async function InboxPage() {
  if (!(await isAuthed())) redirect('/login');
  const log = await getAuditLog(300);
  const actors = new Set(log.map((l) => l.actor)).size;

  return (
    <>
      <section className="panel">
        <div className="panel-head"><h2>Inbox</h2><span className="panel-note">everything that changed, and who changed it</span></div>
        <div className="kpis" style={{ marginTop: 4 }}>
          <div className="kpi"><div className="kpi-label">Entries</div><div className="kpi-value">{log.length}</div><div className="kpi-sub">most recent 300</div></div>
          <div className="kpi"><div className="kpi-label">Operators</div><div className="kpi-value">{actors}</div><div className="kpi-sub">distinct actors</div></div>
          <div className="kpi"><div className="kpi-label">Latest</div><div className="kpi-value" style={{ fontSize: 15 }}>{log[0] ? fmtTime(log[0].created_at) : '—'}</div><div className="kpi-sub">last change</div></div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-head"><h2>Audit log</h2><span className="panel-note">chronological, newest first</span></div>
        {log.length === 0 ? (
          <p className="panel-note">No activity recorded yet. Console actions (ack, mute, resolve, config changes) show up here.</p>
        ) : (
          <ul className="timeline">
            {log.map((l) => {
              const a = ACTIONS[l.action] ?? { label: l.action, kind: 'config' as const };
              const href = targetHref(l.action, l.target);
              return (
                <li key={l.id} className="tl-note">
                  <span className="tl-time">{fmtTime(l.created_at)}</span>
                  <span className={`badge ${KIND_BADGE[a.kind] ?? 'badge-count'}`}>{a.kind}</span>{' '}
                  <b>{l.actor}</b> {a.label}
                  {l.target ? <> {href ? <a className="card-detail" href={href}>{l.target}</a> : <code>{l.target}</code>}</> : null}
                  {l.detail ? <span className="panel-note"> · {l.detail}</span> : null}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}
