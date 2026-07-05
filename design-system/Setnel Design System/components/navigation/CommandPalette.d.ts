import * as React from 'react';

export interface Command {
  id?: string;
  label: string;
  /** Group heading (e.g. "Dashboards", "Detectors", "Go to"). */
  group?: string;
  /** Trailing hint (mono) — a metric key, incident #, etc. */
  hint?: string;
  /** Trailing keyboard shortcut chip. */
  kbd?: string;
  icon?: React.ReactNode;
  /** Invoked on select. */
  run?: () => void;
}

/**
 * CommandPalette — ⌘K navigator over dashboards, detectors, incidents, metrics, actions.
 */
export interface CommandPaletteProps {
  commands: Command[];
  /** Controlled open state. Omit to self-manage. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Bind the global ⌘K / Ctrl-K shortcut. Default true. */
  bindHotkey?: boolean;
  placeholder?: string;
}

export declare function CommandPalette(props: CommandPaletteProps): React.JSX.Element | null;
