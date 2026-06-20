import { redirect } from 'next/navigation';
import { isAuthed } from '@/lib/session';
import { getMetricsOverview, type MetricSeries } from '@/lib/queries';

export const dynamic = 'force-dynamic';

const Z = 3, MIN_PCT = 8, MIN_SAMPLES = 20, WINDOW = 400;

// Replay the live baseline rule over history: at each point, compute the rolling
// baseline from PRIOR points and check if it would have fired. Validates whether
// the current thresholds are well-tuned (too many fires = noisy).
function backtest(points: { value: number }[]): number[] {
  const fired: number[] = [];
  for (let i = MIN_SAMPLES; i < points.length; i++) {
    const hist = points.slice(Math.max(0, i - WINDOW), i).map((p) => p.value);
    const mean = hist.reduce((a, b) => a + b, 0) / hist.length;
    const sd = Math.sqrt(hist.reduce((a, b) => a + (b - mean) ** 2, 0) / hist.length);
    if (sd <= 0 || mean === 0) continue;
    const v = points[i].value;
    const z = (v - mean) / sd;
    const pct = ((v - mean) / Math.abs(mean)) * 100;
    if (Math.abs(z) > Z && Math.abs(pct) > MIN_PCT) fired.push(i);
  }
  return fired;
}

export default async function BacktestPage() {
  if (!(await isAuthed())) redirect('/login');
  const metrics = await getMetricsOverview(200);
  const results = metrics.map((m) => ({ m, fired: backtest(m.points) }));

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand"><a href="/setnel" className="back">← Setnel</a><span className="brand-sub">Backtest</span></div>
      </header>
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
    </div>
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
