import React from 'react';

const STYLE_ID = 'sds-input';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .sds-field { display: inline-flex; flex-direction: column; gap: 6px; }
  .sds-field__label { font: var(--font-label); color: var(--ink-2); }
  .sds-input {
    font-family: var(--font-sans); font-size: var(--text-13); color: var(--ink);
    background: var(--white); border: 1px solid var(--border-control);
    border-radius: var(--radius-btn); padding: var(--pad-input); height: var(--control-h);
    transition: var(--transition-control); width: 100%;
  }
  .sds-input::placeholder { color: var(--faint); }
  .sds-input:focus { outline: none; border-color: var(--ink); }
  .sds-input--lg { height: var(--control-h-lg); padding: var(--pad-input-lg); border-radius: var(--radius); font-size: var(--text-base); }
  .sds-input--mono { font-family: var(--font-mono); }
  .sds-input[disabled] { opacity: 0.5; cursor: not-allowed; background: var(--panel-2); }
  .sds-input--invalid { border-color: var(--critical); }
  .sds-field__hint { font-size: var(--text-2xs); color: var(--muted); }
  .sds-field__hint--err { color: var(--critical); }
  `;
  document.head.appendChild(el);
}

/** Text input — actor name, incident notes, login. Focus darkens the border to ink. */
export function Input({ label, hint, invalid = false, mono = false, size = 'md', className = '', id, ...rest }) {
  const inputCls = [
    'sds-input',
    size === 'lg' ? 'sds-input--lg' : '',
    mono ? 'sds-input--mono' : '',
    invalid ? 'sds-input--invalid' : '',
    className,
  ].filter(Boolean).join(' ');
  const field = <input id={id} className={inputCls} aria-invalid={invalid || undefined} {...rest} />;
  if (!label && !hint) return field;
  return (
    <label className="sds-field" htmlFor={id}>
      {label ? <span className="sds-field__label">{label}</span> : null}
      {field}
      {hint ? <span className={`sds-field__hint ${invalid ? 'sds-field__hint--err' : ''}`}>{hint}</span> : null}
    </label>
  );
}
