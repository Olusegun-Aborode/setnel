import * as React from 'react';

export interface TimeRangePreset { value: string; label: string }

/** TimeRange — global range picker (1h/24h/7d/30d/custom) that charts + feeds respect. */
export interface TimeRangeProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onChange?: (value: string) => void;
  /** Override the preset buttons. */
  presets?: TimeRangePreset[];
}
export declare function TimeRange(props: TimeRangeProps): React.JSX.Element;
