// Multi-line trend chart — replicates the app's TrendChart (breakdown switcher +
// toggleable legend). Uses the design-system series palette.
const TREND_PALETTE = [
  'var(--series-1)','var(--series-2)','var(--series-3)','var(--series-4)','var(--series-5)',
  'var(--series-6)','var(--series-7)','var(--series-8)','var(--series-9)','var(--series-10)',
];

function niceCeil(v) {
  if (v <= 10) return 10;
  const mag = Math.pow(10, Math.floor(Math.log10(v)));
  const f = v / mag; const nf = f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10;
  return nf * mag;
}
function abbrev(n) { return n >= 1000 ? `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : String(n); }
function fmtDay(iso) { return iso ? new Date(iso + 'T00:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }) : ''; }

function MultiLine({ days, series, allSeries }) {
  const W = 900, H = 240, padL = 46, padR = 14, padT = 14, padB = 28;
  const innerW = W - padL - padR, innerH = H - padT - padB;
  let max = 1; for (const s of series) for (const v of s.values) if (v > max) max = v;
  max = niceCeil(max);
  const n = days.length;
  const x = (i) => padL + (n <= 1 ? 0 : (i / (n - 1)) * innerW);
  const y = (v) => padT + innerH - (v / max) * innerH;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(max * f));
  const xLabels = [0, Math.floor((n - 1) / 2), n - 1];
  const colorFor = (key, i) => TREND_PALETTE[(allSeries.findIndex((s) => s.key === key) + (i * 0)) % TREND_PALETTE.length] || TREND_PALETTE[i % TREND_PALETTE.length];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }} role="img" aria-label="Trend">
      {ticks.map((t) => (
        <g key={t}>
          <line x1={padL} x2={padL + innerW} y1={y(t)} y2={y(t)} stroke="var(--border-hairline)" strokeWidth={1} />
          <text x={padL - 8} y={y(t) + 3} textAnchor="end" fontSize={11} fill="var(--text-faint)" fontFamily="var(--font-mono)">{abbrev(t)}</text>
        </g>
      ))}
      {xLabels.map((i) => (
        <text key={i} x={x(i)} y={H - 9} textAnchor="middle" fontSize={11} fill="var(--text-faint)" fontFamily="var(--font-mono)">{fmtDay(days[i])}</text>
      ))}
      {series.map((s) => (
        <polyline key={s.key} points={s.values.map((v, i) => `${x(i)},${y(v)}`).join(' ')}
          fill="none" stroke={colorFor(s.key)} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      ))}
    </svg>
  );
}

function TrendChart({ bundle, days }) {
  const { SegmentedControl } = window.SetnelDesignSystem_525d6e;
  const DIMS = [
    { value: 'collectionByDashboard', label: 'Collection · by dashboard' },
    { value: 'alertsByCategory', label: 'Alerts · by category' },
  ];
  const [dim, setDim] = React.useState('collectionByDashboard');
  const [hidden, setHidden] = React.useState(new Set());
  const series = bundle[dim];
  const colorFor = (key, i) => TREND_PALETTE[(series.findIndex((s) => s.key === key)) % TREND_PALETTE.length];
  const toggle = (key) => setHidden((prev) => { const nx = new Set(prev); nx.has(key) ? nx.delete(key) : nx.add(key); return nx; });
  const visible = series.filter((s) => !hidden.has(s.key));
  return (
    <div>
      <div style={{ marginBottom: 14 }}>
        <SegmentedControl value={dim} onChange={(k) => { setDim(k); setHidden(new Set()); }} options={DIMS} />
      </div>
      <MultiLine days={days} series={visible} allSeries={series} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 12 }}>
        {series.map((s, i) => (
          <button key={s.key} onClick={() => toggle(s.key)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'none', border: 'none', cursor: 'pointer',
              font: 'var(--font-body-sm)', color: 'var(--text-secondary)', opacity: hidden.has(s.key) ? 0.35 : 1, padding: 0 }}>
            <span style={{ width: 11, height: 11, borderRadius: 3, background: colorFor(s.key, i) }} />
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { TrendChart });
