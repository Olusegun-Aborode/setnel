import * as React from 'react';

export interface SparkPoint { value: number; }

/**
 * Sparkline — compact metric line with optional normal-range band + fire markers.
 */
export interface SparklineProps extends React.SVGAttributes<SVGSVGElement> {
  /** Series values — numbers or `{ value }` points. */
  points: Array<number | SparkPoint>;
  width?: number;
  height?: number;
  pad?: number;
  /** Normal-range band in value units (mean ±2σ) — shaded grey. */
  band?: { lo: number; hi: number } | null;
  /** Dashed baseline value (e.g. the mean). */
  mean?: number | null;
  /** Indices to mark as fires (backtest) — red dots. */
  fired?: number[];
  /** Line color. Default ink. */
  stroke?: string;
  strokeWidth?: number;
  /** Dot the latest value (red if out of band). Default true. */
  showLast?: boolean;
}

export declare function Sparkline(props: SparklineProps): React.JSX.Element;
