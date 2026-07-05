import * as React from 'react';

/**
 * HeatStrip — a row of 0–3 collection-heat cells for the dashboard-health matrix.
 */
export interface HeatStripProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Explicit levels 0–3. Takes precedence over `checks`. */
  levels?: Array<0 | 1 | 2 | 3>;
  /** Raw per-day check counts — bucketed to 0–3 via `heatLevel`. */
  checks?: number[];
  /** Optional ISO day labels for cell tooltips, index-aligned. */
  days?: string[];
}

export declare function HeatStrip(props: HeatStripProps): React.JSX.Element;
/** Bucket a raw check count into a 0–3 heat level. */
export declare function heatLevel(checks: number): 0 | 1 | 2 | 3;
