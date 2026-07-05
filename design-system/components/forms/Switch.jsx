import React from 'react';

const STYLE_ID = 'sds-switch';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .sds-switch { display: inline-flex; align-items: center; gap: 9px; cursor: pointer; user-select: none; }
  .sds-switch[aria-disabled="true"] { opacity: 0.5; cursor: not-allowed; }
  .sds-switch__track {
    position: relative; width: 34px; height: 20px; flex: none; border-radius: 999px;
    background: var(--border-strong); transition: background-color var(--dur-fast) var(--ease-standard);
  }
  .sds-switch__track--on { background: var(--ink); }
  .sds-switch__thumb {
    position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 999px;
    background: #fff; box-shadow: var(--shadow-sm); transition: transform var(--dur-fast) var(--ease-standard);
  }
  .sds-switch__track--on .sds-switch__thumb { transform: translateX(14px); }
  .sds-switch__label { font-size: var(--text-13); color: var(--ink-2); }
  .sds-switch:focus-visible { outline: none; }
  .sds-switch:focus-visible .sds-switch__track { box-shadow: var(--focus-ring); }
  `;
  document.head.appendChild(el);
}

/** Switch — toggle a boolean (detector enable/disable, density, notification channels). */
export function Switch({ checked = false, onChange, label, disabled = false, className = '', ...rest }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-disabled={disabled || undefined}
      className={`sds-switch ${className}`.trim()}
      onClick={() => !disabled && onChange && onChange(!checked)} {...rest}>
      <span className={`sds-switch__track ${checked ? 'sds-switch__track--on' : ''}`}>
        <span className="sds-switch__thumb" />
      </span>
      {label ? <span className="sds-switch__label">{label}</span> : null}
    </button>
  );
}
