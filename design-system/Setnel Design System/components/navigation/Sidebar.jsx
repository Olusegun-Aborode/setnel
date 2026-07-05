import React from 'react';

const STYLE_ID = 'sds-sidebar';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .sds-sidebar {
    width: var(--sidebar-w); flex: none; height: 100%; box-sizing: border-box;
    display: flex; flex-direction: column; background: var(--surface-sidebar);
    border-right: 1px solid var(--border);
  }
  .sds-sidebar__brand { display: flex; align-items: center; gap: 9px; padding: 14px 14px 10px; }
  .sds-sidebar__brand img { width: 26px; height: 26px; border-radius: 6px; display: block; }
  .sds-sidebar__brand-name { font-size: var(--text-15); font-weight: var(--weight-bold); letter-spacing: var(--tracking-tighter); color: var(--ink); }
  .sds-sidebar__brand-sub { font-size: 10.5px; color: var(--muted); }
  .sds-sidebar__nav { flex: 1; overflow-y: auto; padding: 6px 8px; display: flex; flex-direction: column; gap: 3px; }
  .sds-sidebar__foot { border-top: 1px solid var(--border); padding: 10px 12px; display: flex; flex-direction: column; gap: 8px; }

  .sds-navsec { display: flex; flex-direction: column; gap: 2px; margin-top: 10px; }
  .sds-navsec:first-child { margin-top: 0; }
  .sds-navsec__label {
    font-size: var(--text-2xs); text-transform: uppercase; letter-spacing: var(--tracking-caps);
    color: var(--faint); padding: 4px 9px 3px; font-weight: var(--weight-semibold);
  }
  `;
  document.head.appendChild(el);
}

/** SidebarSection — a labelled group of NavItems. */
export function SidebarSection({ label, children, className = '', ...rest }) {
  return (
    <div className={`sds-navsec ${className}`.trim()} {...rest}>
      {label ? <div className="sds-navsec__label">{label}</div> : null}
      {children}
    </div>
  );
}

/**
 * Sidebar — the app-shell left rail: brand lockup, scrollable nav sections,
 * and a footer (actor + live indicator). Compose NavItem / SidebarSection inside.
 */
export function Sidebar({ brand, children, footer, className = '', ...rest }) {
  return (
    <aside className={`sds-sidebar ${className}`.trim()} {...rest}>
      {brand ? <div className="sds-sidebar__brand">{brand}</div> : null}
      <nav className="sds-sidebar__nav">{children}</nav>
      {footer ? <div className="sds-sidebar__foot">{footer}</div> : null}
    </aside>
  );
}
