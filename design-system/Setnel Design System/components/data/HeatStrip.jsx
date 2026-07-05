import React from 'react';

const STYLE_ID = 'sds-heatstrip';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .sds-heat { display: inline-flex; gap: 3px; }
  .sds-heat__cell { width: 14px; height: 14px; border-radius: 3px; flex: none; }
  .sds-heat__cell--0 { background: var(--lvl0); }
  .sds-heat__cell--1 { background: var(--lvl1); }
  .sds-heat__cell--2 { background: var(--lvl2); }
  .sds-heat__cell--3 { background: var(--lvl3); }
  `;
  document.head.appendChild(el);
}

/** Map a raw check count to a 0–3 heat level (mirrors the app's ~288/day target). */
export function heatLevel(checks) {
  if (checks <= 0) return 0;
  if (checks < 60) return 1;
  if (checks < 200) return 2;
  return 3;
}

/**
 * HeatStrip — a row of collection-heat cells (dashboard-health matrix). Pass
 * `levels` (0–3) directly, or raw `checks` counts to be bucketed.
 */
export function HeatStrip({ levels, checks, days, className = '', ...rest }) {
  const cells = levels != null
    ? levels
    : (checks || []).map((c) => heatLevel(c));
  return (
    <span className={`sds-heat ${className}`.trim()} {...rest}>
      {cells.map((lvl, i) => (
        <span
          key={i}
          className={`sds-heat__cell sds-heat__cell--${lvl}`}
          title={days && days[i] ? `${days[i]}: level ${lvl}` : `level ${lvl}`}
        />
      ))}
    </span>
  );
}
