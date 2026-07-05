import React from 'react';

const STYLE_ID = 'sds-chip';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .sds-chip {
    display: inline-flex; align-items: center; gap: 6px;
    font-family: var(--font-sans); font-size: var(--text-sm); color: var(--muted);
    background: var(--white); border: 1px solid var(--border-control);
    border-radius: var(--radius-pill); padding: var(--pad-chip); cursor: pointer;
    transition: var(--transition-control); white-space: nowrap; line-height: 1;
  }
  .sds-chip:hover { color: var(--ink); border-color: var(--ink); }
  .sds-chip:focus-visible { outline: none; box-shadow: var(--focus-ring); }
  .sds-chip--on { background: var(--ink); border-color: var(--ink); color: var(--white); font-weight: var(--weight-semibold); }
  .sds-chip--on:hover { color: var(--white); }
  .sds-chip__count { font-family: var(--font-mono); font-size: 10.5px; opacity: 0.65; font-variant-numeric: tabular-nums; }
  `;
  document.head.appendChild(el);
}

/** Filter chip — incident-feed filters. Active inverts to solid ink. */
export function Chip({ children, active = false, count, className = '', as = 'button', ...rest }) {
  const cls = `sds-chip ${active ? 'sds-chip--on' : ''} ${className}`.trim();
  const Tag = as;
  return (
    <Tag className={cls} aria-pressed={as === 'button' ? active : undefined} {...rest}>
      {children}
      {count != null ? <span className="sds-chip__count">{count}</span> : null}
    </Tag>
  );
}
