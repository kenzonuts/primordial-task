import { BarChart3 } from 'lucide-react';
import type { ReactElement, ReactNode } from 'react';

import { EmptyState } from '@shared/ui/composites/empty-state';
import { cn } from '@shared/ui/lib/cn';

type AnalyticsEmptyStateProps = {
  readonly title?: string;
  readonly description?: string;
  readonly action?: ReactNode;
  readonly className?: string;
};

export const AnalyticsEmptyState = ({
  title = 'Not enough data yet',
  description = 'Not enough data yet. Complete more tasks to see analytics.',
  action,
  className,
}: AnalyticsEmptyStateProps): ReactElement => {
  return (
    <EmptyState
      icon={<BarChart3 aria-hidden="true" />}
      title={title}
      description={description}
      action={action}
      className={cn(className)}
    />
  );
};

export type { AnalyticsEmptyStateProps };
