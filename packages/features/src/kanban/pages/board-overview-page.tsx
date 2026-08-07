import type { ReactElement } from 'react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { KanbanStatistics } from '@features/kanban/components';
import { useKanbanContext } from '@features/kanban/context/kanban-context';
import { useKanbanBoardStore, useKanbanColumnStore } from '@features/kanban/store';
import { KANBAN_ROUTES, kanbanBoardPath, kanbanSettingsPath } from '@features/kanban/types';
import { ContentLayout } from '@features/shell/layouts/content-layout';
import { useTaskContext } from '@features/task/context/task-context';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/composites/card';
import { EmptyState } from '@shared/ui/composites/empty-state';
import { LoadingIndicator } from '@shared/ui/composites/loading-indicator';
import { Alert } from '@shared/ui/feedback/alert';
import { Inline } from '@shared/ui/layout/inline';
import { Stack } from '@shared/ui/layout/stack';
import { Button } from '@shared/ui/primitives/button';
import { Text } from '@shared/ui/typography/text';

export const BoardOverviewPage = (): ReactElement => {
  const { boardId = '' } = useParams();
  const navigate = useNavigate();
  const { workspaceId } = useKanbanContext();
  const { tasks } = useTaskContext();

  const currentBoard = useKanbanBoardStore((state) => state.currentBoard);
  const statistics = useKanbanBoardStore((state) => state.statistics);
  const status = useKanbanBoardStore((state) => state.status);
  const loadBoard = useKanbanBoardStore((state) => state.loadBoard);
  const refreshStatistics = useKanbanBoardStore((state) => state.refreshStatistics);

  const columns = useKanbanColumnStore((state) => state.columns);
  const loadColumns = useKanbanColumnStore((state) => state.loadColumns);

  const board = currentBoard?.id === boardId ? currentBoard : null;
  const isLoading = status === 'idle' || status === 'loading';

  useEffect(() => {
    if (!workspaceId || !boardId) {
      return;
    }
    void (async () => {
      const loaded = await loadBoard(workspaceId, boardId);
      await loadColumns(workspaceId, boardId);
      if (loaded) {
        const projectTasks = tasks.filter((task) => task.projectId === loaded.projectId);
        await refreshStatistics(workspaceId, boardId, projectTasks);
      }
    })();
  }, [workspaceId, boardId, loadBoard, loadColumns, refreshStatistics, tasks]);

  if (!workspaceId) {
    return (
      <ContentLayout title="Board overview">
        <Alert variant="warning" className="mt-24" title="No workspace selected">
          Select a workspace to view board overview.
        </Alert>
      </ContentLayout>
    );
  }

  if (isLoading && !board) {
    return (
      <ContentLayout title="Board overview">
        <div className="mt-24 flex justify-center">
          <LoadingIndicator label="Loading overview" />
        </div>
      </ContentLayout>
    );
  }

  if (!board) {
    return (
      <ContentLayout title="Board overview">
        <EmptyState
          className="mt-24"
          title="Board not found"
          description="This board may have been deleted or you no longer have access."
          action={
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => {
                navigate(KANBAN_ROUTES.list);
              }}
            >
              Back to boards
            </Button>
          }
        />
      </ContentLayout>
    );
  }

  const columnNames = Object.fromEntries(columns.map((column) => [column.id, column.name]));

  return (
    <ContentLayout
      title={board.name}
      description={`Overview for ${board.projectName}`}
      actions={
        <Inline gap={8}>
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={() => {
              navigate(kanbanBoardPath(board.id));
            }}
          >
            Open board
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={() => {
              navigate(kanbanSettingsPath(board.id));
            }}
          >
            Settings
          </Button>
        </Inline>
      }
    >
      <Stack gap={24} className="mt-24">
        {statistics ? (
          <KanbanStatistics statistics={statistics} columnNames={columnNames} />
        ) : (
          <Alert variant="info" title="Statistics">
            Board statistics will appear once tasks are synced to this board.
          </Alert>
        )}

        <div className="grid grid-cols-1 gap-16 md:grid-cols-2 xl:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Workflow</CardTitle>
            </CardHeader>
            <CardContent>
              <Text as="p" variant="body-sm" muted>
                {columns.length} active columns · template {board.templateId}
              </Text>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Project health</CardTitle>
            </CardHeader>
            <CardContent>
              <Text as="p" variant="body-sm" muted>
                Project health signals will connect in a later phase.
              </Text>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Throughput</CardTitle>
            </CardHeader>
            <CardContent>
              <Text as="p" variant="body-sm" muted>
                Throughput and cycle-time charts are placeholders for Phase 10.
              </Text>
            </CardContent>
          </Card>
        </div>
      </Stack>
    </ContentLayout>
  );
};
