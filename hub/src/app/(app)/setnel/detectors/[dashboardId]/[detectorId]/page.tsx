import { redirect, notFound } from 'next/navigation';
import { isAuthed } from '@/lib/session';
import { getDetectorRegistry, getBaselineMetrics, getBaselineFpCounts } from '@/lib/admin';
import { getIncidents, getMetricsForDashboard } from '@/lib/queries';
import { setDetectorEnabled, setDetectorSeverity } from '../../../config-actions';
import { muteDetector } from '../../../actions';
import { IncidentCard, timeAgo } from '../../../incident-card';
import { BacktestTuner } from './tuner';

export const dynamic = 'force-dynamic';

const SEV_OPTS = ['info', 'warning', 'critical', 'emergency'] as const;

export default async function DetectorDetail({ params }: { params: Promise<{ dashboardId: string; detectorId: string }> }) {
  if (!(await isAuthed())) redirect('/login');
  const { dashboardId, detectorId: raw } = await params;
  const detectorId = decodeURIComponent(raw);

  const [registry, incidents, metrics, baselines, fpCounts] = await Promise.all([
    getDetectorRegistry(),
    getIncidents({ dashboardId, status: 'all' }),
    getMetricsForDashboard(dashboardId),
    getBaselineMetrics(),
    getBaselineFpCounts(dashboardId),
  ]);

  const d = registry.find((x) => x.dashboardId === dashboardId && x.detectorId === detectorId);
  if (!d) notFound();

  const mine = incidents.filter((i) => i.detector_id === detectorId);
  const active = mine.filter((i) => i.status === 'active');
  const fpRate = d.total > 0 ? Math.round((d.falsePositives / d.total) * 100) : 0;
  const isBaseline = detectorId === 'baseline.anomaly';

  // Build the tuner's per-metric input: this dashboard's history, saved overrides,
  // and how many false positives each metric has produced (drives suggestions).
  const savedByKey = new Map(baselines.map((b) => [b.metricKey, b]));
  const tunerMetrics = isBaseline
    ? metrics.map((m) => ({
        metricKey: m.metricKey,
        values: m.points.map((p) => p.value),
        savedZ: savedByKey.get(m.metricKey)?.z ?? null,
        savedMinPct: savedByKey.get(m.metricKey)?.minPct ?? null,
        fpCount: fpCounts.get(m.metricKey) ?? 0,
      }))
    : [];

  return (
    <>
      <section className="panel">
        <div className="card-meta" style={{ marginBottom: 8 }}>
          <a className="card-detail" href="/setnel/detectors">← detectors</a><span>·</span>
          <a className="card-detail" href={`/setnel/dashboards/${dashboardId}`}>{dashboardId}</a>
        </div>
        <div className="panel-head"><h2>{detectorId}</h2><span className="panel-note">{d.enabled ? 'enabled' : 'disabled'}{d.severityOverride ? ` · severity forced to ${d.severityOverride}` : ''}</span></div>
        <div className="kpis" style={{ marginTop: 4 }}>
          <div className="kpi"><div className="kpi-label">90-day fires</div><div className="kpi-value">{d.total}</div><div className="kpi-sub">incidents</div></div>
          <div className={`kpi ${fpRate >= 30 ? 'kpi-bad' : ''}`}><div className="kpi-label">False positives</div><div className="kpi-value">{d.falsePositives}</div><div className="kpi-sub">{fpRate}% of fires</div></div>
          <div className={`kpi ${active.length ? 'kpi-warn' : 'kpi-good'}`}><div className="kpi-label">Active now</div><div className="kpi-value">{active.length}</div><div className="kpi-sub">open incidents</div></div>
          <div className="kpi"><div className="kpi-label">Last seen</div><div className="kpi-value" style={{ fontSize: 16 }}>{timeAgo(d.lastSeen)}</div><div className="kpi-sub">most recent fire</div></div>
        </div>

        <div className="actions">
          <form action={setDetectorEnabled}>
            <input type="hidden" name="dashboardId" value={dashboardId} />
            <input type="hidden" name="detectorId" value={detectorId} />
            <input type="hidden" name="enabled" value={d.enabled ? 'false' : 'true'} />
            <button className={`act ${d.enabled ? 'act-danger' : 'act-primary'}`} type="submit">{d.enabled ? 'Disable detector' : 'Enable detector'}</button>
          </form>
          <form action={setDetectorSeverity} className="actor-form">
            <input type="hidden" name="dashboardId" value={dashboardId} />
            <input type="hidden" name="detectorId" value={detectorId} />
            <select name="severity" defaultValue={d.severityOverride ?? ''} className="actor-input" style={{ width: 140 }}>
              <option value="">severity: default</option>
              {SEV_OPTS.map((s) => <option key={s} value={s}>force {s}</option>)}
            </select>
            <button className="act" type="submit">Set severity</button>
          </form>
          <form action={muteDetector}>
            <input type="hidden" name="dashboardId" value={dashboardId} />
            <input type="hidden" name="detectorId" value={detectorId} />
            <input type="hidden" name="minutes" value="1440" />
            <button className="act" type="submit">Mute 24h</button>
          </form>
        </div>
      </section>

      {isBaseline ? (
        <section className="panel">
          <div className="panel-head"><h2>Live tune from backtest</h2><span className="panel-note">drag thresholds, watch the would-fire count over stored history</span></div>
          {tunerMetrics.length === 0 ? (
            <div className="empty">No metric history for this dashboard yet.</div>
          ) : (
            <BacktestTuner metrics={tunerMetrics} />
          )}
        </section>
      ) : (
        <section className="panel">
          <div className="panel-head"><h2>Tuning</h2></div>
          <p className="panel-note">
            This detector is code-defined in the dashboard&rsquo;s repo — its firing logic lives there, not in a threshold you can drag.
            From here you can disable it, override its severity, or mute it. Only the adaptive <code>baseline.anomaly</code> detector supports live threshold tuning.
          </p>
        </section>
      )}

      <section className="panel">
        <div className="panel-head"><h2>Recent incidents</h2><span className="panel-note">{mine.length} from this detector</span></div>
        <ul className="feed">
          {mine.length === 0 ? <li className="empty">None yet.</li> : mine.slice(0, 20).map((i) => <IncidentCard key={i.id} i={i} />)}
        </ul>
      </section>
    </>
  );
}
