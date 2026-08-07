import type { HTMLAttributes, ReactElement, ReactNode } from 'react';

import { cn } from '@shared/ui/lib/cn';

type EmptyStateProps = HTMLAttributes<HTMLDivElement> & {
  readonly icon?: ReactNode;
  readonly title: ReactNode;
  readonly description?: ReactNode;
  readonly action?: ReactNode;
};

export const EmptyState = ({
  className,
  icon,
  title,
  description,
  action,
  ...props
}: EmptyStateProps): ReactElement => {
  return (
    <div
      role="status"
      className={cn(
        'flex flex-col items-center justify-center gap-3 px-6 py-12 text-center',
        className,
      )}
      {...props}
    >
      {icon ? (
        <div
          className="flex size-12 items-center justify-center rounded-lg bg-surface-elevated text-text-muted [&_svg]:size-6"
          aria-hidden="true"
        >
          {icon}
        </div>
      ) : null}
      <div className="space-y-1.5">
        <h3 className="text-[15px] font-semibold leading-[22px] text-text-primary">{title}</h3>
        {description ? (
          <p className="max-w-sm text-sm leading-[22px] text-text-secondary">{description}</p>
        ) : null}
      </div>
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  );
};

export type { EmptyStateProps };
