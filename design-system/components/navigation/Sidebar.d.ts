import * as React from 'react';

/**
 * Sidebar — the app-shell left rail (brand, nav sections, footer).
 */
export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  /** Brand lockup node (logo + name) for the top. */
  brand?: React.ReactNode;
  /** NavItem / SidebarSection children. */
  children?: React.ReactNode;
  /** Footer node (actor, live indicator, sign-out). */
  footer?: React.ReactNode;
}

export declare function Sidebar(props: SidebarProps): React.JSX.Element;

export interface SidebarSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Uppercase section label. */
  label?: React.ReactNode;
  children?: React.ReactNode;
}

export declare function SidebarSection(props: SidebarSectionProps): React.JSX.Element;
