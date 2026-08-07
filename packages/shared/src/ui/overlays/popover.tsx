import * as PopoverPrimitive from '@radix-ui/react-popover';
import type { ComponentPropsWithoutRef, ReactElement } from 'react';

import { cn } from '@shared/ui/lib/cn';

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverAnchor = PopoverPrimitive.Anchor;
const PopoverClose = PopoverPrimitive.Close;

type PopoverContentProps = ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>;

const PopoverContent = ({
  className,
  align = 'center',
  sideOffset = 6,
  ...props
}: PopoverContentProps): ReactElement => {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'z-[var(--z-popover)] w-72 min-w-[240px] max-w-[420px] rounded-lg border border-border-default',
          'bg-surface-elevated p-4 text-text-primary shadow-popover outline-none',
          'ds-fade-in ds-scale-in',
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
};

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor, PopoverClose };
export type { PopoverContentProps };
