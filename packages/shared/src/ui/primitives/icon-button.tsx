import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes, ReactElement, ReactNode } from 'react';

import { cn } from '@shared/ui/lib/cn';
import { Spinner } from '@shared/ui/primitives/spinner';

const iconButtonVariants = cva(
  [
    'inline-flex items-center justify-center shrink-0 rounded-md',
    'ds-transition-fast select-none',
    'focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--state-focus)]',
    'disabled:pointer-events-none disabled:opacity-[var(--opacity-disabled)]',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        ghost:
          'bg-transparent text-text-muted hover:bg-state-hover hover:text-text-primary active:bg-state-pressed',
        subtle:
          'bg-surface-elevated text-text-secondary hover:bg-state-hover hover:text-text-primary active:bg-state-pressed',
        selected: 'bg-state-selected text-text-primary hover:bg-state-selected',
        destructive:
          'bg-transparent text-danger hover:bg-danger-bg active:bg-[color-mix(in_srgb,var(--danger)_22%,transparent)]',
      },
      size: {
        sm: 'size-[28px] [&_svg]:size-[14px]',
        md: 'size-[32px] [&_svg]:size-[16px]',
        lg: 'size-[40px] [&_svg]:size-[20px]',
      },
    },
    defaultVariants: {
      variant: 'ghost',
      size: 'md',
    },
  },
);

type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> &
  VariantProps<typeof iconButtonVariants> & {
    readonly 'aria-label': string;
    readonly asChild?: boolean;
    readonly loading?: boolean;
    readonly children?: ReactNode;
  };

export const IconButton = ({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  disabled,
  children,
  title,
  type = 'button',
  'aria-label': ariaLabel,
  ...props
}: IconButtonProps): ReactElement => {
  const Comp = asChild ? Slot : 'button';
  const isDisabled = disabled || loading;

  return (
    <Comp
      type={asChild ? undefined : type}
      className={cn(iconButtonVariants({ variant, size }), className)}
      disabled={asChild ? undefined : isDisabled}
      aria-disabled={isDisabled || undefined}
      aria-busy={loading || undefined}
      aria-label={ariaLabel}
      title={title ?? ariaLabel}
      {...props}
    >
      {asChild ? children : loading ? <Spinner size="button" className="text-current" /> : children}
    </Comp>
  );
};

export { iconButtonVariants };
export type { IconButtonProps };
