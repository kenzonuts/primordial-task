import type { ReactElement } from 'react';

import { cn } from '@shared/ui/lib/cn';

export type StatusTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

type StatusIndicatorProps = {
  readonly tone?: StatusTone;
  readonly label?: string;
  readonly className?: string;
  readonly size?: 'sm' | 'md';
};

const toneClasses: Record<StatusTone, string> = {
  neutral: 'bg-text-muted',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  info: 'bg-info',
};

const sizeClasses = {
  sm: 'size-1.5',
  md: 'size-2',
} as const;

export const StatusIndicator = ({
  tone = 'neutral',
  label,
  className,
  size = 'sm',
}: StatusIndicatorProps): ReactElement => {
  return (
    <span
      role={label ? 'status' : 'presentation'}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn(
        'inline-block shrink-0 rounded-full',
        sizeClasses[size],
        toneClasses[tone],
        className,
      )}
    />
  );
};

export type { StatusIndicatorProps };
