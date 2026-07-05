import * as React from 'react';

/**
 * Menu — dropdown popover anchored to a trigger (mute-with-reason, bulk actions, row overflow).
 */
export interface MenuProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The clickable trigger element (a Button, icon button, etc.). */
  trigger: React.ReactNode;
  /** MenuItem / MenuLabel / MenuSeparator children. */
  children?: React.ReactNode;
  /** Horizontal anchor. Default `left`. */
  align?: 'left' | 'right';
  /** Which side of the trigger to open. Default `bottom`. */
  side?: 'bottom' | 'top';
}
export declare function Menu(props: MenuProps): React.JSX.Element;

export interface MenuItemProps extends React.HTMLAttributes<HTMLButtonElement> {
  onSelect?: () => void;
  danger?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}
export declare function MenuItem(props: MenuItemProps): React.JSX.Element;
export declare function MenuLabel(props: { children?: React.ReactNode }): React.JSX.Element;
export declare function MenuSeparator(): React.JSX.Element;
