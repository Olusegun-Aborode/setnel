import { redirect } from 'next/navigation';
import { isAuthed } from '@/lib/session';
import { getSla, getDetectorStats } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export default async function ReportsPage() {
  if (!(await isAuthed())) redirect('/login');
  const [sla, detectors] = await Promise.all([getSla(30), getDetectorStats(30)]);

  return (
    <>
      <section className="kpis">
        <div className="kpi"><div className="kpi-label">Ack rate</div><div className="kpi-value">{sla.ackRatePct}%</div><div className="kpi-sub">last 30 days</div></div>
        <div className="kpi"><div className="kpi-label">Time to ack</div><div className="kpi-value">{sla.avgTimeToAckMin == null ? '—' : `${sla.avgTimeToAckMin}m`}</div><div className="kpi-sub">average</div></div>
        <div className="kpi"><div className="kpi-label">Time to resolve</div><div className="kpi-value">{sla.avgTimeToResolveMin == null ? '—' : `${sla.avgTimeToResolveMin}m`}</div><div className="kpi-sub">average</div></div>
        <div className={`kpi ${sla.falsePositivePct > 20 ? 'kpi-warn' : 'kpi-good'}`}><div className="kpi-label">False positives</div><div className="kpi-value">{sla.falsePositivePct}%</div><div className="kpi-sub">{sla.total} incidents</div></div>
      </section>

      <section className="panel">
        <div className="panel-head"><h2>Detector quality</h2><span className="panel-note">most active detectors · last 30 days · high FP% = needs tuning</span></div>
        {detectors.length === 0 ? (
          <div className="empty">No incidents in the window.</div>
        ) : (
          <div className="cov-wrap">
            <table className="cov-table">
              <thead><tr><th align="left">Detector</th><th align="left">Dashboard</th><th>Incidents</th><th>False positives</th><th>Avg ack</th></tr></thead>
              <tbody>
                {detectors.map((d) => {
                  const fpPct = d.total ? Math.round((d.falsePositives / d.total) * 100) : 0;
                  return (
                    <tr key={`${d.dashboardId}.${d.detectorId}`}>
                      <td align="left" className="cov-risk">{d.detectorId}</td>
                      <td align="left">{d.dashboardId}</td>
                      <td>{d.total}</td>
                      <td className={fpPct > 30 ? 'cov-blocked' : ''}>{d.falsePositives}{d.falsePositives ? ` (${fpPct}%)` : ''}</td>
                      <td>{d.avgAckMin == null ? '—' : `${d.avgAckMin}m`}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
