import React from 'react';
import { Sparkline } from './Sparkline.jsx';

const STYLE_ID = 'sds-metriccard';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .sds-metric { border: 1px solid var(--border); border-radius: var(--radius); padding: 10px 12px; background: var(--panel); }
  .sds-metric__head { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; margin-bottom: 6px; }
  .sds-metric__key { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--muted); }
  .sds-metric__val { font-family: var(--font-mono); font-weight: var(--weight-semibold); font-size: var(--text-13); font-variant-numeric: tabular-nums; color: var(--ink); }
  .sds-metric__val--out { color: var(--critical); }
  .sds-metric__foot { font-size: 10.5px; color: var(--faint); margin-top: 4px; }
  `;
  document.head.appendChild(el);
}

/**
 * MetricCard — a single metric in the explorer: key + latest value + a Sparkline
 * with its normal-range band. Value turns red when the latest sample is out of band.
 */
export function MetricCard({ metricKey, value, points, mean, sd, band, foot, outOfBand, className = '', ...rest }) {
  const resolvedBand = band || (mean != null && sd != null ? { lo: mean - 2 * sd, hi: mean + 2 * sd } : null);
  const last = points && points.length ? (typeof points[points.length - 1] === 'number' ? points[points.length - 1] : points[points.length - 1].value) : null;
  const out = outOfBand != null ? outOfBand : (resolvedBand && last != null ? (last > resolvedBand.hi || last < resolvedBand.lo) : false);
  return (
    <div className={`sds-metric ${className}`.trim()} {...rest}>
      <div className="sds-metric__head">
        <span className="sds-metric__key">{metricKey}</span>
        <span className={`sds-metric__val ${out ? 'sds-metric__val--out' : ''}`}>{value}</span>
      </div>
      <Sparkline points={points} mean={mean} band={resolvedBand} width={300} height={84} />
      {foot ? <div className="sds-metric__foot">{foot}</div> : null}
    </div>
  );
}
