import { cva, type VariantProps } from 'class-variance-authority';
import type { InputHTMLAttributes, ReactElement, ReactNode, Ref } from 'react';

import { cn } from '@shared/ui/lib/cn';

const inputVariants = cva(
  [
    'flex w-full min-w-0 rounded-md border bg-surface-input text-text-primary',
    'placeholder:text-text-placeholder',
    'ds-transition-fast',
    'focus-visible:outline-none focus-visible:border-border-strong focus-visible:ds-focus-ring',
    'disabled:cursor-not-allowed disabled:opacity-[var(--opacity-disabled)]',
    'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-text-primary',
  ],
  {
    variants: {
      size: {
        sm: 'h-7 px-2 text-xs leading-4',
        md: 'h-8 px-3 text-sm leading-[22px]',
        lg: 'h-10 px-3 text-sm leading-[22px]',
      },
      error: {
        true: 'border-danger focus-visible:border-danger',
        false: 'border-border-default',
      },
    },
    defaultVariants: {
      size: 'md',
      error: false,
    },
  },
);

const inputWrapperVariants = cva(
  [
    'relative flex w-full items-center rounded-md border bg-surface-input',
    'ds-transition-fast',
    'focus-within:border-border-strong focus-within:ds-focus-ring',
    'has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-[var(--opacity-disabled)]',
  ],
  {
    variants: {
      size: {
        sm: 'h-7',
        md: 'h-8',
        lg: 'h-10',
      },
      error: {
        true: 'border-danger focus-within:border-danger',
        false: 'border-border-default',
      },
    },
    defaultVariants: {
      size: 'md',
      error: false,
    },
  },
);

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> &
  VariantProps<typeof inputVariants> & {
    readonly leading?: ReactNode;
    readonly trailing?: ReactNode;
    readonly ref?: Ref<HTMLInputElement>;
  };

export const Input = ({
  className,
  size,
  error = false,
  leading,
  trailing,
  disabled,
  'aria-invalid': ariaInvalid,
  ref,
  ...props
}: InputProps): ReactElement => {
  const isInvalid = Boolean(error) || ariaInvalid === true || ariaInvalid === 'true';

  if (leading || trailing) {
    return (
      <div
        className={cn(inputWrapperVariants({ size, error: isInvalid }), className)}
        data-disabled={disabled || undefined}
        data-invalid={isInvalid || undefined}
      >
        {leading ? (
          <span className="pointer-events-none flex shrink-0 items-center pl-2 text-text-muted [&_svg]:size-4">
            {leading}
          </span>
        ) : null}
        <input
          ref={ref}
          disabled={disabled}
          aria-invalid={isInvalid || undefined}
          className={cn(
            'h-full w-full min-w-0 flex-1 bg-transparent px-2 text-text-primary outline-none',
            'placeholder:text-text-placeholder',
            size === 'sm' && 'text-xs leading-4',
            (size === 'md' || size === 'lg' || !size) && 'text-sm leading-[22px]',
            leading && 'pl-1.5',
            trailing && 'pr-1.5',
          )}
          {...props}
        />
        {trailing ? (
          <span className="flex shrink-0 items-center pr-2 text-text-muted [&_svg]:size-4">
            {trailing}
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <input
      ref={ref}
      disabled={disabled}
      aria-invalid={isInvalid || undefined}
      className={cn(inputVariants({ size, error: isInvalid }), className)}
      {...props}
    />
  );
};

export { inputVariants };
export type { InputProps };
