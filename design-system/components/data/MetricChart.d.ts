import * as React from 'react';

export interface MetricPointT { t: number | string; value: number; label?: string }

/**
 * MetricChart — interactive metric line (crosshair tooltip, inline threshold line,
 * band, mean, fired markers). For detail / drill-down views. Responsive width.
 */
export interface MetricChartProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Series — `{ t, value, label? }` points or bare numbers. */
  points: Array<number | MetricPointT>;
  height?: number;
  /** Normal-range band `{ lo, hi }` (mean ±2σ) — shaded grey. */
  band?: { lo: number; hi: number } | null;
  /** Dashed baseline value. */
  mean?: number | null;
  /** Inline detector trigger line `{ value, label }` — the actual firing threshold. */
  threshold?: { value: number; label?: string } | null;
  /** Indices to mark as fires (red dots). */
  fired?: number[];
  /** Value unit for axis + tooltip (`%`, `$`, `` ). */
  unit?: string;
  stroke?: string;
}

export declare function MetricChart(props: MetricChartProps): React.JSX.Element;
