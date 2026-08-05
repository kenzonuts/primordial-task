import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@ui/lib/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  readonly interactive?: boolean;
  readonly selected?: boolean;
  readonly compact?: boolean;
}

export const Card = ({
  children,
  interactive = false,
  selected = false,
  compact = false,
  className,
  ...props
}: CardProps): ReactNode => {
  return (
    <div
      className={cn(
        'rounded-lg border border-border-default bg-card shadow-sm',
        compact ? 'p-4' : 'p-5',
        interactive &&
          'cursor-pointer transition-colors duration-[120ms] ease-[cubic-bezier(0.2,0,0,1)] hover:border-border-strong hover:bg-hover focus-within:ring-2 focus-within:ring-focus focus-within:ring-offset-2 focus-within:ring-offset-app',
        selected && 'border-border-strong bg-selected',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}): ReactNode => {
  return (
    <div className={cn('mb-3 flex items-start justify-between gap-3', className)}>{children}</div>
  );
};

export const CardBody = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}): ReactNode => {
  return <div className={cn('flex flex-col gap-3', className)}>{children}</div>;
};

export const CardFooter = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}): ReactNode => {
  return (
    <div className={cn('mt-4 flex items-center justify-end gap-2', className)}>{children}</div>
  );
};
