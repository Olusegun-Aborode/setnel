import * as React from 'react';

/**
 * Filter chip — toggle filters over the incident feed.
 */
export interface ChipProps extends React.HTMLAttributes<HTMLElement> {
  /** Selected state — inverts to solid ink. */
  active?: boolean;
  /** Optional trailing count (mono, tabular). */
  count?: number | string;
  /** Render element — `button` (default) or `a` for link filters. */
  as?: 'button' | 'a';
  children?: React.ReactNode;
}

export declare function Chip(props: ChipProps): React.JSX.Element;
