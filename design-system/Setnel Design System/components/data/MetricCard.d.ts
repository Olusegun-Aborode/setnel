import * as React from 'react';

export interface MetricPoint { value: number; }

/**
 * MetricCard — one metric in the explorer (key + value + banded Sparkline).
 */
export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Metric key, e.g. `aave.v3.usdc_utilization` (mono). */
  metricKey: React.ReactNode;
  /** Formatted latest value, e.g. `94.2%`. */
  value: React.ReactNode;
  /** Series values — numbers or `{ value }`. */
  points: Array<number | MetricPoint>;
  /** Baseline mean (dashed line). */
  mean?: number;
  /** Standard deviation — band is drawn at mean ±2σ. */
  sd?: number;
  /** Explicit band override `{ lo, hi }`. */
  band?: { lo: number; hi: number } | null;
  /** Small caption under the chart (dashboard · sample count). */
  foot?: React.ReactNode;
  /** Force the out-of-band (red) value state. */
  outOfBand?: boolean;
}

export declare function MetricCard(props: MetricCardProps): React.JSX.Element;
