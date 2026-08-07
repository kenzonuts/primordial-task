import * as SeparatorPrimitive from '@radix-ui/react-separator';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactElement } from 'react';

import { cn } from '@shared/ui/lib/cn';

const separatorVariants = cva('shrink-0 bg-[var(--divider)]', {
  variants: {
    orientation: {
      horizontal: 'h-px w-full',
      vertical: 'h-full w-px',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});

type SeparatorProps = ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> &
  VariantProps<typeof separatorVariants>;

export const Separator = ({
  className,
  orientation = 'horizontal',
  decorative = true,
  ...props
}: SeparatorProps): ReactElement => {
  return (
    <SeparatorPrimitive.Root
      decorative={decorative}
      orientation={orientation ?? 'horizontal'}
      className={cn(separatorVariants({ orientation }), className)}
      {...props}
    />
  );
};

export { separatorVariants };
export type { SeparatorProps };
