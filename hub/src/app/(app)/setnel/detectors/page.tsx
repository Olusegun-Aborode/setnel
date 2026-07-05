import { redirect } from 'next/navigation';
import { isAuthed } from '@/lib/session';
import { getDetectorRegistry, getBaselineMetrics, type DetectorRow } from '@/lib/admin';
import { setDetectorEnabled, setDetectorSeverity, setBaselineThreshold } from '../config-actions';

export const dynamic = 'force-dynamic';

const SEV_OPTS = ['info', 'warning', 'critical', 'emergency'] as const;

function timeAgo(iso: string | null): string {
  if (!iso) return 'never';
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return h < 24 ? `${h}h ago` : `${Math.floor(h / 24)}d ago`;
}

export default async function DetectorsPage() {
  if (!(await isAuthed())) redirect('/login');
  const [detectors, baselines] = await Promise.all([getDetectorRegistry(), getBaselineMetrics()]);

  const groups = new Map<string, DetectorRow[]>();
  for (const d of detectors) {
    const list = groups.get(d.dashboardId) ?? [];
    list.push(d);
    groups.set(d.dashboardId, list);
  }

  const enabledCount = detectors.filter((d) => d.enabled).length;
  const tuned = baselines.filter((b) => b.z != null || b.minPct != null || !b.enabled).length;

  return (
    <>
      <section className="panel">
        <div className="panel-head"><h2>Detectors</h2><span className="panel-note">every detection rule, and how to tune it</span></div>
        <div className="kpis" style={{ marginTop: 4 }}>
          <div className="kpi"><div className="kpi-label">Detectors</div><div className="kpi-value">{detectors.length}</div><div className="kpi-sub">{enabledCount} enabled</div></div>
          <div className="kpi"><div className="kpi-label">Dashboards</div><div className="kpi-value">{groups.size}</div><div className="kpi-sub">with detectors</div></div>
          <div className="kpi"><div className="kpi-label">Baseline metrics</div><div className="kpi-value">{baselines.length}</div><div className="kpi-sub">{tuned} tuned</div></div>
        </div>
        <p className="panel-note" style={{ marginTop: 12 }}>
          Disabling a detector drops its events at ingest (no incident, no page). Severity override replaces the
          detector&rsquo;s own severity on every future incident. Changes take effect on the next detector run and are logged to the <a className="card-detail" href="/setnel/inbox">Inbox</a>.
        </p>
      </section>

      {[...groups.entries()].map(([dashboardId, rows]) => (
        <section className="panel" key={dashboardId}>
          <div className="panel-head"><h2>{dashboardId}</h2><span className="panel-note">{rows.length} detectors</span></div>
          <div className="cov-wrap">
            <table className="cov-table">
              <thead>
                <tr>
                  <th align="left">Detector</th>
                  <th>90-day fires</th>
                  <th>False&nbsp;pos.</th>
                  <th>Last seen</th>
                  <th>Severity</th>
                  <th>State</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((d) => {
                  const fpRate = d.total > 0 ? Math.round((d.falsePositives / d.total) * 100) : 0;
                  return (
                    <tr key={d.detectorId}>
                      <td align="left" className="cov-risk">{d.detectorId}</td>
                      <td>{d.total}</td>
                      <td className={fpRate >= 30 ? 'cov-blocked' : ''}>{d.falsePositives}{d.total ? ` · ${fpRate}%` : ''}</td>
                      <td>{timeAgo(d.lastSeen)}</td>
                      <td align="left">
                        <form action={setDetectorSeverity} className="actor-form">
                          <input type="hidden" name="dashboardId" value={d.dashboardId} />
                          <input type="hidden" name="detectorId" value={d.detectorId} />
                          <select name="severity" defaultValue={d.severityOverride ?? ''} className="actor-input" style={{ width: 120 }}>
                            <option value="">detector default</option>
                            {SEV_OPTS.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <button className="ghost-btn" type="submit">Set</button>
                        </form>
                      </td>
                      <td align="left">
                        <form action={setDetectorEnabled}>
                          <input type="hidden" name="dashboardId" value={d.dashboardId} />
                          <input type="hidden" name="detectorId" value={d.detectorId} />
                          <input type="hidden" name="enabled" value={d.enabled ? 'false' : 'true'} />
                          <button className={`act ${d.enabled ? '' : 'act-primary'}`} type="submit">
                            {d.enabled ? 'Disable' : 'Enable'}
                          </button>
                        </form>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      <section className="panel">
        <div className="panel-head"><h2>Baseline anomaly thresholds</h2><span className="panel-note">per-metric tuning for the adaptive detector</span></div>
        <p className="panel-note" style={{ marginBottom: 12 }}>
          The baseline detector fires when a metric moves beyond both a sigma (z) threshold and a minimum percent. Leave a
          field blank to use the global default (z {process.env.SETNEL_BASELINE_Z || '3'}, min {process.env.SETNEL_BASELINE_MIN_PCT || '8'}%). Disable to silence anomaly alerts for that metric.
        </p>
        <div className="cov-wrap">
          <table className="cov-table">
            <thead>
              <tr>
                <th align="left">Metric</th>
                <th>Samples</th>
                <th>z threshold</th>
                <th>Min %</th>
                <th>State</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {baselines.length === 0 ? (
                <tr><td align="left" colSpan={6} className="panel-note">No sampled metrics yet.</td></tr>
              ) : baselines.map((b) => (
                <tr key={b.metricKey}>
                  <td align="left" className="cov-risk" style={{ verticalAlign: 'middle' }}>{b.metricKey}</td>
                  <td style={{ verticalAlign: 'middle' }}>{b.samples}</td>
                  <td colSpan={4} align="left">
                    <form action={setBaselineThreshold} className="actor-form" style={{ flexWrap: 'wrap' }}>
                      <input type="hidden" name="metricKey" value={b.metricKey} />
                      <input className="actor-input" style={{ width: 90 }} name="z" type="number" step="0.1" min="0" defaultValue={b.z ?? ''} placeholder="default" />
                      <input className="actor-input" style={{ width: 90 }} name="minPct" type="number" step="0.5" min="0" defaultValue={b.minPct ?? ''} placeholder="default" />
                      <select name="enabled" defaultValue={String(b.enabled)} className="actor-input" style={{ width: 100 }}>
                        <option value="true">enabled</option>
                        <option value="false">disabled</option>
                      </select>
                      <button className="act act-primary" type="submit">Save</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
