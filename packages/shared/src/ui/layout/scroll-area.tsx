import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react';

import { cn } from '@shared/ui/lib/cn';

export type ScrollAreaProps = ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & {
  readonly children?: ReactNode;
  readonly className?: string;
  readonly viewportClassName?: string;
  readonly orientation?: 'vertical' | 'horizontal' | 'both';
};

export const ScrollArea = ({
  children,
  className,
  viewportClassName,
  orientation = 'vertical',
  ...rest
}: ScrollAreaProps): ReactElement => {
  const showVertical = orientation === 'vertical' || orientation === 'both';
  const showHorizontal = orientation === 'horizontal' || orientation === 'both';

  return (
    <ScrollAreaPrimitive.Root className={cn('relative overflow-hidden', className)} {...rest}>
      <ScrollAreaPrimitive.Viewport
        className={cn('h-full w-full rounded-[inherit]', viewportClassName)}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>

      {showVertical ? <ScrollBar orientation="vertical" /> : null}

      {showHorizontal ? <ScrollBar orientation="horizontal" /> : null}

      <ScrollAreaPrimitive.Corner className="bg-transparent" />
    </ScrollAreaPrimitive.Root>
  );
};

type ScrollBarProps = ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>;

const ScrollBar = ({
  className,
  orientation = 'vertical',
  ...rest
}: ScrollBarProps): ReactElement => {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      orientation={orientation}
      className={cn(
        'flex touch-none select-none transition-colors',
        orientation === 'vertical' &&
          'h-full w-[var(--space-8)] border-l border-l-transparent p-px',
        orientation === 'horizontal' &&
          'h-[var(--space-8)] w-full flex-col border-t border-t-transparent p-px',
        className,
      )}
      {...rest}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        className={cn(
          'relative flex-1 rounded-full bg-border-default',
          'hover:bg-border-strong',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--state-focus)]',
        )}
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
};

export { ScrollBar };
