import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes, ReactElement, ReactNode } from 'react';

import { cn } from '@shared/ui/lib/cn';
import { Spinner } from '@shared/ui/primitives/spinner';

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-[8px] whitespace-nowrap font-medium',
    'rounded-md ds-transition-fast select-none',
    'focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--state-focus)]',
    'disabled:pointer-events-none disabled:opacity-[var(--opacity-disabled)]',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        primary: 'bg-gray-100 text-gray-950 hover:bg-gray-50 active:bg-gray-200',
        secondary:
          'border border-transparent bg-surface-elevated text-text-primary hover:bg-state-hover active:bg-state-pressed',
        ghost: 'bg-transparent text-text-primary hover:bg-state-hover active:bg-state-pressed',
        destructive:
          'bg-danger-bg text-danger hover:bg-[color-mix(in_srgb,var(--danger)_22%,transparent)] active:bg-[color-mix(in_srgb,var(--danger)_28%,transparent)]',
      },
      size: {
        sm: 'h-[28px] px-[10px] text-xs leading-4 [&_svg]:size-[14px]',
        md: 'h-[32px] px-[12px] text-sm leading-[22px] [&_svg]:size-[16px]',
        lg: 'h-[40px] px-[16px] text-sm leading-[22px] [&_svg]:size-[16px]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    readonly asChild?: boolean;
    readonly loading?: boolean;
    readonly leftIcon?: ReactNode;
    readonly rightIcon?: ReactNode;
  };

export const Button = ({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  disabled,
  leftIcon,
  rightIcon,
  children,
  type = 'button',
  ...props
}: ButtonProps): ReactElement => {
  const Comp = asChild ? Slot : 'button';
  const isDisabled = disabled || loading;

  return (
    <Comp
      type={asChild ? undefined : type}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={asChild ? undefined : isDisabled}
      aria-disabled={isDisabled || undefined}
      aria-busy={loading || undefined}
      data-loading={loading || undefined}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          {loading ? <Spinner size="button" className="text-current" /> : leftIcon}
          {children}
          {!loading ? rightIcon : null}
        </>
      )}
    </Comp>
  );
};

export { buttonVariants };
export type { ButtonProps };
