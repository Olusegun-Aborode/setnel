import * as React from 'react';

/** Checkbox — selection for bulk actions and multi-select. */
export interface CheckboxProps extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked?: boolean;
  /** Mixed state — for a "select all" header when some rows are selected. */
  indeterminate?: boolean;
  onChange?: (next: boolean) => void;
  label?: React.ReactNode;
}

export declare function Checkbox(props: CheckboxProps): React.JSX.Element;
