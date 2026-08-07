import type { ReactElement } from 'react';

import { DashboardWidget, ProjectPreviewCard } from '@features/dashboard/components';
import { filterProjectsByQuery } from '@features/dashboard/lib/filter-items';
import { useDashboardStore } from '@features/dashboard/store/dashboard-store';
import { toast } from '@shared/ui/feedback/toast';
import { Text } from '@shared/ui/typography/text';

export const FavoriteProjectsWidget = (): ReactElement => {
  const favorites = useDashboardStore((state) => state.favoriteProjects);
  const query = useDashboardStore((state) => state.filters.query);
  const scope = useDashboardStore((state) => state.filters.scope);
  const scoped =
    scope === 'archived'
      ? []
      : scope === 'pinned'
        ? favorites.filter((p) => p.isPinned)
        : favorites;
  const visible = filterProjectsByQuery(scoped, query).slice(0, 4);

  return (
    <DashboardWidget
      id="favorite-projects"
      title="Favorites"
      count={visible.length}
      emptyTitle="No favorite projects."
      emptyDescription="Star projects to keep them within reach."
      onViewAll={() => {
        toast.message('Favorites — Coming soon');
      }}
    >
      {visible.length === 0 ? (
        <Text as="p" variant="body-sm" muted>
          No favorites match the current filters.
        </Text>
      ) : (
        <ul className="m-0 flex list-none flex-col gap-4 p-0">
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
