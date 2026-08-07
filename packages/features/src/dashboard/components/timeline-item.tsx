import type { ReactElement } from 'react';

import { ActivityItem } from '@features/dashboard/components/activity-item';
import type { DashboardActivityItem } from '@features/dashboard/types';
import { cn } from '@shared/ui/lib/cn';

type TimelineItemProps = {
  readonly item: DashboardActivityItem;
  readonly isLast?: boolean;
  readonly className?: string;
};

export const TimelineItem = ({
  item,
  isLast = false,
  className,
}: TimelineItemProps): ReactElement => {
  return (
    <li className={cn('relative flex gap-12 pb-16 last:pb-0', className)}>
      <div className="relative flex w-3 shrink-0 justify-center" aria-hidden="true">
        <span className="mt-1.5 size-2 rounded-full bg-border-strong" />
        {!isLast ? <span className="absolute top-4 bottom-0 w-px bg-border-subtle" /> : null}
      </div>
      <ActivityItem item={item} className="min-w-0 flex-1" />
    </li>
  );
};

export type { TimelineItemProps };
