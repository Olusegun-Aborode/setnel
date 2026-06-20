import { redirect, notFound } from 'next/navigation';
import { isAuthed } from '@/lib/session';
import { getIncident, type MetricPoint } from '@/lib/queries';
import { buildDeepLink } from '@/lib/ingest';
import { acknowledgeIncident, muteIncident, markFalsePositive, resolveIncident, addNote } from '../../actions';

export const dynamic = 'force-dynamic';

const SEV: Record<string, string> = { info: 'sev-info', warning: 'sev-warning', critical: 'sev-critical', emergency: 'sev-emergency' };

function fmtTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}
function fmtUsd(n: number | null): string {
  if (n == null) return '—';
  const a = Math.abs(n);
  if (a >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (a >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (a >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

export default async function IncidentPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthed())) redirect('/login');
  const { id } = await params;
  const detail = await getIncident(id);
  if (!detail) notFound();
  const { incident: i, events, notes, metric } = detail;
  const deepLink = buildDeepLink(i.base_url, i.link_path, String(i.id));
  const muted = i.muted_until && new Date(i.muted_until).getTime() > Date.now();

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">
          <a href="/setnel" className="back">← Setnel</a>
          <span className="brand-sub">Incident #{i.id}</span>
        </div>
      </header>

      <section className="panel">
        <div className="card-top" style={{ marginBottom: 8 }}>
          <span className="card-dash">{i.dashboard_name}</span>
          <span className={`badge ${SEV[i.severity] ?? ''}`}>{i.severity}</span>
          <span className={`badge ${i.status === 'active' ? 'badge-count' : 'badge-resolved'}`}>{i.status}</span>
          {i.false_positive ? <span className="badge badge-exp">false positive</span> : null}
          {i.acknowledged_at ? <span className="badge badge-resolved">ack by {i.acknowledged_by}</span> : null}
          {muted ? <span className="badge badge-count">muted</span> : null}
          {i.exposure_usd ? <span className="badge badge-exp">{fmtUsd(i.exposure_usd)} at risk</span> : null}
        </div>
        <div className="card-msg" style={{ fontSize: 15 }}>{i.message}</div>
        <div className="card-meta">
          <span>{i.detector_id}</span><span>·</span>
          <span>opened {fmtTime(i.opened_at)}</span><span>·</span>
          <span>×{i.event_count} events</span>
          {i.resolved_at ? <><span>·</span><span>resolved {fmtTime(i.resolved_at)}{i.resolved_by ? ` by ${i.resolved_by}` : ''}</span></> : null}
        </div>

        {/* Actions */}
        <div className="actions">
          {!i.acknowledged_at && i.status === 'active' ? (
            <form action={acknowledgeIncident}><input type="hidden" name="id" value={i.id} /><button className="act act-primary">Acknowledge</button></form>
          ) : null}
          {i.status === 'active' ? (
            <>
              <form action={muteIncident}><input type="hidden" name="id" value={i.id} /><input type="hidden" name="minutes" value="60" /><button className="act">Mute 1h</button></form>
              <form action={muteIncident}><input type="hidden" name="id" value={i.id} /><input type="hidden" name="minutes" value="1440" /><button className="act">Mute 24h</button></form>
              <form action={resolveIncident}><input type="hidden" name="id" value={i.id} /><button className="act">Resolve</button></form>
              <form action={markFalsePositive}><input type="hidden" name="id" value={i.id} /><button className="act act-danger">False positive</button></form>
            </>
          ) : null}
          <a className="act" href={deepLink} target="_blank" rel="noreferrer">Open dashboard ↗</a>
        </div>
      </section>

      {metric && metric.points.length > 1 ? (
        <section className="panel">
          <div className="panel-head"><h2>{metric.key}</h2><span className="panel-note">last {metric.points.length} samples</span></div>
          <Spark points={metric.points} />
        </section>
      ) : null}

      <section className="panel">
        <div className="panel-head"><h2>Activity</h2><span className="panel-note">events + notes</span></div>
        <form action={addNote} className="note-form">
          <input type="hidden" name="id" value={i.id} />
          <input className="login-input" name="body" placeholder="Add a note…" maxLength={1000} style={{ flex: 1 }} />
          <button className="act act-primary" type="submit">Note</button>
        </form>
        <ul className="timeline">
          {notes.map((n) => (
            <li key={`n${n.id}`} className="tl-note"><span className="tl-time">{fmtTime(n.created_at)}</span><b>{n.author}</b>: {n.body}</li>
          ))}
          {events.map((e) => (
            <li key={`e${e.id}`} className="tl-event"><span className="tl-time">{fmtTime(e.fired_at)}</span>{e.message}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Spark({ points }: { points: MetricPoint[] }) {
  const W = 900, H = 160, pad = 24;
  const vals = points.map((p) => p.value);
  const min = Math.min(...vals), max = Math.max(...vals);
  const range = max - min || 1;
  const n = points.length;
  const x = (idx: number) => pad + (idx / (n - 1)) * (W - 2 * pad);
  const y = (v: number) => pad + (1 - (v - min) / range) * (H - 2 * pad);
  const line = points.map((p, idx) => `${x(idx)},${y(p.value)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="chart" role="img" aria-label="metric">
      <polyline points={line} fill="none" stroke="#0a0a0a" strokeWidth={1.8} strokeLinejoin="round" />
      <circle cx={x(n - 1)} cy={y(points[n - 1].value)} r={3} fill="#0a0a0a" />
    </svg>
  );
}
