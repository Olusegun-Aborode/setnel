import * as React from 'react';

export type BadgeVariant =
  | 'info' | 'warning' | 'critical' | 'emergency'
  | 'neutral' | 'resolved' | 'exposure' | 'count';

/**
 * Badge — uppercase rectangular status pill (severity + neutral states).
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Severity or neutral status style. Default `neutral`. */
  variant?: BadgeVariant;
  children?: React.ReactNode;
}

export declare function Badge(props: BadgeProps): React.JSX.Element;
