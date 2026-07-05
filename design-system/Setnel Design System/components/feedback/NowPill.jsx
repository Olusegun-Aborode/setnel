import React from 'react';

const STYLE_ID = 'sds-nowpill';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .sds-now {
    display: inline-flex; align-items: center; gap: 8px; cursor: pointer;
    font-family: var(--font-sans); font-size: var(--text-13); font-weight: var(--weight-medium);
    padding: 5px 11px 5px 9px; border-radius: var(--radius-pill); border: 1px solid; line-height: 1;
    transition: var(--transition-control); background: var(--panel);
  }
  .sds-now__dot { width: 8px; height: 8px; border-radius: 50%; flex: none; }
  .sds-now__count { font-family: var(--font-mono); font-variant-numeric: tabular-nums; font-weight: 600; }
  .sds-now--calm    { border-color: var(--good-bg);      color: var(--good); }
  .sds-now--calm .sds-now__dot { background: var(--good); }
  .sds-now--warn    { border-color: var(--sev-warn-border, #fcd9a3); color: var(--warning); background: var(--warning-bg); }
  .sds-now--warn .sds-now__dot { background: var(--warning); }
  .sds-now--alert   { border-color: transparent; color: #fff; background: var(--critical); }
  .sds-now--alert .sds-now__dot { background: #fff; animation: setnel-pulse var(--pulse-period) var(--ease-in-out) infinite; }
  .sds-now--emergency { border-color: transparent; color: #fff; background: var(--emergency); }
  .sds-now--emergency .sds-now__dot { background: #fff; animation: setnel-pulse var(--pulse-period) var(--ease-in-out) infinite; }
  .sds-now:focus-visible { outline: none; box-shadow: var(--focus-ring); }
  `;
  document.head.appendChild(el);
}

/**
 * NowPill — the persistent global "is anything on fire right now?" indicator for
 * the header. Worst active severity drives color; shows the active count. Click to
 * jump to incidents.
 */
export function NowPill({ level = 'calm', count = 0, onClick, className = '', ...rest }) {
  const label = level === 'calm' ? 'All clear' : level === 'emergency' ? 'Emergency' : level === 'alert' ? 'Critical' : 'Warnings';
  return (
    <button className={`sds-now sds-now--${level} ${className}`.trim()} onClick={onClick}
      title={count ? `${count} active incident${count === 1 ? '' : 's'}` : 'No active incidents'} {...rest}>
      <span className="sds-now__dot" />
      {label}
      {count ? <span className="sds-now__count">{count}</span> : null}
    </button>
  );
}

/** Map a set of active incidents to a NowPill level. */
export function nowLevel(incidents) {
  const active = incidents.filter((i) => i.status === 'active');
  if (active.some((i) => i.severity === 'emergency')) return 'emergency';
  if (active.some((i) => i.severity === 'critical')) return 'alert';
  if (active.length) return 'warn';
  return 'calm';
}
