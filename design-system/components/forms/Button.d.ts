import * as React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Setnel button — ink-black primary action, white-outline secondary.
 */
export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /** `primary` = solid ink, `secondary` = white outline (default), `ghost`, `danger`. */
  variant?: ButtonVariant;
  /** `sm` (28px) · `md` (32px, default) · `lg` (42px, login/submit). */
  size?: ButtonSize;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  /** Render as another element, e.g. `a` for link actions ("Open dashboard ↗"). */
  as?: 'button' | 'a';
  children?: React.ReactNode;
}

export declare function Button(props: ButtonProps): React.JSX.Element;
