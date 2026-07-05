import * as React from 'react';

/**
 * Text input — actor name, incident notes, login field.
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Optional label rendered above the field. */
  label?: React.ReactNode;
  /** Helper or error text below the field. */
  hint?: React.ReactNode;
  /** Error state — red border + danger focus ring. */
  invalid?: boolean;
  /** Render value in Geist Mono (IDs, keys, numeric entry). */
  mono?: boolean;
  /** `md` (32px, default) or `lg` (42px, login). */
  size?: 'md' | 'lg';
}

export declare function Input(props: InputProps): React.JSX.Element;
