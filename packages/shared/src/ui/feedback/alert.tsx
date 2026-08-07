import { cva, type VariantProps } from 'class-variance-authority';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';
import type { HTMLAttributes, ReactElement, ReactNode } from 'react';

import { cn } from '@shared/ui/lib/cn';

const alertVariants = cva(
  'relative flex w-full gap-3 rounded-lg border px-4 py-3 text-sm leading-[22px]',
  {
    variants: {
      variant: {
        neutral: 'border-border-default bg-surface-card text-text-primary',
        success: 'border-success/30 bg-success-bg text-success',
        warning: 'border-warning/30 bg-warning-bg text-warning',
        danger: 'border-danger/30 bg-danger-bg text-danger',
        info: 'border-info/30 bg-info-bg text-info',
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  },
);

const alertIcons = {
  neutral: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: AlertCircle,
  info: Info,
} as const;

type AlertProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof alertVariants> & {
    readonly title?: ReactNode;
    readonly dismissible?: boolean;
    readonly onDismiss?: () => void;
    readonly icon?: ReactNode | false;
  };

export const Alert = ({
  className,
  variant = 'neutral',
  title,
  children,
  dismissible = false,
  onDismiss,
  icon,
  role,
  ...props
}: AlertProps): ReactElement => {
  const resolvedVariant = variant ?? 'neutral';
  const Icon = alertIcons[resolvedVariant];
  const isUrgent = resolvedVariant === 'danger' || resolvedVariant === 'warning';

  return (
    <div
      role={role ?? (isUrgent ? 'alert' : 'status')}
      className={cn(alertVariants({ variant: resolvedVariant }), className)}
      {...props}
    >
      {icon === false ? null : (
        <span className="mt-0.5 shrink-0 [&_svg]:size-4" aria-hidden={icon ? undefined : true}>
          {icon ?? <Icon />}
        </span>
      )}
      <div className="min-w-0 flex-1 space-y-1">
        {title ? <div className="font-medium text-text-primary">{title}</div> : null}
        {children ? (
          <div
            className={cn(
              'text-text-secondary',
              resolvedVariant !== 'neutral' && 'text-current/90',
            )}
          >
            {children}
          </div>
        ) : null}
      </div>
      {dismissible ? (
        <button
          type="button"
          onClick={onDismiss}
          className={cn(
            'shrink-0 rounded-sm text-current opacity-70 ds-transition-fast',
            'hover:opacity-100 focus-visible:outline-none focus-visible:ds-focus-ring',
          )}
          aria-label="Dismiss alert"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
};

export { alertVariants };
export type { AlertProps };
