import React from 'react';

const STYLE_ID = 'sds-button';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .sds-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 6px;
    font-family: var(--font-sans); font-weight: var(--weight-medium); font-size: var(--text-13);
    line-height: 1; white-space: nowrap; cursor: pointer;
    border: 1px solid var(--border-control); background: var(--white); color: var(--ink-2);
    border-radius: var(--radius-btn); padding: var(--pad-btn); height: var(--control-h);
    transition: var(--transition-control); text-decoration: none;
  }
  .sds-btn:hover { border-color: var(--ink); color: var(--ink); }
  .sds-btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }
  .sds-btn[disabled] { opacity: 0.45; cursor: not-allowed; pointer-events: none; }
  .sds-btn--lg { height: var(--control-h-lg); padding: var(--pad-btn-lg); border-radius: var(--radius); font-size: var(--text-base); font-weight: var(--weight-semibold); }
  .sds-btn--sm { height: var(--control-h-sm); padding: 4px 9px; font-size: var(--text-sm); }

  .sds-btn--primary { background: var(--action); color: var(--action-text); border-color: var(--action); }
  .sds-btn--primary:hover { background: var(--action-hover); border-color: var(--action-hover); color: var(--action-text); }

  .sds-btn--ghost { background: transparent; border-color: transparent; color: var(--ink-2); }
  .sds-btn--ghost:hover { background: var(--surface-hover); border-color: transparent; color: var(--ink); }

  .sds-btn--danger:hover { border-color: var(--critical); color: var(--critical); }
  .sds-btn--danger:focus-visible { box-shadow: var(--focus-ring-danger); }
  `;
  document.head.appendChild(el);
}

/**
 * Setnel button. Ink-black is the one action color; secondary is a white outline.
 */
export function Button({
  children, variant = 'secondary', size = 'md', type = 'button',
  disabled = false, iconLeft = null, iconRight = null, as = 'button', className = '', ...rest
}) {
  const cls = [
    'sds-btn',
    variant === 'primary' ? 'sds-btn--primary' : '',
    variant === 'ghost' ? 'sds-btn--ghost' : '',
    variant === 'danger' ? 'sds-btn--danger' : '',
    size === 'lg' ? 'sds-btn--lg' : '',
    size === 'sm' ? 'sds-btn--sm' : '',
    className,
  ].filter(Boolean).join(' ');
  const Tag = as;
  return (
    <Tag className={cls} type={as === 'button' ? type : undefined} disabled={as === 'button' ? disabled : undefined} {...rest}>
      {iconLeft}{children}{iconRight}
    </Tag>
  );
}
