import * as React from 'react';

/**
 * Panel — primary content container for a console section.
 */
export interface PanelProps extends React.HTMLAttributes<HTMLElement> {
  /** Section title (e.g. "Dashboard health"). */
  title?: React.ReactNode;
  /** Inline note beside the title (e.g. "Last 30 days · target ~288/day"). */
  note?: React.ReactNode;
  /** Right-aligned header slot — a link or small control. */
  aside?: React.ReactNode;
  /** Remove body padding — for edge-to-edge tables / matrices. */
  flush?: boolean;
  /** Add a divider rule under the header. */
  divided?: boolean;
  children?: React.ReactNode;
}

export declare function Panel(props: PanelProps): React.JSX.Element;
