import { redirect } from 'next/navigation';
import { isAuthed } from '@/lib/session';
import { getSla, getDetectorStats } from '@/lib/queries';
import { getWeeklyReport, type WeekRow } from '@/lib/admin';

export const dynamic = 'force-dynamic';

export default async function ReportsPage() {
  if (!(await isAuthed())) redirect('/login');
  const [sla, detectors, weeks] = await Promise.all([getSla(30), getDetectorStats(30), getWeeklyReport(12)]);

  return (
    <>
      <section className="kpis">
        <div className="kpi"><div className="kpi-label">Ack rate</div><div className="kpi-value">{sla.ackRatePct}%</div><div className="kpi-sub">last 30 days</div></div>
        <div className="kpi"><div className="kpi-label">Time to ack</div><div className="kpi-value">{sla.avgTimeToAckMin == null ? '—' : `${sla.avgTimeToAckMin}m`}</div><div className="kpi-sub">average</div></div>
        <div className="kpi"><div className="kpi-label">Time to resolve</div><div className="kpi-value">{sla.avgTimeToResolveMin == null ? '—' : `${sla.avgTimeToResolveMin}m`}</div><div className="kpi-sub">average</div></div>
        <div className={`kpi ${sla.falsePositivePct > 20 ? 'kpi-warn' : 'kpi-good'}`}><div className="kpi-label">False positives</div><div className="kpi-value">{sla.falsePositivePct}%</div><div className="kpi-sub">{sla.total} incidents</div></div>
      </section>

      <section className="panel">
        <div className="panel-head"><h2>Weekly trends</h2><a className="card-detail" href="/api/v1/report" download>Export CSV ↓</a></div>
        {weeks.length === 0 ? (
          <div className="empty">Not enough history yet — trends need at least a week of incidents.</div>
        ) : (
          <>
            <div className="metric-grid">
              <TrendPanel title="Incidents per week" rows={weeks} pick={(w) => w.incidents} fmt={(v) => String(v)} />
              <TrendPanel title="MTTA (min)" rows={weeks} pick={(w) => w.mttaMin} fmt={(v) => (v == null ? '—' : `${v}m`)} />
              <TrendPanel title="MTTR (min)" rows={weeks} pick={(w) => w.mttrMin} fmt={(v) => (v == null ? '—' : `${v}m`)} />
              <TrendPanel title="False-positive %" rows={weeks} pick={(w) => (w.incidents ? Math.round((w.falsePositives / w.incidents) * 100) : 0)} fmt={(v) => `${v}%`} />
            </div>
            <div className="cov-wrap" style={{ marginTop: 16 }}>
              <table className="cov-table">
                <thead><tr><th align="left">Week of</th><th>Incidents</th><th>False pos.</th><th>Acked %</th><th>MTTA</th><th>MTTR</th></tr></thead>
                <tbody>
                  {[...weeks].reverse().map((w) => (
                    <tr key={w.week}>
                      <td align="left" className="cov-risk">{w.week}</td>
                      <td>{w.incidents}</td>
                      <td>{w.falsePositives}</td>
                      <td>{w.ackedPct}%</td>
                      <td>{w.mttaMin == null ? '—' : `${w.mttaMin}m`}</td>
                      <td>{w.mttrMin == null ? '—' : `${w.mttrMin}m`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
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

// A compact bar chart of one weekly metric, newest on the right.
function TrendPanel({ title, rows, pick, fmt }: { title: string; rows: WeekRow[]; pick: (w: WeekRow) => number | null; fmt: (v: number | null) => string }) {
  const vals = rows.map(pick);
  const nums = vals.filter((v): v is number => v != null);
  const max = nums.length ? Math.max(...nums) : 1;
  const latest = vals[vals.length - 1];
  const W = 300, H = 84, pad = 6, n = rows.length;
  const bw = (W - 2 * pad) / n;
  return (
    <div className="metric-card">
      <div className="metric-head"><span className="metric-key">{title}</span><span className="metric-val">{fmt(latest)}</span></div>
      <svg viewBox={`0 0 ${W} ${H}`} className="metric-svg" preserveAspectRatio="none">
        {rows.map((_, i) => {
          const v = vals[i];
          if (v == null) return null;
          const h = max > 0 ? (v / max) * (H - 2 * pad) : 0;
          return <rect key={i} x={pad + i * bw + 1} y={H - pad - h} width={Math.max(1, bw - 2)} height={Math.max(0, h)} fill={i === n - 1 ? '#0a0a0a' : '#c7ccd4'} />;
        })}
      </svg>
    </div>
  );
}
