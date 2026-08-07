import { Plus } from 'lucide-react';
import type { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';

import { ProjectEmptyState } from '@features/project/components/project-empty-state';
import { ProjectGrid } from '@features/project/components/project-grid';
import { ProjectList } from '@features/project/components/project-list';
import { ProjectSkeleton } from '@features/project/components/project-skeleton';
import { ProjectToolbar } from '@features/project/components/project-toolbar';
import { useProjectContext } from '@features/project/context/project-context';
import {
  selectFavoriteProjects,
  selectFilteredProjects,
  selectPinnedProjects,
  selectRecentProjects,
  useProjectStore,
} from '@features/project/store/project-store';
import type { ProjectFilterKey, ProjectSortKey, ProjectViewMode } from '@features/project/types';
import { PROJECT_ROUTES, projectDetailPath } from '@features/project/types';
import { ContentLayout } from '@features/shell/layouts/content-layout';
import { Alert } from '@shared/ui/feedback/alert';
import { toast } from '@shared/ui/feedback/toast';
import { Inline } from '@shared/ui/layout/inline';
import { Stack } from '@shared/ui/layout/stack';
import { Button } from '@shared/ui/primitives/button';
import { Text } from '@shared/ui/typography/text';

export const ProjectListPage = (): ReactElement => {
  const navigate = useNavigate();
  const { workspaceId, loadProjects } = useProjectContext();
  const status = useProjectStore((state) => state.status);
  const error = useProjectStore((state) => state.error);
  const filters = useProjectStore((state) => state.filters);
  const setFilters = useProjectStore((state) => state.setFilters);
  const clearError = useProjectStore((state) => state.clearError);
  const toggleFavorite = useProjectStore((state) => state.toggleFavorite);
  const togglePinned = useProjectStore((state) => state.togglePinned);
  const selectedProjectId = useProjectStore((state) => state.selectedProjectId);
  const setSelectedProjectId = useProjectStore((state) => state.setSelectedProjectId);
  const projects = useProjectStore(selectFilteredProjects);
  const pinned = useProjectStore(selectPinnedProjects);
  const recent = useProjectStore(selectRecentProjects);
  const favorites = useProjectStore(selectFavoriteProjects);
  const totalCount = useProjectStore((state) => state.projects.length);

  const isLoading = status === 'idle' || status === 'loading';
  const hasActiveFilters = filters.query.trim().length > 0 || filters.filter !== 'all';

  let emptyVariant: 'none' | 'no-results' | 'archived' = 'none';
  if (filters.filter === 'archived') {
    emptyVariant = 'archived';
  } else if (hasActiveFilters || totalCount > 0) {
    emptyVariant = 'no-results';
  }

  const createAction = (
    <Button
      type="button"
      variant="primary"
      size="md"
      onClick={() => {
        navigate(PROJECT_ROUTES.create);
      }}
    >
      <Plus aria-hidden="true" />
      Create project
    </Button>
  );

  const handleOpen = (projectId: string): void => {
    setSelectedProjectId(projectId);
    navigate(projectDetailPath(projectId));
  };

  const handleToggleFavorite = (projectId: string): void => {
    if (!workspaceId) {
      return;
    }
    void toggleFavorite(workspaceId, projectId).catch((err: unknown) => {
      toast.error(err instanceof Error ? err.message : 'Could not update favorite.');
    });
  };

  const handleTogglePinned = (projectId: string): void => {
    if (!workspaceId) {
      return;
    }
    void togglePinned(workspaceId, projectId).catch((err: unknown) => {
      toast.error(err instanceof Error ? err.message : 'Could not update pin.');
    });
  };

  const showStrips =
    !isLoading &&
    status === 'ready' &&
    filters.filter === 'all' &&
    !filters.query.trim() &&
    (pinned.length > 0 || recent.length > 0);

  return (
    <ContentLayout
      title="Projects"
      description="Organize work inside the active workspace."
      actions={createAction}
    >
      <Stack gap={24} className="mt-24">
        <ProjectToolbar
          query={filters.query}
          onQueryChange={(query) => {
            setFilters({ query });
          }}
          sort={filters.sort}
          onSortChange={(sort: ProjectSortKey) => {
            setFilters({ sort });
          }}
          filter={filters.filter}
          onFilterChange={(filter: ProjectFilterKey) => {
            setFilters({ filter });
          }}
          view={filters.view}
          onViewChange={(view: ProjectViewMode) => {
            setFilters({ view });
          }}
          createAction={createAction}
          disabled={isLoading || !workspaceId}
        />

        {status === 'error' && error ? (
          <Alert
            variant="danger"
            title="Projects could not be loaded."
            dismissible
            onDismiss={clearError}
          >
            <Stack gap={12}>
              <span>{error}</span>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="self-start"
                onClick={() => {
                  void loadProjects();
                }}
              >
                Try again
              </Button>
            </Stack>
          </Alert>
        ) : null}

        {!workspaceId ? (
          <Alert variant="warning" title="No workspace selected">
            Select a workspace to view its projects.
          </Alert>
        ) : null}

        {showStrips ? (
          <Stack gap={16}>
            {pinned.length > 0 ? (
              <Stack gap={8}>
                <Text as="h2" variant="h3">
                  Pinned
                </Text>
                <Inline gap={8} className="flex-wrap">
                  {pinned.slice(0, 6).map((project) => (
                    <Button
                      key={project.id}
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        handleOpen(project.id);
                      }}
                    >
                      {project.name}
                    </Button>
                  ))}
                </Inline>
              </Stack>
            ) : null}
            {recent.length > 0 ? (
              <Stack gap={8}>
                <Text as="h2" variant="h3">
                  Recent
                </Text>
                <Inline gap={8} className="flex-wrap">
                  {recent.map((project) => (
                    <Button
                      key={project.id}
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        handleOpen(project.id);
                      }}
                    >
                      {project.name}
                    </Button>
                  ))}
                </Inline>
              </Stack>
            ) : null}
            {favorites.length > 0 && pinned.length === 0 ? (
              <Stack gap={8}>
                <Text as="h2" variant="h3">
                  Favorites
                </Text>
                <Inline gap={8} className="flex-wrap">
                  {favorites.slice(0, 6).map((project) => (
                    <Button
                      key={project.id}
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        handleOpen(project.id);
                      }}
                    >
                      {project.name}
                    </Button>
                  ))}
                </Inline>
              </Stack>
            ) : null}
          </Stack>
        ) : null}

        {isLoading ? (
          <ProjectSkeleton variant={filters.view} count={filters.view === 'grid' ? 6 : 5} />
        ) : null}

        {!isLoading && status === 'ready' && projects.length === 0 ? (
          <ProjectEmptyState
            variant={emptyVariant}
            action={emptyVariant === 'none' ? createAction : undefined}
          />
        ) : null}

        {!isLoading && status === 'ready' && projects.length > 0 ? (
          filters.view === 'list' ? (
            <ProjectList
              projects={projects}
              selectedId={selectedProjectId}
              onOpen={handleOpen}
              onToggleFavorite={handleToggleFavorite}
              onTogglePinned={handleTogglePinned}
            />
          ) : (
            <ProjectGrid
              projects={projects}
              selectedId={selectedProjectId}
              onOpen={handleOpen}
              onToggleFavorite={handleToggleFavorite}
              onTogglePinned={handleTogglePinned}
            />
          )
        ) : null}
      </Stack>
    </ContentLayout>
  );
};
