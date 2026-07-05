import React from 'react';

/**
 * MetricChart — the interactive metric line for detail/drill-down views. Adds
 * everything Sparkline lacks: hover crosshair + value/timestamp tooltip, an inline
 * detector threshold line (the actual trigger, labeled), the normal-range band,
 * dashed mean, and fired-point markers. Responsive width via a ResizeObserver.
 */
export function MetricChart({
  points,               // [{ t, value }] or [number]
  height = 220,
  band = null,          // { lo, hi }
  mean = null,
  threshold = null,     // { value, label } — inline trigger line
  fired = [],           // indices
  unit = '',
  stroke = 'var(--ink)',
  className = '',
  ...rest
}) {
  const wrapRef = React.useRef(null);
  const [w, setW] = React.useState(720);
  const [hover, setHover] = React.useState(null);

  React.useEffect(() => {
    if (!wrapRef.current || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver((entries) => { for (const e of entries) setW(Math.max(240, e.contentRect.width)); });
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  const data = points.map((p, i) => (typeof p === 'number' ? { t: i, value: p } : p));
  const n = data.length;
  const padL = 46, padR = 14, padT = 12, padB = 24;
  const innerW = w - padL - padR, innerH = height - padT - padB;

  const vals = data.map((d) => d.value);
  let lo = Math.min(...vals), hi = Math.max(...vals);
  if (band) { lo = Math.min(lo, band.lo); hi = Math.max(hi, band.hi); }
  if (threshold) { lo = Math.min(lo, threshold.value); hi = Math.max(hi, threshold.value); }
  const range = (hi - lo) || 1;
  const pad = range * 0.08;
  lo -= pad; hi += pad;
  const R = hi - lo;

  const x = (i) => padL + (n <= 1 ? 0 : (i / (n - 1)) * innerW);
  const y = (v) => padT + (1 - (v - lo) / R) * innerH;
  const line = vals.map((v, i) => `${x(i)},${y(v)}`).join(' ');
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => lo + R * f);
  const firedSet = new Set(fired);

  const fmt = (v) => {
    const s = Math.abs(v) >= 100 ? v.toFixed(0) : v.toFixed(1);
    return unit === '$' ? `$${s}` : `${s}${unit}`;
  };
  const fmtT = (d) => d.label || (typeof d.t === 'string' ? d.t : `t${d.t}`);

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * w;
    const i = Math.max(0, Math.min(n - 1, Math.round(((px - padL) / innerW) * (n - 1))));
    setHover(i);
  };

  return (
    <div ref={wrapRef} className={`sds-mchart ${className}`.trim()} style={{ width: '100%' }} {...rest}>
      <svg viewBox={`0 0 ${w} ${height}`} width="100%" height={height} style={{ display: 'block' }}
        onMouseMove={onMove} onMouseLeave={() => setHover(null)} role="img" aria-label="metric chart">
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={padL} x2={padL + innerW} y1={y(t)} y2={y(t)} stroke="var(--border)" strokeWidth="1" />
            <text x={padL - 8} y={y(t) + 3} textAnchor="end" fontSize="10.5" fill="var(--faint)" fontFamily="var(--font-mono)">{fmt(t)}</text>
          </g>
        ))}
        {band ? <rect x={padL} y={y(band.hi)} width={innerW} height={Math.max(1, y(band.lo) - y(band.hi))} fill="var(--ink)" fillOpacity="0.06" /> : null}
        {mean != null ? <line x1={padL} x2={padL + innerW} y1={y(mean)} y2={y(mean)} stroke="var(--faint)" strokeWidth="0.8" strokeDasharray="3 3" /> : null}
        {threshold ? (
          <g>
            <line x1={padL} x2={padL + innerW} y1={y(threshold.value)} y2={y(threshold.value)} stroke="var(--critical)" strokeWidth="1.4" strokeDasharray="5 3" />
            <rect x={padL + innerW - 96} y={y(threshold.value) - 17} width="96" height="15" rx="3" fill="var(--critical)" />
            <text x={padL + innerW - 48} y={y(threshold.value) - 6} textAnchor="middle" fontSize="9.5" fill="#fff" fontFamily="var(--font-mono)" fontWeight="600">{threshold.label || `trigger ${fmt(threshold.value)}`}</text>
          </g>
        ) : null}
        <polyline points={line} fill="none" stroke={stroke} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
        {[...firedSet].map((i) => <circle key={i} cx={x(i)} cy={y(vals[i])} r="3" fill="var(--critical)" />)}
        {hover != null ? (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={padT} y2={padT + innerH} stroke="var(--ink)" strokeWidth="1" strokeOpacity="0.25" />
            <circle cx={x(hover)} cy={y(vals[hover])} r="3.5" fill="var(--ink)" stroke="#fff" strokeWidth="1.5" />
          </g>
        ) : null}
      </svg>
      {hover != null ? (
        <div style={{ position: 'relative', height: 0 }}>
          <div style={{ position: 'absolute', left: Math.min(w - 150, Math.max(0, x(hover) - 60)), top: -height + 6,
            background: 'var(--ink)', color: '#fff', borderRadius: 6, padding: '5px 8px', fontSize: 11, pointerEvents: 'none', whiteSpace: 'nowrap', boxShadow: 'var(--shadow-pop)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{fmt(vals[hover])}</div>
            <div style={{ fontFamily: 'var(--font-mono)', opacity: 0.7, fontSize: 10 }}>{fmtT(data[hover])}</div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
