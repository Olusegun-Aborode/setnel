import { redirect } from 'next/navigation';
import { isAuthed } from '@/lib/session';
import { getMetricsOverview, type MetricSeries } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export default async function MetricsPage() {
  if (!(await isAuthed())) redirect('/login');
  const metrics = await getMetricsOverview(200);

  // Group by dashboard.
  const byDash = new Map<string, MetricSeries[]>();
  for (const m of metrics) {
    const list = byDash.get(m.dashboardName) ?? [];
    list.push(m);
    byDash.set(m.dashboardName, list);
  }

  return (
    <>

      {byDash.size === 0 ? (
        <section className="panel"><div className="empty">No metric samples yet — they accumulate as detectors run.</div></section>
      ) : (
        [...byDash.entries()].map(([name, list]) => (
          <section className="panel" key={name}>
            <div className="panel-head"><h2>{name}</h2><span className="panel-note">{list.length} metrics · grey band = normal range (mean ±2σ)</span></div>
            <div className="metric-grid">
              {list.map((m) => (
                <div className="metric-card" key={m.metricKey}>
                  <div className="metric-head">
                    <span className="metric-key">{m.metricKey}</span>
                    <span className="metric-val">{fmtVal(m.metricKey, m.latest)}</span>
                  </div>
                  <BandChart m={m} />
                </div>
              ))}
            </div>
          </section>
        ))
      )}
    </>
  );
}

function fmtVal(key: string, v: number): string {
  if (key.endsWith('_hhi')) return v.toFixed(0);
  if (key.includes('utilization') || key.endsWith('_pct')) return `${v.toFixed(1)}%`;
  if (key.startsWith('sui.') && (key.endsWith('.tvl') || key === 'sui.tvl_total')) return `$${v.toFixed(1)}M`;
  if (key.startsWith('aave.')) {
    const a = Math.abs(v);
    if (a >= 1e9) return `$${(v / 1e9).toFixed(2)}B`;
    if (a >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
    return `$${v.toFixed(0)}`;
  }
  return String(Math.round(v * 100) / 100);
}

// Line chart with the baseline band (mean ±2σ) shaded — "is the current value
// inside its normal range?" at a glance.
function BandChart({ m }: { m: MetricSeries }) {
  const W = 300, H = 84, pad = 6;
  const vals = m.points.map((p) => p.value);
  const bandLo = m.mean - 2 * m.stddev;
  const bandHi = m.mean + 2 * m.stddev;
  const lo = Math.min(...vals, bandLo);
  const hi = Math.max(...vals, bandHi);
  const range = hi - lo || 1;
  const n = m.points.length;
  const x = (i: number) => pad + (i / (n - 1)) * (W - 2 * pad);
  const y = (v: number) => pad + (1 - (v - lo) / range) * (H - 2 * pad);
  const line = m.points.map((p, i) => `${x(i)},${y(p.value)}`).join(' ');
  const bandTop = y(bandHi);
  const bandBot = y(bandLo);
  const last = m.points[n - 1].value;
  const outOfBand = last > bandHi || last < bandLo;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="metric-svg" preserveAspectRatio="none">
      {m.stddev > 0 ? <rect x={pad} y={bandTop} width={W - 2 * pad} height={Math.max(1, bandBot - bandTop)} fill="#0a0a0a" fillOpacity={0.06} /> : null}
      <line x1={pad} x2={W - pad} y1={y(m.mean)} y2={y(m.mean)} stroke="#9aa3af" strokeWidth={0.7} strokeDasharray="3 3" />
      <polyline points={line} fill="none" stroke="#0a0a0a" strokeWidth={1.6} strokeLinejoin="round" />
      <circle cx={x(n - 1)} cy={y(last)} r={3} fill={outOfBand ? '#dc2626' : '#0a0a0a'} />
    </svg>
  );
}
