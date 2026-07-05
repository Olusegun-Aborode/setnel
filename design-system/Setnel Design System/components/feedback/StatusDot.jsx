import React from 'react';

const STYLE_ID = 'sds-statusdot';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .sds-status { display: inline-flex; align-items: center; gap: 8px; font-family: var(--font-sans);
    font-size: var(--text-13); color: var(--ink-2); line-height: 1; }
  .sds-status__dot { width: 9px; height: 9px; flex: none; display: inline-flex; align-items: center; justify-content: center; color: #fff; }
  .sds-status__dot svg { width: 9px; height: 9px; display: block; }
  .sds-status__dot--pulse { animation: setnel-pulse var(--pulse-period) var(--ease-in-out) infinite; }
  `;
  document.head.appendChild(el);
}

const LABELS = { healthy: 'healthy', stale: 'stale', down: 'down', idle: 'idle' };
const COLOR = { healthy: 'var(--status-healthy)', stale: 'var(--status-stale)', down: 'var(--status-down)', idle: 'var(--status-idle)' };

// Shape per status — colorblind redundancy: circle / diamond / square / hollow ring.
function Glyph({ status }) {
  const c = COLOR[status];
  if (status === 'healthy') return <svg viewBox="0 0 10 10"><circle cx="5" cy="5" r="4.5" fill={c} /></svg>;
  if (status === 'stale')   return <svg viewBox="0 0 10 10"><path d="M5 0.5 9.5 5 5 9.5 0.5 5Z" fill={c} /></svg>;
  if (status === 'down')    return <svg viewBox="0 0 10 10"><rect x="0.8" y="0.8" width="8.4" height="8.4" rx="1.2" fill={c} /></svg>;
  return <svg viewBox="0 0 10 10"><circle cx="5" cy="5" r="3.7" fill="none" stroke={c} strokeWidth="1.6" /></svg>;
}

/** StatusDot — per-dashboard health. Shape encodes status (colorblind-safe): circle=healthy, diamond=stale, square=down, ring=idle. */
export function StatusDot({ status = 'idle', label, pulse = false, showLabel = false, className = '', ...rest }) {
  const text = label != null ? label : LABELS[status];
  const dot = <span className={`sds-status__dot ${pulse ? 'sds-status__dot--pulse' : ''}`}><Glyph status={status} /></span>;
  if (!showLabel) return <span className={`sds-status ${className}`.trim()} title={text} {...rest}>{dot}</span>;
  return <span className={`sds-status ${className}`.trim()} {...rest}>{dot}{text}</span>;
}
