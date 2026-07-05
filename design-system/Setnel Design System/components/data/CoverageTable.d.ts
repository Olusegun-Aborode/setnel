import * as React from 'react';

export type CoverageState = 'yes' | 'blocked' | 'planned' | 'na';

export interface CoverageRow {
  /** Risk-type label, e.g. "Bad debt / underwater". */
  risk: React.ReactNode;
  /** One state per protocol column, index-aligned with `protocols`. */
  cells: CoverageState[];
}

/**
 * CoverageTable — risk-type × protocol coverage map (detector blind-spot matrix).
 */
export interface CoverageTableProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Protocol column headers. */
  protocols: string[];
  /** Rows, one per risk type. */
  rows: CoverageRow[];
  /** Show the state legend. Default true. */
  legend?: boolean;
}

export declare function CoverageTable(props: CoverageTableProps): React.JSX.Element;
