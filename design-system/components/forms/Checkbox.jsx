import React from 'react';

const STYLE_ID = 'sds-checkbox';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .sds-check { display: inline-flex; align-items: center; gap: 8px; cursor: pointer; user-select: none; }
  .sds-check__box {
    width: 16px; height: 16px; flex: none; border-radius: 4px; border: 1px solid var(--border-strong);
    background: #fff; display: inline-flex; align-items: center; justify-content: center;
    transition: var(--transition-control); color: #fff;
  }
  .sds-check__box svg { width: 11px; height: 11px; opacity: 0; }
  .sds-check--on .sds-check__box { background: var(--ink); border-color: var(--ink); }
  .sds-check--on .sds-check__box svg { opacity: 1; }
  .sds-check--indeterminate .sds-check__box { background: var(--ink); border-color: var(--ink); }
  .sds-check--indeterminate .sds-check__box::after { content: ""; width: 8px; height: 2px; background: #fff; border-radius: 1px; }
  .sds-check__label { font-size: var(--text-13); color: var(--ink-2); }
  .sds-check:focus-visible { outline: none; }
  .sds-check:focus-visible .sds-check__box { box-shadow: var(--focus-ring); }
  `;
  document.head.appendChild(el);
}

/** Checkbox — row selection for bulk actions, multi-select filters. */
export function Checkbox({ checked = false, indeterminate = false, onChange, label, className = '', ...rest }) {
  const state = indeterminate ? 'indeterminate' : (checked ? 'on' : '');
  return (
    <button type="button" role="checkbox" aria-checked={indeterminate ? 'mixed' : checked}
      className={`sds-check ${state ? 'sds-check--' + state : ''} ${className}`.trim()}
      onClick={() => onChange && onChange(!checked)} {...rest}>
      <span className="sds-check__box">
        {!indeterminate ? (
          <svg viewBox="0 0 12 12" fill="none"><path d="M2.5 6.2 5 8.5 9.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        ) : null}
      </span>
      {label ? <span className="sds-check__label">{label}</span> : null}
    </button>
  );
}
