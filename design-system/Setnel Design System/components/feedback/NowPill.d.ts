import * as React from 'react';

export type NowLevel = 'calm' | 'warn' | 'alert' | 'emergency';

/**
 * NowPill — persistent global "now" state for the header (worst active severity + count).
 */
export interface NowPillProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Worst active severity. `calm` = all clear. */
  level?: NowLevel;
  /** Active incident count. */
  count?: number;
}
export declare function NowPill(props: NowPillProps): React.JSX.Element;
/** Derive the pill level from a list of incidents. */
export declare function nowLevel(incidents: Array<{ status: string; severity: string }>): NowLevel;
