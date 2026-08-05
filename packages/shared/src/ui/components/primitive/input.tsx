import type { InputHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';

import { cn } from '@ui/lib/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  readonly error?: boolean;
  readonly leading?: ReactNode;
  readonly trailing?: ReactNode;
  readonly mono?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, leading, trailing, mono = false, type = 'text', ...props }, ref) => {
    return (
      <div
        className={cn(
          'group flex h-[34px] w-full items-center gap-2 rounded-sm border bg-input px-3 text-sm transition-colors duration-[120ms] ease-[cubic-bezier(0.2,0,0,1)]',
          error ? 'border-danger' : 'border-border-default hover:border-border-strong',
          'focus-within:border-border-strong focus-within:ring-2 focus-within:ring-focus focus-within:ring-offset-2 focus-within:ring-offset-app',
          props.disabled && 'opacity-60',
          className,
        )}
      >
        {leading ? <span className="text-text-muted">{leading}</span> : null}
        <input
          ref={ref}
          type={type}
          className={cn(
            'h-full w-full border-0 bg-transparent text-text-primary outline-none placeholder:text-text-placeholder disabled:cursor-not-allowed',
            mono && 'font-mono',
          )}
          {...props}
        />
        {trailing ? <span className="text-text-muted">{trailing}</span> : null}
      </div>
    );
  },
);

Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  readonly error?: boolean;
  readonly mono?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, mono, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'min-h-[144px] w-full rounded-sm border bg-input px-3 py-2 text-sm text-text-primary outline-none transition-colors duration-[120ms] ease-[cubic-bezier(0.2,0,0,1)] placeholder:text-text-placeholder',
          mono && 'font-mono',
          error ? 'border-danger' : 'border-border-default hover:border-border-strong',
          'focus-visible:border-border-strong focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-app',
          className,
        )}
        {...props}
      />
    );
  },
);

Textarea.displayName = 'Textarea';

interface SearchInputProps extends Omit<InputProps, 'type'> {
  readonly onClear?: () => void;
}

export const SearchInput = ({ onClear, value, ...props }: SearchInputProps): ReactNode => {
  return (
    <Input
      type="search"
      value={value}
      trailing={
        onClear && value ? (
          <button
            type="button"
            onClick={onClear}
            className="rounded-sm px-1 text-text-muted hover:bg-hover hover:text-text-primary"
            aria-label="Clear search"
          >
            x
          </button>
        ) : null
      }
      {...props}
    />
  );
};
