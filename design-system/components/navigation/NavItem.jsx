import React from 'react';

const STYLE_ID = 'sds-navitem';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .sds-nav {
    display: flex; align-items: center; gap: 9px; width: 100%;
    font-family: var(--font-sans); font-size: var(--text-13); font-weight: var(--weight-medium);
    color: var(--ink-2); background: transparent; border: none; cursor: pointer; text-align: left;
    padding: 6px 9px; border-radius: var(--radius-btn); transition: var(--transition-control);
    line-height: 1.2; text-decoration: none;
  }
  .sds-nav:hover { background: var(--surface-hover); color: var(--ink); }
  .sds-nav:focus-visible { outline: none; box-shadow: var(--focus-ring); }
  .sds-nav--active { background: var(--panel-3); color: var(--ink); font-weight: var(--weight-semibold); }
  .sds-nav__icon { width: 16px; height: 16px; flex: none; display: inline-flex; align-items: center; justify-content: center; color: currentColor; }
  .sds-nav__icon svg { width: 16px; height: 16px; }
  .sds-nav__label { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .sds-nav__count {
    flex: none; font-family: var(--font-mono); font-size: 10.5px; font-weight: var(--weight-semibold);
    font-variant-numeric: tabular-nums; padding: 1px 6px; border-radius: var(--radius-pill);
    background: var(--critical-bg); color: var(--critical);
  }
  .sds-nav__count--muted { background: var(--panel-2); color: var(--muted); }
  .sds-nav__dot { flex: none; width: 6px; height: 6px; border-radius: 50%; background: var(--critical); }
  `;
  document.head.appendChild(el);
}

/** NavItem — a row in the app-shell sidebar. Icon + label, optional count/dot. */
export function NavItem({ icon, label, active = false, count, countTone = 'alert', dot = false, as = 'button', className = '', ...rest }) {
  const Tag = as;
  return (
    <Tag className={`sds-nav ${active ? 'sds-nav--active' : ''} ${className}`.trim()}
      aria-current={active ? 'page' : undefined} {...rest}>
      {icon != null ? <span className="sds-nav__icon">{icon}</span> : null}
      <span className="sds-nav__label">{label}</span>
      {dot ? <span className="sds-nav__dot" /> : null}
      {count != null ? <span className={`sds-nav__count ${countTone === 'muted' ? 'sds-nav__count--muted' : ''}`}>{count}</span> : null}
    </Tag>
  );
}
