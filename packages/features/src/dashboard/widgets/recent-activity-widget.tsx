import type { ReactElement } from 'react';

import { DashboardWidget, TimelineItem } from '@features/dashboard/components';
import { normalizeFilterQuery } from '@features/dashboard/lib/filter-items';
import { useDashboardStore } from '@features/dashboard/store/dashboard-store';
import { toast } from '@shared/ui/feedback/toast';
import { Text } from '@shared/ui/typography/text';

export const RecentActivityWidget = (): ReactElement => {
  const activity = useDashboardStore((state) => state.recentActivity);
  const query = useDashboardStore((state) => state.filters.query);
  const normalized = normalizeFilterQuery(query);
  const visible = (
    normalized
      ? activity.filter(
          (item) =>
            item.actor.toLowerCase().includes(normalized) ||
            item.action.toLowerCase().includes(normalized) ||
            item.target.toLowerCase().includes(normalized),
        )
      : activity
  ).slice(0, 8);

  return (
    <DashboardWidget
      id="recent-activity"
      title="Recent Activity"
      count={visible.length}
      emptyTitle="No recent activity."
      emptyDescription="Workspace changes will appear in this feed."
      onViewAll={() => {
        toast.message('Activity — Coming soon');
      }}
    >
      {visible.length === 0 ? (
        <Text as="p" variant="body-sm" muted>
          No activity matches the current filters.
        </Text>
      ) : (
        <ol className="m-0 list-none p-0">
          {visible.map((item, index) => (
            <TimelineItem key={item.id} item={item} isLast={index === visible.length - 1} />
          ))}
        </ol>
      )}
    </DashboardWidget>
  );
};
