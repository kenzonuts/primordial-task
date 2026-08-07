import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes, ReactElement } from 'react';

import { cn } from '@shared/ui/lib/cn';

const badgeVariants = cva(
  'inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-md font-medium',
  {
    variants: {
      variant: {
        neutral: 'bg-state-selected text-text-secondary',
        success: 'bg-success-bg text-success',
        warning: 'bg-warning-bg text-warning',
        danger: 'bg-danger-bg text-danger',
        info: 'bg-info-bg text-info',
      },
      size: {
        sm: 'h-5 px-1.5 text-[11px] leading-4',
        md: 'h-6 px-2 text-xs leading-4',
      },
    },
    defaultVariants: {
      variant: 'neutral',
      size: 'md',
    },
  },
);

type BadgeProps = HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>;

export const Badge = ({ className, variant, size, ...props }: BadgeProps): ReactElement => {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />;
};

export { badgeVariants };
export type { BadgeProps };
