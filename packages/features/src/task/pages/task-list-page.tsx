import { Plus } from 'lucide-react';
import type { ReactElement } from 'react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ContentLayout } from '@features/shell/layouts/content-layout';
import {
  ArchiveConfirmation,
  BulkActionsBar,
  DeleteConfirmation,
  QuickCreateTask,
  TaskEmptyState,
  TaskList,
  TaskSkeleton,
  TaskTable,
  TaskToolbar,
} from '@features/task/components';
import { useTaskContext } from '@features/task/context/task-context';
import {
  buildTaskGroups,
  filterAndSortTasks,
  paginateTasks,
  taskService,
  useTaskDetailStore,
  useTaskFilterStore,
  useTaskSelectionStore,
  useTaskStore,
} from '@features/task/store';
import type {
  Task,
  TaskFilterPreset,
  TaskGroupBy,
  TaskPriority,
  TaskSortKey,
  TaskStatus,
  TaskViewMode,
} from '@features/task/types';
import { TASK_ROUTES, taskDetailPath } from '@features/task/types';
import { Alert } from '@shared/ui/feedback/alert';
import { toast } from '@shared/ui/feedback/toast';
import { Stack } from '@shared/ui/layout/stack';
import { Button } from '@shared/ui/primitives/button';
import { Text } from '@shared/ui/typography/text';

const DEFAULT_PROJECT_ID = 'proj-core';

/**
 * Builds a flat display list respecting parent/child expansion.
 * Collapsed parents hide descendants; expanded parents reveal indented children.
 * Orphans (parent missing from the current page) render as roots.
 */
const buildHierarchicalTasks = (
  tasks: readonly Task[],
  expandedIds: ReadonlySet<string>,
): Task[] => {
  const ids = new Set(tasks.map((task) => task.id));
  const byParent = new Map<string | null, Task[]>();

  for (const task of tasks) {
    const parentId =
      task.parentTaskId !== null && ids.has(task.parentTaskId) ? task.parentTaskId : null;
    const bucket = byParent.get(parentId) ?? [];
    bucket.push(task);
    byParent.set(parentId, bucket);
  }

  const result: Task[] = [];
  const visit = (parentId: string | null): void => {
    const children = byParent.get(parentId) ?? [];
    for (const child of children) {
      result.push(child);
      if (child.subtaskCount > 0 && expandedIds.has(child.id)) {
        visit(child.id);
      }
    }
  };
  visit(null);
  return result;
};

export const TaskListPage = (): ReactElement => {
  const navigate = useNavigate();
  const { workspaceId, projectId, loadTasks } = useTaskContext();
  const status = useTaskStore((state) => state.status);
  const error = useTaskStore((state) => state.error);
  const clearError = useTaskStore((state) => state.clearError);
  const tasks = useTaskStore((state) => state.tasks);
  const createTask = useTaskStore((state) => state.createTask);
  const toggleFavorite = useTaskStore((state) => state.toggleFavorite);
  const togglePinned = useTaskStore((state) => state.togglePinned);
  const bulkUpdate = useTaskStore((state) => state.bulkUpdate);

  const filters = useTaskFilterStore((state) => state.filters);
  const setFilters = useTaskFilterStore((state) => state.setFilters);

  const selectedIds = useTaskSelectionStore((state) => state.selectedIds);
  const select = useTaskSelectionStore((state) => state.select);
  const deselect = useTaskSelectionStore((state) => state.deselect);
  const selectMany = useTaskSelectionStore((state) => state.selectMany);
  const clearSelection = useTaskSelectionStore((state) => state.clear);

  const expandedIds = useTaskDetailStore((state) => state.expandedIds);
  const toggleExpanded = useTaskDetailStore((state) => state.toggleExpanded);

  const [quickBusy, setQuickBusy] = useState(false);
  const [bulkBusy, setBulkBusy] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const filtered = useMemo(() => filterAndSortTasks(tasks, filters), [tasks, filters]);
  const page = useMemo(
    () => paginateTasks(filtered, filters.page, filters.pageSize),
    [filtered, filters.page, filters.pageSize],
  );
  const hierarchical = useMemo(
    () => buildHierarchicalTasks(page.items, expandedIds),
    [page.items, expandedIds],
  );
  const groups = useMemo(
    () => buildTaskGroups(hierarchical, filters.groupBy),
    [hierarchical, filters.groupBy],
  );

  const selectionCount = selectedIds.size;
  const isLoading = status === 'idle' || status === 'loading';
  const hasActiveFilters =
    filters.query.trim().length > 0 ||
    filters.preset !== 'all' ||
    filters.statuses.length > 0 ||
    filters.priorities.length > 0;

  let emptyVariant: 'none' | 'no-results' | 'archived' = 'none';
  if (filters.preset === 'archived') {
    emptyVariant = 'archived';
  } else if (hasActiveFilters || tasks.length > 0) {
    emptyVariant = 'no-results';
  }

  const createAction = (
    <Button
      type="button"
      variant="primary"
      size="md"
      onClick={() => {
        navigate(TASK_ROUTES.create);
      }}
    >
      <Plus aria-hidden="true" />
      Create task
    </Button>
  );

  const handleOpen = (taskId: string): void => {
    navigate(taskDetailPath(taskId));
  };

  const handleSelectChange = (taskId: string, selected: boolean): void => {
    if (selected) {
      select(taskId);
    } else {
      deselect(taskId);
    }
  };

  const handleSelectAll = (selected: boolean): void => {
    if (selected) {
      selectMany(hierarchical.map((task) => task.id));
    } else {
      clearSelection();
    }
  };

  const handleToggleFavorite = (taskId: string): void => {
    if (!workspaceId) {
      return;
    }
    void toggleFavorite(workspaceId, taskId).catch((err: unknown) => {
      toast.error(err instanceof Error ? err.message : 'Could not update favorite.');
    });
  };

  const handleTogglePinned = (taskId: string): void => {
    if (!workspaceId) {
      return;
    }
    void togglePinned(workspaceId, taskId).catch((err: unknown) => {
      toast.error(err instanceof Error ? err.message : 'Could not update pin.');
    });
  };

  const handleQuickCreate = async (title: string): Promise<void> => {
    if (!workspaceId) {
      toast.error('Select a workspace before creating a task.');
      return;
    }
    setQuickBusy(true);
    try {
      const projects = await taskService.listProjects();
      const preferred =
        projects.find((item) => item.id === projectId)?.id ?? projects[0]?.id ?? DEFAULT_PROJECT_ID;
      const task = await createTask({
        workspaceId,
        projectId: preferred,
        title,
      });
      toast.success('Task created');
      navigate(taskDetailPath(task.id));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not create task.');
    } finally {
      setQuickBusy(false);
    }
  };

  const runBulk = async (action: () => Promise<void>, success: string): Promise<void> => {
    if (!workspaceId || selectedIds.size === 0) {
      return;
    }
    setBulkBusy(true);
    try {
      await action();
      toast.success(success);
      clearSelection();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Bulk action failed.');
    } finally {
      setBulkBusy(false);
    }
  };

  const listHandlers = {
    onOpen: handleOpen,
    onSelectChange: handleSelectChange,
    onToggleExpand: toggleExpanded,
    onToggleFavorite: handleToggleFavorite,
    onTogglePinned: handleTogglePinned,
  };

  return (
    <ContentLayout
      title="Tasks"
      description="Track and organize work across projects in the active workspace."
      actions={createAction}
    >
      <Stack gap={24} className="mt-24">
        <TaskToolbar
          query={filters.query}
          onQueryChange={(query) => {
            setFilters({ query });
          }}
          sort={filters.sort}
          onSortChange={(sort: TaskSortKey) => {
            setFilters({ sort });
          }}
          preset={filters.preset}
          onPresetChange={(preset: TaskFilterPreset) => {
            setFilters({ preset });
          }}
          view={filters.view}
          onViewChange={(view: TaskViewMode) => {
            setFilters({ view });
          }}
          groupBy={filters.groupBy}
          onGroupByChange={(groupBy: TaskGroupBy) => {
            setFilters({ groupBy });
          }}
          statuses={filters.statuses}
          onStatusesChange={(statuses: readonly TaskStatus[]) => {
            setFilters({ statuses });
          }}
          priorities={filters.priorities}
          onPrioritiesChange={(priorities: readonly TaskPriority[]) => {
            setFilters({ priorities });
          }}
          selectionCount={selectionCount}
          createAction={createAction}
          quickCreateSlot={
            <QuickCreateTask
              onCreate={handleQuickCreate}
              disabled={isLoading || !workspaceId}
              loading={quickBusy}
            />
          }
          bulkActionsSlot={
            <BulkActionsBar
              selectionCount={selectionCount}
              disabled={bulkBusy || !workspaceId}
              onClearSelection={clearSelection}
              onStatusChange={(nextStatus) => {
                void runBulk(
                  () => bulkUpdate(workspaceId!, [...selectedIds], { status: nextStatus }),
                  'Status updated',
                );
              }}
              onPriorityChange={(priority) => {
                void runBulk(
                  () => bulkUpdate(workspaceId!, [...selectedIds], { priority }),
                  'Priority updated',
                );
              }}
              onArchive={() => {
                setArchiveOpen(true);
              }}
              onDelete={() => {
                setDeleteOpen(true);
              }}
              onAssign={() => {
                toast.info('Bulk assign will be available in a later phase.');
              }}
              onMove={() => {
                toast.info('Bulk move will be available in a later phase.');
              }}
            />
          }
          disabled={isLoading || !workspaceId}
        />

        {status === 'error' && error ? (
          <Alert
            variant="danger"
            title="Tasks could not be loaded."
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
                  void loadTasks();
                }}
              >
                Try again
              </Button>
            </Stack>
          </Alert>
        ) : null}

        {!workspaceId ? (
          <Alert variant="warning" title="No workspace selected">
            Select a workspace to view its tasks.
          </Alert>
        ) : null}

        {isLoading ? (
          <TaskSkeleton
            variant={filters.view === 'table' ? 'table' : 'list'}
            count={filters.view === 'table' ? 8 : 6}
          />
        ) : null}

        {!isLoading && status === 'ready' && hierarchical.length === 0 ? (
          <TaskEmptyState
            variant={emptyVariant}
            action={emptyVariant === 'none' ? createAction : undefined}
          />
        ) : null}

        {!isLoading && status === 'ready' && hierarchical.length > 0 ? (
          filters.view === 'table' ? (
            <TaskTable
              tasks={hierarchical}
              selectedIds={selectedIds}
              onOpen={handleOpen}
              onSelectChange={handleSelectChange}
              onSelectAllChange={handleSelectAll}
              onToggleFavorite={handleToggleFavorite}
              onTogglePinned={handleTogglePinned}
            />
          ) : filters.view === 'grouped' ? (
            <Stack gap={20}>
              {groups.map((group) => (
                <Stack key={group.key} gap={8}>
                  <Text as="h2" variant="h3">
                    {group.label}
                    <Text as="span" variant="caption" muted className="ml-8">
                      {group.tasks.length}
                    </Text>
                  </Text>
                  <TaskList
                    tasks={group.tasks}
                    selectedIds={selectedIds}
                    expandedIds={expandedIds}
                    {...listHandlers}
                  />
                </Stack>
              ))}
            </Stack>
          ) : (
            <TaskList
              tasks={hierarchical}
              selectedIds={selectedIds}
              expandedIds={expandedIds}
              {...listHandlers}
            />
          )
        ) : null}
      </Stack>

      <ArchiveConfirmation
        open={archiveOpen}
        onOpenChange={setArchiveOpen}
        taskTitle={`${selectionCount} selected task${selectionCount === 1 ? '' : 's'}`}
        loading={bulkBusy}
        onConfirm={async () => {
          await runBulk(
            () => bulkUpdate(workspaceId!, [...selectedIds], { archive: true }),
            'Tasks archived',
          );
          setArchiveOpen(false);
        }}
      />

      <DeleteConfirmation
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        taskTitle={`${selectionCount} selected task${selectionCount === 1 ? '' : 's'}`}
        loading={bulkBusy}
        onConfirm={async () => {
          await runBulk(
            () => bulkUpdate(workspaceId!, [...selectedIds], { delete: true }),
            'Tasks deleted',
          );
          setDeleteOpen(false);
        }}
      />
    </ContentLayout>
  );
};
