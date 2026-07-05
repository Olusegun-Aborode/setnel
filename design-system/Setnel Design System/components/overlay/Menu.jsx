import React from 'react';

const STYLE_ID = 'sds-menu';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .sds-menu { position: relative; display: inline-flex; }
  .sds-menu__pop {
    position: absolute; z-index: 50; min-width: 180px; padding: 5px;
    background: var(--panel); border: 1px solid var(--border); border-radius: var(--radius);
    box-shadow: var(--shadow-pop);
  }
  .sds-menu__pop--right { right: 0; } .sds-menu__pop--left { left: 0; }
  .sds-menu__pop--top { bottom: calc(100% + 6px); } .sds-menu__pop--bottom { top: calc(100% + 6px); }
  .sds-menu__label { font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--faint); padding: 6px 9px 4px; font-weight: 600; }
  .sds-menu__item {
    display: flex; align-items: center; gap: 9px; width: 100%; text-align: left;
    font-family: var(--font-sans); font-size: var(--text-13); color: var(--ink-2);
    background: transparent; border: none; cursor: pointer; padding: 7px 9px; border-radius: 6px;
  }
  .sds-menu__item:hover { background: var(--panel-3); color: var(--ink); }
  .sds-menu__item--danger { color: var(--critical); }
  .sds-menu__item--danger:hover { background: var(--critical-bg); }
  .sds-menu__sep { height: 1px; background: var(--border); margin: 4px 0; }
  .sds-menu__scrim { position: fixed; inset: 0; z-index: 40; }
  `;
  document.head.appendChild(el);
}

/** MenuItem — a row inside Menu. */
export function MenuItem({ children, onSelect, danger = false, icon, className = '', ...rest }) {
  return (
    <button type="button" className={`sds-menu__item ${danger ? 'sds-menu__item--danger' : ''} ${className}`.trim()}
      onClick={onSelect} {...rest}>
      {icon ? <span style={{ display: 'inline-flex', width: 15 }}>{icon}</span> : null}
      {children}
    </button>
  );
}
export function MenuLabel({ children }) { return <div className="sds-menu__label">{children}</div>; }
export function MenuSeparator() { return <div className="sds-menu__sep" />; }

/**
 * Menu — a dropdown popover anchored to a trigger. Used for mute-with-reason,
 * bulk-action menus, and row overflow actions.
 */
export function Menu({ trigger, children, align = 'left', side = 'bottom', className = '', ...rest }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className={`sds-menu ${className}`.trim()} {...rest}>
      <div onClick={() => setOpen((v) => !v)}>{trigger}</div>
      {open ? (
        <>
          <div className="sds-menu__scrim" onClick={() => setOpen(false)} />
          <div className={`sds-menu__pop sds-menu__pop--${align} sds-menu__pop--${side}`}
            onClick={() => setOpen(false)}>
            {children}
          </div>
        </>
      ) : null}
    </div>
  );
}
