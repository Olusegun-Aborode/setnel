import { redirect } from 'next/navigation';
import { isAuthed } from '@/lib/session';
import { getDashboardsOverview } from '@/lib/admin';
import { HEALTH_EXPECTED_PER_DAY } from '@/lib/queries';
import { timeAgo } from '@/lib/format';

export const dynamic = 'force-dynamic';

function uptimePct(cells: { checks: number }[]): number {
  if (!cells.length) return 0;
  const days = cells.filter((c) => c.checks > 0).length;
  return Math.round((days / cells.length) * 100);
}

export default async function DashboardsPage() {
  if (!(await isAuthed())) redirect('/login');
  const rows = await getDashboardsOverview();

  const totals = rows.reduce(
    (a, r) => ({
      metrics: a.metrics + r.metricCount, detectors: a.detectors + r.detectorCount,
      active: a.active + r.activeIncidents, today: a.today + r.checksToday,
    }),
    { metrics: 0, detectors: 0, active: 0, today: 0 },
  );

  return (
    <>
      <section className="kpis">
        <div className="kpi"><div className="kpi-label">Dashboards</div><div className="kpi-value">{rows.length}</div><div className="kpi-sub">{rows.filter((r) => r.status === 'healthy').length} healthy</div></div>
        <div className="kpi"><div className="kpi-label">Metrics tracked</div><div className="kpi-value">{totals.metrics}</div><div className="kpi-sub">across all surfaces</div></div>
        <div className="kpi"><div className="kpi-label">Detectors</div><div className="kpi-value">{totals.detectors}</div><div className="kpi-sub">watching</div></div>
        <div className={`kpi ${totals.active ? 'kpi-warn' : 'kpi-good'}`}><div className="kpi-label">Active incidents</div><div className="kpi-value">{totals.active}</div><div className="kpi-sub">open now</div></div>
        <div className="kpi"><div className="kpi-label">Check-ins today</div><div className="kpi-value">{totals.today}</div><div className="kpi-sub">~{HEALTH_EXPECTED_PER_DAY}/day target each</div></div>
      </section>

      <section className="panel">
        <div className="panel-head"><h2>Monitored dashboards</h2><span className="panel-note">{rows.length} surfaces · click to drill down</span></div>
        <div className="cov-wrap">
          <table className="cov-table dash-table">
            <thead>
              <tr>
                <th align="left">Dashboard</th>
                <th align="left">14-day collection</th>
                <th>Uptime</th>
                <th>Last check</th>
                <th>Today</th>
                <th>Metrics</th>
                <th>Detectors</th>
                <th>Active</th>
                <th>30d</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((h) => {
                const up = uptimePct(h.cells);
                return (
                  <tr key={h.id} className="dash-tr">
                    <td align="left">
                      <a className="dash-name-link" href={`/setnel/dashboards/${h.id}`}>
                        <span className={`status-dot status-${h.status}`} />{h.name}
                      </a>
                    </td>
                    <td align="left">
                      <span className="m-cells m-cells-inline">
                        {h.cells.map((c) => <span key={c.day} className={`cell lvl-${c.checks <= 0 ? 0 : c.checks < 60 ? 1 : c.checks < 200 ? 2 : 3}`} title={`${c.day}: ${c.checks}`} />)}
                      </span>
                    </td>
                    <td className={up >= 90 ? 'cov-yes' : up >= 50 ? '' : 'cov-blocked'}>{up}%</td>
                    <td>{timeAgo(h.lastCheckAt)}</td>
                    <td>{h.checksToday}</td>
                    <td>{h.metricCount}</td>
                    <td>{h.detectorCount}</td>
                    <td>{h.activeIncidents > 0 ? <span className={`badge ${h.criticalActive ? 'sev-critical' : 'badge-count'}`}>{h.activeIncidents}</span> : <span className="kpi-sub">0</span>}</td>
                    <td>{h.incidents30d}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="legend" style={{ marginTop: 12 }}>
          <span className="legend-item"><i className="cell lvl-3" /> full</span>
          <span className="legend-item"><i className="cell lvl-2" /> partial</span>
          <span className="legend-item"><i className="cell lvl-1" /> low</span>
          <span className="legend-item"><i className="cell lvl-0" /> none</span>
        </div>
      </section>
    </>
  );
}
