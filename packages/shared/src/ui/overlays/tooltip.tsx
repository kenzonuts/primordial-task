import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import type { ComponentPropsWithoutRef, ReactElement } from 'react';

import { cn } from '@shared/ui/lib/cn';

const TooltipProvider = ({
  delayDuration = 500,
  skipDelayDuration = 300,
  ...props
}: ComponentPropsWithoutRef<typeof TooltipPrimitive.Provider>): ReactElement => {
  return (
    <TooltipPrimitive.Provider
      delayDuration={delayDuration}
      skipDelayDuration={skipDelayDuration}
      {...props}
    />
  );
};

const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

type TooltipContentProps = ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>;

const TooltipContent = ({
  className,
  sideOffset = 6,
  ...props
}: TooltipContentProps): ReactElement => {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        sideOffset={sideOffset}
        className={cn(
          'z-[var(--z-tooltip)] max-w-[280px] rounded-md border border-border-default',
          'bg-surface-elevated px-2.5 py-2 text-xs leading-[18px] text-text-primary shadow-popover',
          'ds-fade-in ds-scale-in',
          className,
        )}
        {...props}
      />
    </TooltipPrimitive.Portal>
  );
};

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
export type { TooltipContentProps };
