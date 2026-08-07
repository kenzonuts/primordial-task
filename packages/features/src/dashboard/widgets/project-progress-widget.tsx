import type { ReactElement } from 'react';

import { DashboardWidget, ProjectPreviewCard } from '@features/dashboard/components';
import { filterProjectsByQuery, filterProjectsByScope } from '@features/dashboard/lib/filter-items';
import { useDashboardStore } from '@features/dashboard/store/dashboard-store';
import { toast } from '@shared/ui/feedback/toast';
import { Text } from '@shared/ui/typography/text';

export const ProjectProgressWidget = (): ReactElement => {
  const projects = useDashboardStore((state) => state.recentProjects);
  const query = useDashboardStore((state) => state.filters.query);
  const scope = useDashboardStore((state) => state.filters.scope);
  const visible = filterProjectsByQuery(filterProjectsByScope(projects, scope), query)
    .slice()
    .sort((left, right) => right.progress - left.progress)
    .slice(0, 4);

  return (
    <DashboardWidget
      id="project-progress"
      title="Project Progress"
      count={visible.length}
      emptyTitle="No project progress yet."
      emptyDescription="Progress bars appear once projects have tracked work."
      onViewAll={() => {
        toast.message('Project progress — Coming soon');
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
