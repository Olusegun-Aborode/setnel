import { redirect, notFound } from 'next/navigation';
import { isAuthed } from '@/lib/session';
import { getHealthMatrix, getIncidents, getMetricsForDashboard, type MetricSeries } from '@/lib/queries';
import { getDashboardsAdmin, getDetectorRegistry } from '@/lib/admin';
import { fmtMetric } from '@/lib/format';
import { IncidentCard, timeAgo } from '../../incident-card';

export const dynamic = 'force-dynamic';

export default async function DashboardDrill({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthed())) redirect('/login');
  const { id } = await params;

  const [health, dashboards, incidents, myMetrics, detectors] = await Promise.all([
    getHealthMatrix(),
    getDashboardsAdmin(),
    getIncidents({ dashboardId: id, status: 'all' }),
    getMetricsForDashboard(id),
    getDetectorRegistry(),
  ]);

  const dash = dashboards.find((d) => d.id === id);
  const h = health.find((x) => x.id === id);
  if (!dash) notFound();

  const active = incidents.filter((i) => i.status === 'active');
  const myDetectors = detectors.filter((d) => d.dashboardId === id);

  return (
    <>
      <section className="panel">
        <div className="panel-head">
          <h2>{dash.name}</h2>
          <a className="card-detail" href={dash.baseUrl} target="_blank" rel="noreferrer">open dashboard ↗</a>
        </div>
        <div className="kpis" style={{ marginTop: 4 }}>
          <div className="kpi"><div className="kpi-label">Status</div><div className="kpi-value" style={{ fontSize: 18, textTransform: 'capitalize' }}><span className={`status-dot status-${h?.status ?? 'down'}`} />{h?.status ?? 'unknown'}</div><div className="kpi-sub">last {timeAgo(h?.lastCheckAt ?? null)}</div></div>
          <div className="kpi"><div className="kpi-label">Today</div><div className="kpi-value">{h?.checksToday ?? 0}</div><div className="kpi-sub">check-ins</div></div>
          <div className={`kpi ${active.length ? 'kpi-warn' : 'kpi-good'}`}><div className="kpi-label">Active incidents</div><div className="kpi-value">{active.length}</div><div className="kpi-sub"><a className="card-detail" href={`/setnel/incidents?dashboard=${id}`}>triage →</a></div></div>
          <div className="kpi"><div className="kpi-label">Metrics</div><div className="kpi-value">{myMetrics.length}</div><div className="kpi-sub">{myDetectors.length} detectors</div></div>
        </div>
        {h ? (
          <>
            <div className="panel-head" style={{ marginTop: 18 }}><h2 style={{ fontSize: 14 }}>Collection · last {h.cells.length} days</h2></div>
            <div className="matrix"><div className="matrix-row"><div className="m-cells">
              {h.cells.map((c) => <span key={c.day} className={`cell lvl-${c.checks <= 0 ? 0 : c.checks < 60 ? 1 : c.checks < 200 ? 2 : 3}`} title={`${c.day}: ${c.checks}`} />)}
            </div></div></div>
          </>
        ) : null}
      </section>

      <section className="panel">
        <div className="panel-head"><h2>Active incidents</h2><a className="card-detail" href={`/setnel/incidents?dashboard=${id}`}>all incidents →</a></div>
        <ul className="feed">
          {active.length === 0 ? <li className="empty">No active incidents. 🟢</li> : active.map((i) => <IncidentCard key={i.id} i={i} />)}
        </ul>
      </section>

      <section className="panel">
        <div className="panel-head"><h2>Metrics</h2><a className="card-detail" href="/setnel/metrics">metrics explorer →</a></div>
        {myMetrics.length === 0 ? <div className="empty">No metric samples yet.</div> : (
          <div className="metric-grid">
            {myMetrics.map((m) => (
              <div className="metric-card" key={m.metricKey}>
                <div className="metric-head"><span className="metric-key">{m.metricKey}</span><span className="metric-val">{fmtMetric(m.metricKey, m.latest)}</span></div>
                <Band m={m} />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="panel">
        <div className="panel-head"><h2>Detectors</h2><a className="card-detail" href="/setnel/detectors">configure →</a></div>
        {myDetectors.length === 0 ? <div className="empty">No detectors have fired here yet.</div> : (
          <div className="cov-wrap">
            <table className="cov-table">
              <thead><tr><th align="left">Detector</th><th>90-day fires</th><th>False pos.</th><th>Last seen</th><th>State</th></tr></thead>
              <tbody>
                {myDetectors.map((d) => (
                  <tr key={d.detectorId}>
                    <td align="left" className="cov-risk"><a className="card-detail" href={`/setnel/detectors/${d.dashboardId}/${encodeURIComponent(d.detectorId)}`}>{d.detectorId}</a></td>
                    <td>{d.total}</td>
                    <td>{d.falsePositives}</td>
                    <td>{timeAgo(d.lastSeen)}</td>
                    <td>{d.enabled ? <span className="badge badge-resolved">on</span> : <span className="badge badge-count">off</span>}</td>
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

function Band({ m }: { m: MetricSeries }) {
  const W = 300, H = 84, pad = 6;
  const vals = m.points.map((p) => p.value);
  const bandLo = m.mean - 2 * m.stddev, bandHi = m.mean + 2 * m.stddev;
  const lo = Math.min(...vals, bandLo), hi = Math.max(...vals, bandHi);
  const range = hi - lo || 1;
  const n = m.points.length;
  const x = (i: number) => pad + (i / (n - 1)) * (W - 2 * pad);
  const y = (v: number) => pad + (1 - (v - lo) / range) * (H - 2 * pad);
  const line = m.points.map((p, i) => `${x(i)},${y(p.value)}`).join(' ');
  const last = m.points[n - 1].value;
  const outOfBand = last > bandHi || last < bandLo;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="metric-svg" preserveAspectRatio="none">
      {m.stddev > 0 ? <rect x={pad} y={y(bandHi)} width={W - 2 * pad} height={Math.max(1, y(bandLo) - y(bandHi))} fill="#0a0a0a" fillOpacity={0.06} /> : null}
      <line x1={pad} x2={W - pad} y1={y(m.mean)} y2={y(m.mean)} stroke="#9aa3af" strokeWidth={0.7} strokeDasharray="3 3" />
      <polyline points={line} fill="none" stroke="#0a0a0a" strokeWidth={1.6} strokeLinejoin="round" />
      <circle cx={x(n - 1)} cy={y(last)} r={3} fill={outOfBand ? '#dc2626' : '#0a0a0a'} />
    </svg>
  );
}
