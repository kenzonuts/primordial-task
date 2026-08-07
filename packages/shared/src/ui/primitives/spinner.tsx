import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactElement } from 'react';

import { cn } from '@shared/ui/lib/cn';

const spinnerVariants = cva(
  'inline-block shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent',
  {
    variants: {
      size: {
        inline: 'size-[14px]',
        button: 'size-4',
        page: 'size-6',
      },
    },
    defaultVariants: {
      size: 'inline',
    },
  },
);

type SpinnerProps = ComponentPropsWithoutRef<'span'> &
  VariantProps<typeof spinnerVariants> & {
    readonly label?: string;
  };

export const Spinner = ({
  className,
  size,
  label = 'Loading',
  ...props
}: SpinnerProps): ReactElement => {
  return (
    <span
      role="status"
      aria-live="polite"
      className={cn(spinnerVariants({ size }), className)}
      {...props}
    >
      <span className="sr-only">{label}</span>
    </span>
  );
};

export { spinnerVariants };
export type { SpinnerProps };
