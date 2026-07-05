import * as React from 'react';

/**
 * NavItem — one row in the app-shell sidebar.
 */
export interface NavItemProps extends React.HTMLAttributes<HTMLElement> {
  /** Leading icon node (16px — pass a Lucide SVG). */
  icon?: React.ReactNode;
  /** Item label. */
  label: React.ReactNode;
  /** Active/current state. */
  active?: boolean;
  /** Trailing count (e.g. active-incident count). */
  count?: number | string;
  /** `alert` (red, default) or `muted` count styling. */
  countTone?: 'alert' | 'muted';
  /** Show a small alert dot instead of a count. */
  dot?: boolean;
  /** Render element — `button` (default) or `a`. */
  as?: 'button' | 'a';
}

export declare function NavItem(props: NavItemProps): React.JSX.Element;
