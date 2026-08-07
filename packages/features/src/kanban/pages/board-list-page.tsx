import { Plus, Search } from 'lucide-react';
import type { ReactElement } from 'react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { BoardListCard } from '@features/kanban/components/board-list-card';
import { KanbanEmptyState } from '@features/kanban/components/kanban-empty-state';
import { useKanbanContext } from '@features/kanban/context/kanban-context';
import { useKanbanBoardStore } from '@features/kanban/store';
import { KANBAN_ROUTES, kanbanBoardPath } from '@features/kanban/types';
import { ContentLayout } from '@features/shell/layouts/content-layout';
import { SearchInput } from '@shared/ui/composites/search-input';
import { Alert } from '@shared/ui/feedback/alert';
import { toast } from '@shared/ui/feedback/toast';
import { Inline } from '@shared/ui/layout/inline';
import { Stack } from '@shared/ui/layout/stack';
import { Button } from '@shared/ui/primitives/button';
import { Skeleton } from '@shared/ui/primitives/skeleton';
import { Switch } from '@shared/ui/primitives/switch';
import { Text } from '@shared/ui/typography/text';

export const BoardListPage = (): ReactElement => {
  const navigate = useNavigate();
  const { workspaceId, boards, status, loadBoards } = useKanbanContext();
  const error = useKanbanBoardStore((state) => state.error);
  const clearError = useKanbanBoardStore((state) => state.clearError);
  const toggleFavorite = useKanbanBoardStore((state) => state.toggleFavorite);

  const [query, setQuery] = useState('');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

  const isLoading = status === 'idle' || status === 'loading';

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return boards.filter((board) => {
      const archived = board.archivedAt !== null;
      if (showArchived ? !archived : archived) {
        return false;
      }
      if (favoritesOnly && !board.isFavorite) {
        return false;
      }
      if (!normalized) {
        return true;
      }
      return (
        board.name.toLowerCase().includes(normalized) ||
        board.projectName.toLowerCase().includes(normalized) ||
        board.description.toLowerCase().includes(normalized)
      );
    });
  }, [boards, query, favoritesOnly, showArchived]);

  const createAction = (
    <Button
      type="button"
      variant="primary"
      size="md"
      onClick={() => {
        navigate(KANBAN_ROUTES.create);
      }}
    >
      <Plus aria-hidden="true" />
      Create board
    </Button>
  );

  const handleOpen = (boardId: string): void => {
    navigate(kanbanBoardPath(boardId));
  };

  const handleToggleFavorite = (boardId: string): void => {
    if (!workspaceId) {
      return;
    }
    void toggleFavorite(workspaceId, boardId).catch((err: unknown) => {
      toast.error(err instanceof Error ? err.message : 'Could not update favorite.');
    });
  };

  let emptyVariant: 'no-tasks' | 'no-results' = 'no-tasks';
  if (query.trim() || favoritesOnly || boards.length > 0) {
    emptyVariant = 'no-results';
  }

  return (
    <ContentLayout
      title="Kanban"
      description="Execution boards for projects in this workspace."
      actions={createAction}
    >
      <Stack gap={24} className="mt-24">
        <Inline gap={12} align="center" className="flex-wrap">
          <SearchInput
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
            }}
            onClear={() => {
              setQuery('');
            }}
            placeholder="Search boards…"
            aria-label="Search boards"
            className="w-full max-w-[320px]"
          />
          <Button
            type="button"
            size="sm"
            variant={favoritesOnly ? 'secondary' : 'ghost'}
            aria-pressed={favoritesOnly}
            onClick={() => {
              setFavoritesOnly((value) => !value);
            }}
          >
            Favorites
          </Button>
          <Inline gap={8} align="center">
            <Switch
              id="kanban-show-archived"
              checked={showArchived}
              onCheckedChange={setShowArchived}
              aria-label="Show archived boards"
            />
            <Text as="label" htmlFor="kanban-show-archived" variant="body-sm">
              Show archived
            </Text>
          </Inline>
          {createAction}
        </Inline>

        {status === 'error' && error ? (
          <Alert
            variant="danger"
            title="Boards could not be loaded."
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
                  void loadBoards();
                }}
              >
                Try again
              </Button>
            </Stack>
          </Alert>
        ) : null}

        {!workspaceId ? (
          <Alert variant="warning" title="No workspace selected">
            Select a workspace to view its boards.
          </Alert>
        ) : null}

        {isLoading && workspaceId ? (
          <div className="grid grid-cols-1 gap-16 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <Skeleton key={index} className="h-36 w-full rounded-lg" />
            ))}
          </div>
        ) : null}

        {!isLoading && workspaceId && filtered.length === 0 ? (
          <KanbanEmptyState
            variant={emptyVariant}
            title={
              showArchived
                ? 'No archived boards'
                : emptyVariant === 'no-results'
                  ? 'No matching boards'
                  : 'No boards yet'
            }
            description={
              showArchived
                ? 'Archived boards will appear here when you archive one.'
                : emptyVariant === 'no-results'
                  ? 'Try a different search term or clear filters.'
                  : 'Create a board to start organizing project work on a Kanban workflow.'
            }
            action={
              emptyVariant === 'no-tasks' && !showArchived ? (
                createAction
              ) : (
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={() => {
                    setQuery('');
                    setFavoritesOnly(false);
                    setShowArchived(false);
                  }}
                >
                  <Search aria-hidden="true" />
                  Clear filters
                </Button>
              )
            }
          />
        ) : null}

        {!isLoading && filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-16 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((board) => (
              <BoardListCard
                key={board.id}
                board={board}
                onOpen={handleOpen}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        ) : null}
      </Stack>
    </ContentLayout>
  );
};
