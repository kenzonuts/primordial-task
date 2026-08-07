import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes, ReactElement } from 'react';

import { cn } from '@shared/ui/lib/cn';

const skeletonVariants = cva(
  [
    'bg-state-skeleton',
    'bg-[linear-gradient(90deg,var(--state-skeleton)_0%,var(--state-skeleton-highlight)_50%,var(--state-skeleton)_100%)]',
    'bg-[length:200%_100%]',
    'motion-safe:animate-[ds-skeleton-shimmer_1.4s_ease-in-out_infinite]',
    'motion-reduce:animate-none motion-reduce:bg-state-skeleton',
  ],
  {
    variants: {
      rounded: {
        default: 'rounded-md',
        full: 'rounded-full',
        none: 'rounded-none',
      },
    },
    defaultVariants: {
      rounded: 'default',
    },
  },
);

type SkeletonProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof skeletonVariants>;

export const Skeleton = ({ className, rounded, ...props }: SkeletonProps): ReactElement => {
  return <div aria-hidden className={cn(skeletonVariants({ rounded }), className)} {...props} />;
};

export { skeletonVariants };
export type { SkeletonProps };
