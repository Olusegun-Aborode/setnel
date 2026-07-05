import React from 'react';

const STYLE_ID = 'sds-statcard';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .sds-stat {
    display: flex; flex-direction: column; gap: 2px; padding: var(--pad-kpi);
    background: var(--panel); border: 1px solid var(--border); border-radius: var(--radius); min-width: 0;
  }
  .sds-stat__label { font-size: var(--text-2xs); text-transform: uppercase; letter-spacing: var(--tracking-caps); color: var(--muted); }
  .sds-stat__value {
    font-family: var(--font-sans); font-weight: var(--weight-bold); font-size: var(--text-kpi);
    letter-spacing: var(--tracking-tighter); color: var(--ink); font-variant-numeric: tabular-nums;
    margin: 6px 0 2px; line-height: 1.05;
  }
  .sds-stat--good .sds-stat__value { color: var(--good); }
  .sds-stat--warn .sds-stat__value { color: var(--warning); }
  .sds-stat--bad  .sds-stat__value { color: var(--critical); }
  .sds-stat__sub { font-size: var(--text-xs); color: var(--faint); }
  `;
  document.head.appendChild(el);
}

/** StatCard (KPI) — console header metric. Tone tints the value only. */
export function StatCard({ label, value, sub, tone, className = '', ...rest }) {
  const cls = ['sds-stat', tone ? `sds-stat--${tone}` : '', className].filter(Boolean).join(' ');
  return (
    <div className={cls} {...rest}>
      <div className="sds-stat__label">{label}</div>
      <div className="sds-stat__value">{value}</div>
      {sub ? <div className="sds-stat__sub">{sub}</div> : null}
    </div>
  );
}
