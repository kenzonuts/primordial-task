import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes, ReactElement } from 'react';

import { cn } from '@shared/ui/lib/cn';

const tagVariants = cva(
  'inline-flex items-center justify-center gap-[4px] whitespace-nowrap font-medium ds-transition-fast',
  {
    variants: {
      variant: {
        neutral: 'border border-transparent bg-state-selected text-text-secondary',
        outlined: 'border border-border-default bg-transparent text-text-secondary',
      },
      size: {
        sm: 'h-[20px] rounded-[var(--radius-sm)] px-[6px] text-[11px] leading-4',
        md: 'h-[24px] rounded-md px-[8px] text-xs leading-4',
      },
    },
    defaultVariants: {
      variant: 'neutral',
      size: 'md',
    },
  },
);

type TagProps = HTMLAttributes<HTMLSpanElement> & VariantProps<typeof tagVariants>;

export const Tag = ({ className, variant, size, ...props }: TagProps): ReactElement => {
  return <span className={cn(tagVariants({ variant, size }), className)} {...props} />;
};

export { tagVariants };
export type { TagProps };
