import type { ReactElement } from 'react';

import { DashboardWidget, TaskPreviewCard } from '@features/dashboard/components';
import { filterTasksByQuery } from '@features/dashboard/lib/filter-items';
import { useDashboardStore } from '@features/dashboard/store/dashboard-store';
import { toast } from '@shared/ui/feedback/toast';
import { Text } from '@shared/ui/typography/text';

export const UpcomingDeadlinesWidget = (): ReactElement => {
  const tasks = useDashboardStore((state) => state.upcomingDeadlines);
  const query = useDashboardStore((state) => state.filters.query);
  const dense = useDashboardStore((state) => state.preferences.denseLists);
  const visible = filterTasksByQuery(tasks, query).slice(0, 5);

  return (
    <DashboardWidget
      id="upcoming-deadlines"
      title="Upcoming Deadlines"
      count={visible.length}
      emptyTitle="No upcoming deadlines."
      emptyDescription="Deadlines for the next few days will appear here."
      onViewAll={() => {
        toast.message('Deadlines — Coming soon');
      }}
    >
      {visible.length === 0 ? (
        <Text as="p" variant="body-sm" muted>
          No deadlines match the current filters.
        </Text>
      ) : (
        <ul className="m-0 flex min-w-0 list-none flex-col gap-4 p-0">
          {visible.map((task) => (
            <li key={task.id}>
              <TaskPreviewCard task={task} dense={dense} />
            </li>
          ))}
        </ul>
      )}
    </DashboardWidget>
  );
};
