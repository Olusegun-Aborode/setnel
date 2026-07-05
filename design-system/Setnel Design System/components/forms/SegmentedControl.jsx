import React from 'react';

const STYLE_ID = 'sds-segmented';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .sds-seg { display: inline-flex; flex-wrap: wrap; gap: 4px; padding: 3px;
    background: var(--panel-2); border: 1px solid var(--border); border-radius: var(--radius); }
  .sds-seg__btn {
    font-family: var(--font-sans); font-size: var(--text-sm); color: var(--muted);
    background: transparent; border: none; cursor: pointer; padding: 5px 10px;
    border-radius: var(--radius-sm); transition: var(--transition-control); white-space: nowrap;
  }
  .sds-seg__btn:hover { color: var(--ink); }
  .sds-seg__btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }
  .sds-seg__btn--on { background: var(--white); color: var(--ink); font-weight: var(--weight-semibold); box-shadow: var(--shadow-seg); }
  `;
  document.head.appendChild(el);
}

/** Segmented control — the trend-chart breakdown switcher. */
export function SegmentedControl({ options, value, onChange, className = '', ...rest }) {
  return (
    <div className={`sds-seg ${className}`.trim()} role="tablist" {...rest}>
      {options.map((o) => {
        const key = typeof o === 'string' ? o : o.value;
        const label = typeof o === 'string' ? o : o.label;
        const on = key === value;
        return (
          <button key={key} role="tab" aria-selected={on}
            className={`sds-seg__btn ${on ? 'sds-seg__btn--on' : ''}`}
            onClick={() => onChange && onChange(key)}>
            {label}
          </button>
        );
      })}
    </div>
  );
}
