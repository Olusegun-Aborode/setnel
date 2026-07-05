import React from 'react';

const STYLE_ID = 'sds-timerange';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .sds-tr { display: inline-flex; align-items: center; border: 1px solid var(--border-strong); border-radius: var(--radius-btn); overflow: hidden; }
  .sds-tr__btn {
    font-family: var(--font-sans); font-size: var(--text-sm); color: var(--muted); background: var(--panel);
    border: none; border-left: 1px solid var(--border); cursor: pointer; padding: 6px 10px; transition: var(--transition-control); line-height: 1;
  }
  .sds-tr__btn:first-child { border-left: none; }
  .sds-tr__btn:hover { color: var(--ink); background: var(--panel-2); }
  .sds-tr__btn--on { background: var(--ink); color: #fff; }
  .sds-tr__btn--on:hover { background: var(--ink); color: #fff; }
  `;
  document.head.appendChild(el);
}

const PRESETS = [
  { value: '1h', label: '1h' }, { value: '24h', label: '24h' },
  { value: '7d', label: '7d' }, { value: '30d', label: '30d' },
];

/** TimeRange — global range picker every chart + feed respects. */
export function TimeRange({ value = '24h', onChange, presets = PRESETS, className = '', ...rest }) {
  return (
    <div className={`sds-tr ${className}`.trim()} role="group" aria-label="Time range" {...rest}>
      {presets.map((p) => (
        <button key={p.value} className={`sds-tr__btn ${p.value === value ? 'sds-tr__btn--on' : ''}`}
          onClick={() => onChange && onChange(p.value)}>{p.label}</button>
      ))}
    </div>
  );
}
