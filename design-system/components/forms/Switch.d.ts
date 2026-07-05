import * as React from 'react';

/** Switch — toggle a boolean setting. */
export interface SwitchProps extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'onChange'> {
  /** On/off state. */
  checked?: boolean;
  /** Called with the next boolean. */
  onChange?: (next: boolean) => void;
  /** Optional trailing label. */
  label?: React.ReactNode;
  disabled?: boolean;
}

export declare function Switch(props: SwitchProps): React.JSX.Element;
