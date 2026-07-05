import * as React from 'react';

export type StatTone = 'good' | 'warn' | 'bad';

/**
 * StatCard (KPI) — console header metric.
 */
export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Uppercase micro-label. */
  label: React.ReactNode;
  /** The metric value — rendered in mono, tabular. */
  value: React.ReactNode;
  /** Optional supporting caption. */
  sub?: React.ReactNode;
  /** Semantic tone: `good` (green), `warn` (amber), `bad` (red). Omit for neutral. */
  tone?: StatTone;
}

export declare function StatCard(props: StatCardProps): React.JSX.Element;
