import { redirect } from 'next/navigation';
import { isAuthed } from '@/lib/session';
import { getMetricsOverview, type MetricSeries } from '@/lib/queries';
import { backtestFires } from '@/lib/detect';

export const dynamic = 'force-dynamic';

const Z = 3, MIN_PCT = 8, MIN_SAMPLES = 20, WINDOW = 400;

export default async function BacktestPage() {
  if (!(await isAuthed())) redirect('/login');
  const metrics = await getMetricsOverview(200);
  const results = metrics.map((m) => ({ m, fired: backtestFires(m.points.map((p) => p.value), { z: Z, minPct: MIN_PCT, window: WINDOW, minSamples: MIN_SAMPLES }) }));

  return (
    <>
      <section className="panel">
        <div className="panel-head">
          <h2>Threshold backtest</h2>
          <span className="panel-note">replaying the adaptive rule (|z|&gt;{Z}, move&gt;{MIN_PCT}%) over stored history · red = would have fired</span>
        </div>
        {results.length === 0 ? (
          <div className="empty">Not enough history yet — backtest needs more samples per metric.</div>
        ) : (
          <div className="metric-grid">
            {results.map(({ m, fired }) => (
              <div className="metric-card" key={`${m.dashboardId}.${m.metricKey}`}>
                <div className="metric-head">
                  <span className="metric-key">{m.metricKey}</span>
                  <span className="metric-val" style={{ color: fired.length > 3 ? '#dc2626' : fired.length > 0 ? '#b45309' : '#15803d' }}>
                    {m.points.length <= MIN_SAMPLES ? 'low data' : `${fired.length} fires`}
                  </span>
                </div>
                <BtChart m={m} fired={fired} />
                <div className="bt-note">{m.dashboardName} · {m.points.length} samples</div>
              </div>
            ))}
          </div>
        )}
        <p className="panel-note" style={{ marginTop: 14 }}>
          Many fires on a metric = the threshold is too sensitive for its volatility; zero across a known event = too loose.
          Tune <code>SETNEL_BASELINE_Z</code> / <code>SETNEL_BASELINE_MIN_PCT</code> and re-check.
        </p>
      </section>
    </>
  );
}

function BtChart({ m, fired }: { m: MetricSeries; fired: number[] }) {
  const W = 300, H = 84, pad = 6;
  const vals = m.points.map((p) => p.value);
  const lo = Math.min(...vals), hi = Math.max(...vals);
  const range = hi - lo || 1;
  const n = m.points.length;
  const x = (i: number) => pad + (i / (n - 1)) * (W - 2 * pad);
  const y = (v: number) => pad + (1 - (v - lo) / range) * (H - 2 * pad);
  const line = m.points.map((p, i) => `${x(i)},${y(p.value)}`).join(' ');
  const firedSet = new Set(fired);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="metric-svg" preserveAspectRatio="none">
      <polyline points={line} fill="none" stroke="#0a0a0a" strokeWidth={1.4} strokeLinejoin="round" />
      {m.points.map((p, i) => (firedSet.has(i) ? <circle key={i} cx={x(i)} cy={y(p.value)} r={2.6} fill="#dc2626" /> : null))}
    </svg>
  );
}
