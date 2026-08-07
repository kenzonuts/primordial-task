import * as SwitchPrimitive from '@radix-ui/react-switch';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactElement } from 'react';

import { cn } from '@shared/ui/lib/cn';

const switchVariants = cva(
  [
    'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border border-transparent',
    'bg-surface-elevated ds-transition-fast',
    'focus-visible:outline-none focus-visible:ds-focus-ring',
    'disabled:cursor-not-allowed disabled:opacity-[var(--opacity-disabled)]',
    'data-[state=checked]:bg-gray-100',
  ],
  {
    variants: {
      size: {
        sm: 'h-4 w-7',
        md: 'h-5 w-9',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

const switchThumbVariants = cva(
  [
    'pointer-events-none block rounded-full bg-text-muted shadow-sm ds-transition-fast',
    'data-[state=checked]:bg-gray-950',
  ],
  {
    variants: {
      size: {
        sm: 'size-3 translate-x-0.5 data-[state=checked]:translate-x-3',
        md: 'size-4 translate-x-0.5 data-[state=checked]:translate-x-4',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

type SwitchProps = ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> &
  VariantProps<typeof switchVariants>;

export const Switch = ({ className, size, ...props }: SwitchProps): ReactElement => {
  return (
    <SwitchPrimitive.Root className={cn(switchVariants({ size }), className)} {...props}>
      <SwitchPrimitive.Thumb className={cn(switchThumbVariants({ size }))} />
    </SwitchPrimitive.Root>
  );
};

export { switchVariants };
export type { SwitchProps };
