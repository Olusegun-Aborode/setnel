import React from 'react';

/**
 * Sparkline — the compact metric line used across Metrics, Backtest and incident
 * detail. Optionally shades a normal-range band (mean ±2σ), marks fired points,
 * and dots the latest value red when it sits out of band.
 */
export function Sparkline({
  points,
  width = 300,
  height = 84,
  pad = 6,
  band = null,          // { lo, hi } in value units — draws the grey normal-range band
  mean = null,          // draws a dashed baseline
  fired = [],           // indices to mark (backtest fires)
  stroke = 'var(--ink)',
  strokeWidth = 1.6,
  showLast = true,
  className = '',
  ...rest
}) {
  const vals = points.map((p) => (typeof p === 'number' ? p : p.value));
  const n = vals.length;
  if (n === 0) return <svg width={width} height={height} className={className} {...rest} />;

  let lo = Math.min(...vals);
  let hi = Math.max(...vals);
  if (band) { lo = Math.min(lo, band.lo); hi = Math.max(hi, band.hi); }
  const range = hi - lo || 1;
  const x = (i) => pad + (n <= 1 ? 0 : (i / (n - 1)) * (width - 2 * pad));
  const y = (v) => pad + (1 - (v - lo) / range) * (height - 2 * pad);

  const line = vals.map((v, i) => `${x(i)},${y(v)}`).join(' ');
  const last = vals[n - 1];
  const outOfBand = band ? (last > band.hi || last < band.lo) : false;
  const firedSet = new Set(fired);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}
         preserveAspectRatio="none" className={`sds-spark ${className}`.trim()}
         role="img" aria-label="metric sparkline" {...rest}>
      {band ? (
        <rect x={pad} y={y(band.hi)} width={width - 2 * pad}
              height={Math.max(1, y(band.lo) - y(band.hi))}
              fill="var(--ink)" fillOpacity="0.06" />
      ) : null}
      {mean != null ? (
        <line x1={pad} x2={width - pad} y1={y(mean)} y2={y(mean)}
              stroke="var(--faint)" strokeWidth="0.8" strokeDasharray="3 3" />
      ) : null}
      <polyline points={line} fill="none" stroke={stroke} strokeWidth={strokeWidth}
                strokeLinejoin="round" strokeLinecap="round" />
      {[...firedSet].map((i) => (
        <circle key={i} cx={x(i)} cy={y(vals[i])} r="2.6" fill="var(--critical)" />
      ))}
      {showLast ? (
        <circle cx={x(n - 1)} cy={y(last)} r="3"
                fill={outOfBand ? 'var(--critical)' : stroke} />
      ) : null}
    </svg>
  );
}
