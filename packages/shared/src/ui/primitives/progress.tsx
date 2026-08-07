import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactElement } from 'react';

import { cn } from '@shared/ui/lib/cn';

const progressVariants = cva('relative w-full overflow-hidden rounded-full bg-surface-elevated', {
  variants: {
    size: {
      thin: 'h-[4px]',
      standard: 'h-[6px]',
      large: 'h-[10px]',
    },
  },
  defaultVariants: {
    size: 'standard',
  },
});

type ProgressProps = ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> &
  VariantProps<typeof progressVariants> & {
    readonly value: number;
    readonly max?: number;
  };

export const Progress = ({
  className,
  size,
  value,
  max = 100,
  ...props
}: ProgressProps): ReactElement => {
  const clamped = Math.min(Math.max(value, 0), max);
  const percent = max === 0 ? 0 : (clamped / max) * 100;

  return (
    <ProgressPrimitive.Root
      value={clamped}
      max={max}
      className={cn(progressVariants({ size }), className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 rounded-full bg-gray-100 ds-transition-base"
        style={{ transform: `translateX(-${100 - percent}%)` }}
      />
    </ProgressPrimitive.Root>
  );
};

export { progressVariants };
export type { ProgressProps };
