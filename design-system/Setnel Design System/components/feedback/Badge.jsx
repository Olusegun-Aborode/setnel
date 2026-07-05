import React from 'react';

const STYLE_ID = 'sds-badge';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .sds-badge {
    display: inline-flex; align-items: center; gap: 4px;
    font-family: var(--font-sans); font-size: 10px; font-weight: var(--weight-bold);
    text-transform: uppercase; letter-spacing: var(--tracking-caps-sm); line-height: 1;
    padding: var(--pad-badge); border-radius: var(--radius-badge); white-space: nowrap;
    background: var(--panel-2); color: var(--muted);
  }
  .sds-badge--num { font-variant-numeric: tabular-nums; }
  .sds-badge--info      { background: var(--info-bg);      color: var(--info); }
  .sds-badge--warning   { background: var(--warning-bg);   color: var(--warning); }
  .sds-badge--critical  { background: var(--critical-bg);  color: var(--critical); }
  .sds-badge--emergency { background: var(--emergency-bg); color: var(--emergency); }
  .sds-badge--resolved  { background: var(--good-bg);      color: var(--good); }
  .sds-badge--exposure  { background: var(--exposure-bg);  color: var(--ink-2); }
  .sds-badge--count     { background: var(--panel-2);      color: var(--muted); }
  `;
  document.head.appendChild(el);
}

/**
 * Badge — uppercase, rectangular status pill. Severity labels
 * (info/warning/critical/emergency) + neutral states (resolved, exposure, count).
 */
export function Badge({ children, variant = 'neutral', className = '', ...rest }) {
  const numeric = variant === 'exposure' || variant === 'count';
  const cls = [
    'sds-badge',
    variant !== 'neutral' ? `sds-badge--${variant}` : '',
    numeric ? 'sds-badge--num' : '',
    className,
  ].filter(Boolean).join(' ');
  return <span className={cls} {...rest}>{children}</span>;
}
