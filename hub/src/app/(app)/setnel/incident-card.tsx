import { acknowledgeIncident, muteIncident, markFalsePositive } from './actions';
import type { IncidentWithDashboard } from '@/lib/queries';

export const SEVERITY_CLASS: Record<string, string> = {
  info: 'sev-info', warning: 'sev-warning', critical: 'sev-critical', emergency: 'sev-emergency',
};

export function fmtExposure(n: number): string {
  const a = Math.abs(n);
  if (a >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (a >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (a >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

export function timeAgo(iso: string | null): string {
  if (!iso) return 'never';
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return h < 24 ? `${h}h ago` : `${Math.floor(h / 24)}d ago`;
}

export function IncidentCard({ i }: { i: IncidentWithDashboard }) {
  const muted = i.muted_until && new Date(i.muted_until).getTime() > Date.now();
  return (
    <li className={`card ${SEVERITY_CLASS[i.severity] ?? ''}`}>
      <div className="card-main">
        <div className="card-top">
          <span className="card-dash">{i.dashboard_name}</span>
          <span className={`badge ${SEVERITY_CLASS[i.severity] ?? ''}`}>{i.severity}</span>
          {i.status === 'resolved' ? <span className="badge badge-resolved">resolved</span> : null}
          {i.acknowledged_at ? <span className="badge badge-resolved">ack {i.acknowledged_by}</span> : null}
          {muted ? <span className="badge badge-count">muted</span> : null}
          {i.false_positive ? <span className="badge badge-exp">false positive</span> : null}
          {i.event_count > 1 ? <span className="badge badge-count">×{i.event_count}</span> : null}
          {i.exposure_usd ? <span className="badge badge-exp">{fmtExposure(i.exposure_usd)} at risk</span> : null}
        </div>
        <a className="card-msg card-link" href={`/setnel/incident/${i.id}`}>{i.message}</a>
        <div className="card-meta">
          <span>{i.detector_id}</span><span>·</span>
          <span>{timeAgo(i.last_event_at)}</span><span>·</span>
          <a href={`/setnel/incident/${i.id}`} className="card-detail">details →</a>
        </div>
      </div>
      {i.status === 'active' ? (
        <div className="card-actions">
          {!i.acknowledged_at ? (
            <form action={acknowledgeIncident}><input type="hidden" name="id" value={i.id} /><button className="act act-primary">Ack</button></form>
          ) : null}
          <form action={muteIncident}><input type="hidden" name="id" value={i.id} /><input type="hidden" name="minutes" value="60" /><button className="act">Mute</button></form>
          <form action={markFalsePositive}><input type="hidden" name="id" value={i.id} /><button className="act act-danger">FP</button></form>
        </div>
      ) : null}
    </li>
  );
}
