import type { ReactElement } from 'react';

import { DashboardWidget, TaskPreviewCard } from '@features/dashboard/components';
import { filterTasksByQuery } from '@features/dashboard/lib/filter-items';
import { useDashboardStore } from '@features/dashboard/store/dashboard-store';
import { toast } from '@shared/ui/feedback/toast';
import { Text } from '@shared/ui/typography/text';

export const OverdueTasksWidget = (): ReactElement | null => {
  const tasks = useDashboardStore((state) => state.overdueTasks);
  const query = useDashboardStore((state) => state.filters.query);
  const dense = useDashboardStore((state) => state.preferences.denseLists);
  const showWhenEmpty = useDashboardStore((state) => state.preferences.showOverdueWhenEmpty);
  const loadState = useDashboardStore((state) => state.widgets['overdue-tasks']?.loadState);
  const visible = filterTasksByQuery(tasks, query).slice(0, 3);

  if ((loadState === 'empty' || tasks.length === 0) && !showWhenEmpty && !query.trim()) {
    return null;
  }

  return (
    <DashboardWidget
      id="overdue-tasks"
      title="Overdue Tasks"
      count={visible.length}
      emptyTitle="No overdue tasks."
      emptyDescription="You're caught up — keep an eye on upcoming deadlines."
      onViewAll={() => {
        toast.message('Overdue tasks — Coming soon');
      }}
    >
      {visible.length === 0 ? (
        <Text as="p" variant="body-sm" muted>
          No overdue tasks match the current filters.
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
