import * as React from 'react';

export type DashboardStatus = 'healthy' | 'stale' | 'down' | 'idle';

/**
 * StatusDot — per-dashboard health indicator.
 */
export interface StatusDotProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Health state. Default `idle`. */
  status?: DashboardStatus;
  /** Show a text label beside the dot. */
  showLabel?: boolean;
  /** Override the default status label text. */
  label?: React.ReactNode;
  /** Emit an attention ping ring (use sparingly, e.g. a just-down dashboard). */
  pulse?: boolean;
}

export declare function StatusDot(props: StatusDotProps): React.JSX.Element;
