import * as React from 'react';

/**
 * LiveIndicator — auto-refresh toggle for the console topbar.
 */
export interface LiveIndicatorProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onToggle'> {
  /** Live (pulsing) vs paused (muted). Default `true`. */
  live?: boolean;
  /** Seconds since last refresh, shown when live. */
  seconds?: number;
  /** Click handler to toggle live/paused. */
  onToggle?: () => void;
}

export declare function LiveIndicator(props: LiveIndicatorProps): React.JSX.Element;
