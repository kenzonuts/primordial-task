import type { KeyboardEvent, MouseEvent, ReactElement } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  KanbanBoard,
  KanbanBoardHeader,
  KanbanBulkBar,
  KanbanEmptyState,
  KanbanFilter,
  KanbanSkeleton,
  KanbanStatistics,
} from '@features/kanban/components';
import { useKanbanContext } from '@features/kanban/context/kanban-context';
import {
  filterBoardTasks,
  useKanbanBoardStore,
  useKanbanColumnStore,
  useKanbanFilterStore,
  useKanbanLayoutStore,
  useKanbanPreferencesStore,
  useKanbanSearchStore,
  useKanbanSelectionStore,
} from '@features/kanban/store';
import {
  KANBAN_ROUTES,
  kanbanOverviewPath,
  kanbanSettingsPath,
  type KanbanColumn,
} from '@features/kanban/types';
import { useUtilityPanelStore } from '@features/shell/store/utility-panel-store';
import { ArchiveConfirmation, DeleteConfirmation } from '@features/task/components';
import { useTaskContext } from '@features/task/context/task-context';
import { useTaskStore } from '@features/task/store';
import type { Task, TaskPriority, TaskStatus } from '@features/task/types';
import { EmptyState } from '@shared/ui/composites/empty-state';
import { Alert } from '@shared/ui/feedback/alert';
import { toast } from '@shared/ui/feedback/toast';
import { Inline } from '@shared/ui/layout/inline';
import { Button } from '@shared/ui/primitives/button';

const isTypingTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  const tag = target.tagName;
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    target.isContentEditable ||
    Boolean(target.closest('[contenteditable="true"]'))
  );
};

const buildTasksByColumn = (
  columns: readonly KanbanColumn[],
  placements: readonly { taskId: string; columnId: string; orderIndex: number }[],
  tasks: readonly Task[],
): Record<string, Task[]> => {
  const taskMap = new Map(tasks.map((task) => [task.id, task]));
  const result: Record<string, Task[]> = {};
  for (const column of columns) {
    result[column.id] = [];
  }
  const ordered = [...placements].sort((a, b) => a.orderIndex - b.orderIndex);
  for (const placement of ordered) {
    const task = taskMap.get(placement.taskId);
    if (!task) {
      continue;
    }
    const bucket = result[placement.columnId];
    if (bucket) {
      bucket.push(task);
    }
  }
  return result;
};

export const BoardPage = (): ReactElement => {
  const { boardId = '' } = useParams();
  const navigate = useNavigate();
  const { workspaceId } = useKanbanContext();
  const { tasks, loadTasks } = useTaskContext();

  const currentBoard = useKanbanBoardStore((state) => state.currentBoard);
  const placements = useKanbanBoardStore((state) => state.placements);
  const statistics = useKanbanBoardStore((state) => state.statistics);
  const boardStatus = useKanbanBoardStore((state) => state.status);
  const boardError = useKanbanBoardStore((state) => state.error);
  const loadBoard = useKanbanBoardStore((state) => state.loadBoard);
  const refreshStatistics = useKanbanBoardStore((state) => state.refreshStatistics);
  const clearBoardError = useKanbanBoardStore((state) => state.clearError);

  const columns = useKanbanColumnStore((state) => state.columns);
  const columnStatus = useKanbanColumnStore((state) => state.status);
  const loadColumns = useKanbanColumnStore((state) => state.loadColumns);
  const toggleCollapsed = useKanbanColumnStore((state) => state.toggleCollapsed);

  const filters = useKanbanFilterStore((state) => state.filters);
  const setFilters = useKanbanFilterStore((state) => state.setFilters);
  const resetFilters = useKanbanFilterStore((state) => state.resetFilters);

  const query = useKanbanSearchStore((state) => state.query);
  const debouncedQuery = useKanbanSearchStore((state) => state.debouncedQuery);
  const setQuery = useKanbanSearchStore((state) => state.setQuery);
  const setDebouncedQuery = useKanbanSearchStore((state) => state.setDebouncedQuery);
  const clearSearch = useKanbanSearchStore((state) => state.clear);

  const selectedIds = useKanbanSelectionStore((state) => state.selectedIds);
  const selectAll = useKanbanSelectionStore((state) => state.selectAll);
  const clearSelection = useKanbanSelectionStore((state) => state.clear);
  const toggleSelection = useKanbanSelectionStore((state) => state.toggle);
  const selectRange = useKanbanSelectionStore((state) => state.selectRange);

  const preferences = useKanbanPreferencesStore((state) => state.preferences);
  const updatePreferences = useKanbanPreferencesStore((state) => state.updatePreferences);

  const focusedTaskId = useKanbanLayoutStore((state) => state.focusedTaskId);
  const showDetailPanel = useKanbanLayoutStore((state) => state.showDetailPanel);
  const openDetail = useKanbanLayoutStore((state) => state.openDetail);
  const closeDetail = useKanbanLayoutStore((state) => state.closeDetail);

  const setUtilityMode = useUtilityPanelStore((state) => state.setMode);

  const createTask = useTaskStore((state) => state.createTask);
  const bulkUpdate = useTaskStore((state) => state.bulkUpdate);
  const archiveTask = useTaskStore((state) => state.archiveTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const toggleFavorite = useTaskStore((state) => state.toggleFavorite);
  const togglePinned = useTaskStore((state) => state.togglePinned);
  const duplicateTask = useTaskStore((state) => state.duplicateTask);

  const [bulkBusy, setBulkBusy] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  const board = currentBoard?.id === boardId ? currentBoard : null;
  const isLoading =
    boardStatus === 'idle' ||
    boardStatus === 'loading' ||
    columnStatus === 'idle' ||
    columnStatus === 'loading';

  useEffect(() => {
    if (!workspaceId || !boardId) {
      return;
    }
    void (async () => {
      await loadBoard(workspaceId, boardId);
      await loadColumns(workspaceId, boardId);
      await loadTasks();
    })();
  }, [workspaceId, boardId, loadBoard, loadColumns, loadTasks]);

  const projectTasks = useMemo(() => {
    if (!board) {
      return [] as Task[];
    }
    return tasks.filter((task) => task.projectId === board.projectId);
  }, [tasks, board]);

  const visibleTasks = useMemo(
    () => filterBoardTasks(projectTasks, filters, debouncedQuery || query),
    [projectTasks, filters, debouncedQuery, query],
  );

  const visiblePlacements = useMemo(() => {
    const visibleIds = new Set(visibleTasks.map((task) => task.id));
    return placements.filter((placement) => visibleIds.has(placement.taskId));
  }, [placements, visibleTasks]);

  const tasksByColumn = useMemo(
    () => buildTasksByColumn(columns, visiblePlacements, visibleTasks),
    [columns, visiblePlacements, visibleTasks],
  );

  const orderedVisibleIds = useMemo(() => {
    const ids: string[] = [];
    for (const column of columns) {
      for (const task of tasksByColumn[column.id] ?? []) {
        ids.push(task.id);
      }
    }
    return ids;
  }, [columns, tasksByColumn]);

  const columnNames = useMemo(() => {
    const map: Record<string, string> = {};
    for (const column of columns) {
      map[column.id] = column.name;
    }
    return map;
  }, [columns]);

  useEffect(() => {
    if (!workspaceId || !boardId || !board) {
      return;
    }
    void refreshStatistics(workspaceId, boardId, visibleTasks);
  }, [workspaceId, boardId, board, visibleTasks, refreshStatistics]);

  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent): void => {
      if (isTypingTarget(event.target)) {
        return;
      }

      const meta = event.metaKey || event.ctrlKey;

      if (meta && event.key.toLowerCase() === 'f') {
        event.preventDefault();
        const input = document.getElementById('kanban-search') as HTMLInputElement | null;
        input?.focus();
        input?.select();
        return;
      }

      if (meta && event.key.toLowerCase() === 'a') {
        event.preventDefault();
        selectAll(orderedVisibleIds);
        return;
      }

      if (event.key === 'Escape') {
        if (selectedIds.size > 0) {
          clearSelection();
          return;
        }
        if (query.trim()) {
          clearSearch();
          return;
        }
        if (showDetailPanel) {
          closeDetail();
        }
        return;
      }

      if (event.key === 'Delete' || event.key === 'Backspace') {
        if (selectedIds.size > 0) {
          event.preventDefault();
          setArchiveOpen(true);
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    orderedVisibleIds,
    selectAll,
    selectedIds,
    clearSelection,
    query,
    clearSearch,
    showDetailPanel,
    closeDetail,
  ]);

  const openTaskDetail = (taskId: string): void => {
    openDetail(taskId);
    setUtilityMode('task-details');
  };

  const handleSelectTask = (taskId: string, event: MouseEvent | KeyboardEvent): void => {
    if ('shiftKey' in event && event.shiftKey) {
      selectRange(orderedVisibleIds, taskId);
      return;
    }
    const additive = ('metaKey' in event && event.metaKey) || ('ctrlKey' in event && event.ctrlKey);
    toggleSelection(taskId, additive);
  };

  const runBulk = async (action: () => Promise<unknown>, success: string): Promise<void> => {
    setBulkBusy(true);
    try {
      await action();
      toast.success(success);
      clearSelection();
      await loadTasks();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Bulk action failed.');
    } finally {
      setBulkBusy(false);
    }
  };

  if (!workspaceId) {
    return (
      <div className="p-24">
        <Alert variant="warning" title="No workspace selected">
          Select a workspace to open boards.
        </Alert>
      </div>
    );
  }

  if (isLoading && !board) {
    return <KanbanSkeleton className="p-4" />;
  }

  if (!board) {
    return (
      <div className="p-24">
        {boardError ? (
          <Alert
            variant="danger"
            title="Board could not be loaded"
            className="mb-16"
            dismissible
            onDismiss={clearBoardError}
          >
            {boardError}
          </Alert>
        ) : null}
        <EmptyState
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
      </div>
    );
  }

  const hasActiveFilters =
    query.trim().length > 0 ||
    filters.statuses.length > 0 ||
    filters.priorities.length > 0 ||
    filters.favoritesOnly ||
    filters.pinnedOnly ||
    filters.blockedOnly ||
    filters.completedOnly ||
    filters.archivedOnly;

  const emptyBoard = columns.length === 0;
  const emptyCards = !emptyBoard && visibleTasks.length === 0;

  return (
    <div className="flex h-full min-h-0 flex-col" data-kanban-board>
      <KanbanBoardHeader
        board={board}
        query={query}
        onQueryChange={setQuery}
        onDebouncedQueryChange={setDebouncedQuery}
        showStatistics={preferences.showStatistics}
        onToggleStatistics={() => {
          void updatePreferences({ showStatistics: !preferences.showStatistics });
        }}
        onOpenPreferences={() => {
          navigate(kanbanSettingsPath(board.id));
        }}
        onOpenFilters={() => {
          setShowFilters((value) => !value);
        }}
        trailingSlot={
          <Inline gap={8}>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => {
                navigate(kanbanOverviewPath(board.id));
              }}
            >
              Overview
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => {
                navigate(kanbanSettingsPath(board.id));
              }}
            >
              Settings
            </Button>
          </Inline>
        }
      />

      {showFilters ? (
        <div className="border-b border-border-subtle px-4 py-2">
          <KanbanFilter filters={filters} onChange={setFilters} onReset={resetFilters} />
        </div>
      ) : null}

      {preferences.showStatistics && statistics ? (
        <KanbanStatistics statistics={statistics} columnNames={columnNames} />
      ) : null}

      <div className="border-b border-border-subtle px-4 py-2">
        <KanbanBulkBar
          selectionCount={selectedIds.size}
          disabled={bulkBusy}
          onClearSelection={clearSelection}
          onArchive={() => {
            setArchiveOpen(true);
          }}
          onDelete={() => {
            setDeleteOpen(true);
          }}
          onPriorityChange={(priority: TaskPriority) => {
            void runBulk(
              () => bulkUpdate(workspaceId, [...selectedIds], { priority }),
              'Priority updated',
            );
          }}
          onStatusChange={(status: TaskStatus) => {
            void runBulk(
              () => bulkUpdate(workspaceId, [...selectedIds], { status }),
              'Status updated',
            );
          }}
          onPin={() => {
            void runBulk(async () => {
              for (const id of selectedIds) {
                await togglePinned(workspaceId, id);
              }
            }, 'Pin updated');
          }}
          onFavorite={() => {
            void runBulk(async () => {
              for (const id of selectedIds) {
                await toggleFavorite(workspaceId, id);
              }
            }, 'Favorite updated');
          }}
        />
      </div>

      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        {emptyBoard ? (
          <KanbanEmptyState
            className="m-auto"
            variant="no-columns"
            action={
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={() => {
                  navigate(kanbanSettingsPath(board.id));
                }}
              >
                Manage columns
              </Button>
            }
          />
        ) : null}

        {emptyCards ? (
          <KanbanEmptyState
            className="m-auto"
            variant={hasActiveFilters ? 'no-results' : 'no-tasks'}
            action={
              hasActiveFilters ? (
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={() => {
                    resetFilters();
                    clearSearch();
                  }}
                >
                  Clear filters
                </Button>
              ) : undefined
            }
          />
        ) : null}

        {!emptyBoard && !emptyCards ? (
          <KanbanBoard
            workspaceId={workspaceId}
            columns={columns}
            tasksByColumn={tasksByColumn}
            selectedIds={selectedIds}
            focusedTaskId={focusedTaskId}
            columnWidthPreset={preferences.columnWidth}
            swimlaneMode={preferences.swimlaneMode}
            onOpenTask={openTaskDetail}
            onSelectTask={handleSelectTask}
            onQuickAdd={async (columnId, title) => {
              const column = columns.find((item) => item.id === columnId);
              if (!column) {
                return;
              }
              try {
                await createTask({
                  workspaceId,
                  projectId: board.projectId,
                  title,
                  status: column.mappedStatus,
                  priority: 'medium',
                  type: 'task',
                });
                toast.success('Task created');
                await loadTasks();
                await loadBoard(workspaceId, board.id);
              } catch (error) {
                toast.error(error instanceof Error ? error.message : 'Could not create task.');
              }
            }}
            onToggleCollapse={(columnId) => {
              void toggleCollapsed(workspaceId, columnId);
            }}
            onCardEdit={openTaskDetail}
            onCardDuplicate={(taskId) => {
              void duplicateTask(workspaceId, taskId)
                .then(async () => {
                  toast.success('Task duplicated');
                  await loadTasks();
                })
                .catch((error: unknown) => {
                  toast.error(error instanceof Error ? error.message : 'Could not duplicate.');
                });
            }}
            onCardArchive={(taskId) => {
              void archiveTask(workspaceId, taskId)
                .then(async () => {
                  toast.success('Task archived');
                  await loadTasks();
                })
                .catch((error: unknown) => {
                  toast.error(error instanceof Error ? error.message : 'Could not archive.');
                });
            }}
            onCardDelete={(taskId) => {
              void deleteTask(workspaceId, taskId)
                .then(async () => {
                  toast.success('Task deleted');
                  await loadTasks();
                })
                .catch((error: unknown) => {
                  toast.error(error instanceof Error ? error.message : 'Could not delete.');
                });
            }}
            onCardCopyId={(taskId) => {
              void navigator.clipboard.writeText(taskId).then(() => {
                toast.success('Task ID copied');
              });
            }}
            onCardCopyLink={(taskId) => {
              const url = `${window.location.origin}/tasks/${taskId}`;
              void navigator.clipboard.writeText(url).then(() => {
                toast.success('Link copied');
              });
            }}
            onCardToggleFavorite={(taskId) => {
              void toggleFavorite(workspaceId, taskId).catch((error: unknown) => {
                toast.error(error instanceof Error ? error.message : 'Could not update favorite.');
              });
            }}
            onCardTogglePin={(taskId) => {
              void togglePinned(workspaceId, taskId).catch((error: unknown) => {
                toast.error(error instanceof Error ? error.message : 'Could not update pin.');
              });
            }}
            className="min-h-0 flex-1"
          />
        ) : null}
      </div>

      <ArchiveConfirmation
        open={archiveOpen}
        onOpenChange={setArchiveOpen}
        taskTitle={`${selectedIds.size} selected task${selectedIds.size === 1 ? '' : 's'}`}
        title="Archive selected tasks"
        loading={bulkBusy}
        onConfirm={async () => {
          await runBulk(async () => {
            for (const id of selectedIds) {
              await archiveTask(workspaceId, id);
            }
          }, 'Tasks archived');
          setArchiveOpen(false);
        }}
      />

      <DeleteConfirmation
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        taskTitle={`${selectedIds.size} selected`}
        loading={bulkBusy}
        requireTitleMatch={false}
        onConfirm={async () => {
          await runBulk(async () => {
            for (const id of selectedIds) {
              await deleteTask(workspaceId, id);
            }
          }, 'Tasks deleted');
          setDeleteOpen(false);
        }}
      />
    </div>
  );
};
