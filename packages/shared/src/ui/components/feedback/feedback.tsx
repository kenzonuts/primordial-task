import type { ReactNode } from 'react';

import { cn } from '@ui/lib/cn';

type FeedbackTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

const toneClass: Record<FeedbackTone, string> = {
  neutral: 'border-border-default bg-surface text-text-primary',
  success: 'border-transparent bg-success-bg text-success',
  warning: 'border-transparent bg-warning-bg text-warning',
  danger: 'border-transparent bg-danger-bg text-danger',
  info: 'border-transparent bg-info-bg text-info',
};

interface AlertProps {
  readonly title: string;
  readonly description?: string;
  readonly tone?: FeedbackTone;
  readonly action?: ReactNode;
}

export const Alert = ({ title, description, tone = 'neutral', action }: AlertProps): ReactNode => {
  return (
    <div
      role={tone === 'danger' ? 'alert' : 'status'}
      className={cn('rounded-lg border p-4', toneClass[tone])}
    >
      <p className="text-sm font-[560]">{title}</p>
      {description ? <p className="mt-1 text-xs text-text-secondary">{description}</p> : null}
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  );
};

interface ToastProps extends AlertProps {
  readonly visible?: boolean;
}

export const Toast = ({ visible = true, ...props }: ToastProps): ReactNode => {
  if (!visible) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="w-full max-w-[420px] rounded-lg border border-border-default bg-surface p-4 shadow-popover"
    >
      <Alert {...props} />
    </div>
  );
};

export const Spinner = ({
  size = 16,
  className,
}: {
  size?: number;
  className?: string;
}): ReactNode => {
  return (
    <span
      aria-label="Loading"
      role="status"
      className={cn(
        'inline-block animate-spin rounded-full border-2 border-current border-t-transparent',
        className,
      )}
      style={{ width: size, height: size }}
    />
  );
};

export const LoadingIndicator = ({
  label = 'Loading...',
  className,
}: {
  label?: string;
  className?: string;
}): ReactNode => {
  return (
    <div className={cn('inline-flex items-center gap-2 text-xs text-text-secondary', className)}>
      <Spinner size={14} />
      <span>{label}</span>
    </div>
  );
};

export const Skeleton = ({ className }: { className?: string }): ReactNode => {
  return (
    <div
      aria-hidden
      className={cn(
        'animate-pulse rounded-sm bg-skeleton before:block before:h-full before:w-full before:animate-pulse before:bg-skeleton-highlight/20',
        className,
      )}
    />
  );
};

interface ProgressProps {
  readonly value: number;
  readonly max?: number;
  readonly label?: string;
}

export const Progress = ({ value, max = 100, label = 'Progress' }: ProgressProps): ReactNode => {
  const bounded = Math.max(0, Math.min(value, max));
  const percentage = (bounded / max) * 100;

  return (
    <div
      className="flex w-full flex-col gap-1"
      role="progressbar"
      aria-valuenow={bounded}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
    >
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-hover">
        <div
          className="h-full rounded-full bg-gray-100 transition-all duration-[180ms] ease-[cubic-bezier(0.2,0,0,1)]"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

interface EmptyStateProps {
  readonly title: string;
  readonly description?: string;
  readonly action?: ReactNode;
}

export const EmptyState = ({ title, description, action }: EmptyStateProps): ReactNode => {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-lg border border-border-subtle bg-surface px-6 text-center">
      <p className="text-base font-[600] text-text-primary">{title}</p>
      {description ? (
        <p className="max-w-[520px] text-sm text-text-secondary">{description}</p>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
};
