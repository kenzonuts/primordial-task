import type { HTMLAttributes, ReactElement, ReactNode } from 'react';

import { cn } from '@shared/ui/lib/cn';

type WidgetCardPadding = 'none' | 'sm' | 'md';

type WidgetCardProps = HTMLAttributes<HTMLDivElement> & {
  readonly bordered?: boolean;
  readonly padding?: WidgetCardPadding;
  readonly children?: ReactNode;
};

const paddingClasses: Record<WidgetCardPadding, string> = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-4',
};

export const WidgetCard = ({
  bordered = true,
  padding = 'md',
  className,
  children,
  ...props
}: WidgetCardProps): ReactElement => {
  return (
    <div
      className={cn(
        'rounded-lg bg-surface-card text-text-primary outline-none',
        bordered && 'border border-border-default shadow-sm',
        paddingClasses[padding],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export type { WidgetCardProps, WidgetCardPadding };
