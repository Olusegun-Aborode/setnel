import React from 'react';

const STYLE_ID = 'sds-live';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .sds-live {
    display: inline-flex; align-items: center; gap: 6px;
    font-family: var(--font-sans); font-size: var(--text-sm); color: var(--muted);
    background: var(--white); border: 1px solid var(--border-control); border-radius: var(--radius-btn);
    padding: 6px 10px; cursor: pointer; transition: var(--transition-control);
    font-variant-numeric: tabular-nums; line-height: 1;
  }
  .sds-live__dot { width: 7px; height: 7px; border-radius: 50%; background: var(--faint); }
  .sds-live--on { color: var(--ink); border-color: var(--ink); }
  .sds-live--on .sds-live__dot { background: var(--good); animation: setnel-pulse var(--pulse-period) var(--ease-in-out) infinite; }
  .sds-live:focus-visible { outline: none; box-shadow: var(--focus-ring); }
  `;
  document.head.appendChild(el);
}

/** LiveIndicator — the console's auto-refresh toggle (ghost button, pulsing green dot when on). */
export function LiveIndicator({ live = true, seconds = 0, onToggle, className = '', ...rest }) {
  return (
    <button className={`sds-live ${live ? 'sds-live--on' : ''} ${className}`.trim()}
      onClick={onToggle}
      title={live ? 'Auto-refresh on — click to pause' : 'Paused — click to resume'} {...rest}>
      <span className="sds-live__dot" />
      {live ? `live · ${seconds}s` : 'paused'}
    </button>
  );
}
