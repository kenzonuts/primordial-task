import { Plus } from 'lucide-react';
import type { ReactElement, ReactNode } from 'react';
import { useEffect, useState } from 'react';

import { WorkspaceEmptyState } from '@features/workspace/components/workspace-empty-state';
import { WorkspaceGrid } from '@features/workspace/components/workspace-grid';
import { WorkspaceList } from '@features/workspace/components/workspace-list';
import { WorkspaceSkeleton } from '@features/workspace/components/workspace-skeleton';
import { WorkspaceToolbar } from '@features/workspace/components/workspace-toolbar';
import {
  selectFilteredWorkspaces,
  useWorkspaceStore,
} from '@features/workspace/store/workspace-store';
import type { Workspace, WorkspaceFilterKey, WorkspaceSortKey } from '@features/workspace/types';
import { Alert } from '@shared/ui/feedback/alert';
import { toast } from '@shared/ui/feedback/toast';
import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import { Button } from '@shared/ui/primitives/button';

type WorkspaceSelectorProps = {
  readonly view?: 'grid' | 'list';
  readonly selectedId?: string | null;
  readonly onSelect?: (workspace: Workspace) => void;
  readonly onOpen: (workspace: Workspace) => void;
  readonly createAction?: ReactNode;
  readonly className?: string;
};

export const WorkspaceSelector = ({
  view = 'grid',
  selectedId: controlledSelectedId,
  onSelect,
  onOpen,
  createAction,
  className,
}: WorkspaceSelectorProps): ReactElement => {
  const status = useWorkspaceStore((state) => state.status);
  const error = useWorkspaceStore((state) => state.error);
  const filters = useWorkspaceStore((state) => state.filters);
  const setFilters = useWorkspaceStore((state) => state.setFilters);
  const initialize = useWorkspaceStore((state) => state.initialize);
  const refresh = useWorkspaceStore((state) => state.refresh);
  const toggleFavorite = useWorkspaceStore((state) => state.toggleFavorite);
  const clearError = useWorkspaceStore((state) => state.clearError);
  const workspaces = useWorkspaceStore(selectFilteredWorkspaces);
  const totalCount = useWorkspaceStore((state) => state.workspaces.length);

  const [selectedId, setSelectedId] = useState<string | null>(controlledSelectedId ?? null);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  useEffect(() => {
    if (controlledSelectedId !== undefined) {
      setSelectedId(controlledSelectedId);
    }
  }, [controlledSelectedId]);

  const resolveWorkspace = (workspaceId: string): Workspace | undefined => {
    return workspaces.find((workspace) => workspace.id === workspaceId);
  };

  const handleSelect = (workspaceId: string): void => {
    setSelectedId(workspaceId);
    const workspace = resolveWorkspace(workspaceId);
    if (workspace) {
      onSelect?.(workspace);
    }
  };

  const handleOpen = (workspaceId: string): void => {
    const workspace = resolveWorkspace(workspaceId);
    if (workspace) {
      onOpen(workspace);
    }
  };

  const handleToggleFavorite = (workspaceId: string): void => {
    void toggleFavorite(workspaceId).catch((err: unknown) => {
      toast.error(err instanceof Error ? err.message : 'Could not update favorite.');
    });
  };

  const handleQueryChange = (query: string): void => {
    setFilters({ query });
  };

  const handleSortChange = (sort: WorkspaceSortKey): void => {
    setFilters({ sort });
  };

  const handleFilterChange = (filter: WorkspaceFilterKey): void => {
    setFilters({ filter });
  };

  const resolvedCreateAction = createAction ?? (
    <Button type="button" variant="primary" size="md" disabled>
      <Plus aria-hidden="true" />
      New workspace
    </Button>
  );

  const isLoading = status === 'idle' || status === 'loading';
  const hasActiveFilters = filters.query.trim().length > 0 || filters.filter !== 'all';

  let emptyVariant: 'none' | 'no-results' | 'archived' = 'none';
  if (filters.filter === 'archived') {
    emptyVariant = 'archived';
  } else if (hasActiveFilters || totalCount > 0) {
    emptyVariant = 'no-results';
  }

  return (
    <Stack gap={24} className={cn('w-full', className)}>
      <WorkspaceToolbar
        query={filters.query}
        onQueryChange={handleQueryChange}
        sort={filters.sort}
        onSortChange={handleSortChange}
        filter={filters.filter}
        onFilterChange={handleFilterChange}
        createAction={resolvedCreateAction}
        disabled={isLoading}
      />

      {status === 'error' && error ? (
        <Alert
          variant="danger"
          title="Could not load workspaces"
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
              onClick={() => void refresh()}
            >
              Try again
            </Button>
          </Stack>
        </Alert>
      ) : null}

      {isLoading ? <WorkspaceSkeleton variant={view} count={view === 'grid' ? 6 : 5} /> : null}

      {!isLoading && status === 'ready' && workspaces.length === 0 ? (
        <WorkspaceEmptyState
          variant={emptyVariant}
          action={emptyVariant === 'none' ? resolvedCreateAction : undefined}
        />
      ) : null}

      {!isLoading && status === 'ready' && workspaces.length > 0 ? (
        view === 'list' ? (
          <WorkspaceList
            workspaces={workspaces}
            selectedId={selectedId}
            onSelect={handleSelect}
            onOpen={handleOpen}
            onToggleFavorite={handleToggleFavorite}
          />
        ) : (
          <WorkspaceGrid
            workspaces={workspaces}
            selectedId={selectedId}
            onSelect={handleSelect}
            onOpen={handleOpen}
            onToggleFavorite={handleToggleFavorite}
          />
        )
      ) : null}
    </Stack>
  );
};

export type { WorkspaceSelectorProps };
