import type { ReactElement } from 'react';

import { DashboardWidget, ProjectPreviewCard } from '@features/dashboard/components';
import { filterProjectsByQuery, filterProjectsByScope } from '@features/dashboard/lib/filter-items';
import { useDashboardStore } from '@features/dashboard/store/dashboard-store';
import { toast } from '@shared/ui/feedback/toast';
import { Text } from '@shared/ui/typography/text';

export const RecentProjectsWidget = (): ReactElement => {
  const projects = useDashboardStore((state) => state.recentProjects);
  const query = useDashboardStore((state) => state.filters.query);
  const scope = useDashboardStore((state) => state.filters.scope);
  const visible = filterProjectsByQuery(filterProjectsByScope(projects, scope), query).slice(0, 4);

  return (
    <DashboardWidget
      id="recent-projects"
      title="Recent Projects"
      count={visible.length}
      emptyTitle="No recent projects."
      emptyDescription="Projects you work on will show up here."
      onViewAll={() => {
        toast.message('Projects — Coming soon');
      }}
    >
      {visible.length === 0 ? (
        <Text as="p" variant="body-sm" muted>
          No projects match the current filters.
        </Text>
      ) : (
        <ul className="m-0 flex min-w-0 list-none flex-col gap-4 p-0">
          {visible.map((project) => (
            <li key={project.id}>
              <ProjectPreviewCard project={project} />
            </li>
          ))}
        </ul>
      )}
    </DashboardWidget>
  );
};
