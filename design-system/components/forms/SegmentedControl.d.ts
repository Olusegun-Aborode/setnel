import * as React from 'react';

export interface SegmentOption {
  value: string;
  label: React.ReactNode;
}

/**
 * Segmented control — chart breakdown switcher.
 */
export interface SegmentedControlProps {
  /** Options as plain strings or `{ value, label }` objects. */
  options: Array<string | SegmentOption>;
  /** Currently selected value. */
  value: string;
  /** Called with the newly selected value. */
  onChange?: (value: string) => void;
  className?: string;
}

export declare function SegmentedControl(props: SegmentedControlProps): React.JSX.Element;
