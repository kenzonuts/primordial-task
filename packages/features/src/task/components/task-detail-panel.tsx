import type { ReactElement, ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ArchiveConfirmation, DeleteConfirmation, TaskDetail } from '@features/task/components';
import { useTaskContext } from '@features/task/context/task-context';
import {
  useTaskChecklistStore,
  useTaskCommentStore,
  useTaskDependencyStore,
  useTaskDetailStore,
  useTaskStore,
} from '@features/task/store';
import { TASK_ROUTES, taskDetailPath, taskEditPath, taskHistoryPath } from '@features/task/types';
import { EmptyState } from '@shared/ui/composites/empty-state';
import { LoadingIndicator } from '@shared/ui/composites/loading-indicator';
import { Alert } from '@shared/ui/feedback/alert';
import { toast } from '@shared/ui/feedback/toast';
import { Inline } from '@shared/ui/layout/inline';
import { cn } from '@shared/ui/lib/cn';
import { Button } from '@shared/ui/primitives/button';
import { Text } from '@shared/ui/typography/text';

type TaskDetailPanelProps = {
  /** Explicit task id. When omitted, the panel shows an empty prompt. */
  readonly taskId: string | null;
  readonly onClose?: () => void;
  readonly onDeleted?: () => void;
  readonly compact?: boolean;
  readonly className?: string;
  readonly emptyTitle?: string;
  readonly emptyDescription?: string;
  readonly actions?: ReactNode;
};

/**
 * Store-backed Task Detail surface for shell utility panel and Kanban side panel.
 * Reuses Phase 9 TaskDetail; does not duplicate detail sections.
 */
export const TaskDetailPanel = ({
  taskId,
  onClose,
  onDeleted,
  compact = false,
  className,
  emptyTitle = 'No task selected',
  emptyDescription = 'Select a task to inspect its details.',
  actions,
}: TaskDetailPanelProps): ReactElement => {
  const navigate = useNavigate();
  const { workspaceId } = useTaskContext();

  const currentTask = useTaskDetailStore((state) => state.currentTask);
  const detailStatus = useTaskDetailStore((state) => state.status);
  const subtasks = useTaskDetailStore((state) => state.subtasks);
  const attachments = useTaskDetailStore((state) => state.attachments);
  const activity = useTaskDetailStore((state) => state.activity);
  const loadTask = useTaskDetailStore((state) => state.loadTask);
  const deleteAttachment = useTaskDetailStore((state) => state.deleteAttachment);
  const clearDetail = useTaskDetailStore((state) => state.clear);

  const checklist = useTaskChecklistStore((state) => state.items);
  const loadChecklist = useTaskChecklistStore((state) => state.loadChecklist);
  const addChecklistItem = useTaskChecklistStore((state) => state.addItem);
  const updateChecklistItem = useTaskChecklistStore((state) => state.updateItem);
  const deleteChecklistItem = useTaskChecklistStore((state) => state.deleteItem);
  const reorderChecklist = useTaskChecklistStore((state) => state.reorder);
  const clearChecklist = useTaskChecklistStore((state) => state.clear);

  const comments = useTaskCommentStore((state) => state.comments);
  const loadComments = useTaskCommentStore((state) => state.loadComments);
  const addComment = useTaskCommentStore((state) => state.addComment);
  const clearComments = useTaskCommentStore((state) => state.clear);

  const dependencies = useTaskDependencyStore((state) => state.dependencies);
  const loadDependencies = useTaskDependencyStore((state) => state.loadDependencies);
  const clearDependencies = useTaskDependencyStore((state) => state.clear);

  const archiveTask = useTaskStore((state) => state.archiveTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);

  const [busy, setBusy] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    if (!workspaceId || !taskId) {
      clearDetail();
      clearChecklist();
      clearComments();
      clearDependencies();
      return;
    }

    void (async () => {
      await loadTask(workspaceId, taskId);
      await Promise.all([
        loadChecklist(workspaceId, taskId),
        loadComments(workspaceId, taskId),
        loadDependencies(workspaceId, taskId),
      ]);
    })();

    return () => {
      clearDetail();
      clearChecklist();
      clearComments();
      clearDependencies();
    };
  }, [
    workspaceId,
    taskId,
    loadTask,
    loadChecklist,
    loadComments,
    loadDependencies,
    clearDetail,
    clearChecklist,
    clearComments,
    clearDependencies,
  ]);

  if (!taskId) {
    return (
      <div className={cn('p-16', className)}>
        <EmptyState title={emptyTitle} description={emptyDescription} />
      </div>
    );
  }

  if (!workspaceId) {
    return (
      <div className={cn('p-16', className)}>
        <Alert variant="warning" title="No workspace selected">
          Select a workspace to open tasks.
        </Alert>
      </div>
    );
  }

  const task = currentTask?.id === taskId ? currentTask : null;
  const isLoading = detailStatus === 'idle' || detailStatus === 'loading';

  if (isLoading && !task) {
    return (
      <div className={cn('flex justify-center p-24', className)}>
        <LoadingIndicator label="Loading task" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className={cn('p-16', className)}>
        <EmptyState
          title="Task not found"
          description="This task may have been deleted or you no longer have access."
          action={
            onClose ? (
              <Button type="button" variant="secondary" size="sm" onClick={onClose}>
                Close
              </Button>
            ) : undefined
          }
        />
      </div>
    );
  }

  const moveChecklist = async (itemId: string, direction: -1 | 1): Promise<void> => {
    const ordered = [...checklist].sort((a, b) => a.orderIndex - b.orderIndex);
    const index = ordered.findIndex((item) => item.id === itemId);
    const swapIndex = index + direction;
    if (index < 0 || swapIndex < 0 || swapIndex >= ordered.length) {
      return;
    }
    const next = [...ordered];
    const temp = next[index]!;
    next[index] = next[swapIndex]!;
    next[swapIndex] = temp;
    await reorderChecklist(
      workspaceId,
      task.id,
      next.map((item) => item.id),
    );
  };

  const runAction = async (action: () => Promise<unknown>, success: string): Promise<void> => {
    setBusy(true);
    try {
      await action();
      toast.success(success);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Action failed.');
    } finally {
      setBusy(false);
    }
  };

  const defaultActions = (
    <Inline gap={8} className="flex-wrap">
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => {
          navigate(taskEditPath(task.id));
        }}
      >
        Edit
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => {
          navigate(taskHistoryPath(task.id));
        }}
      >
        History
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => {
          navigate(taskDetailPath(task.id));
        }}
      >
        Open
      </Button>
      {!task.archivedAt ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          loading={busy}
          onClick={() => {
            setArchiveOpen(true);
          }}
        >
          Archive
        </Button>
      ) : null}
      <Button
        type="button"
        variant="destructive"
        size="sm"
        loading={busy}
        onClick={() => {
          setDeleteOpen(true);
        }}
      >
        Delete
      </Button>
      {onClose ? (
        <Button type="button" variant="ghost" size="sm" onClick={onClose}>
          Close
        </Button>
      ) : null}
    </Inline>
  );

  return (
    <div className={cn('flex h-full min-h-0 flex-col', className)}>
      {task.archivedAt ? (
        <Alert variant="warning" className="mb-12 shrink-0" title="Archived">
          This task is archived.
        </Alert>
      ) : null}

      {compact ? (
        <Text as="p" variant="caption" muted className="mb-8 shrink-0">
          Task details
        </Text>
      ) : null}

      <div className="min-h-0 flex-1 overflow-auto pr-4">
        <TaskDetail
          task={task}
          checklist={checklist}
          comments={comments}
          attachments={attachments}
          dependencies={dependencies}
          activity={activity}
          subtasks={subtasks}
          actions={actions ?? defaultActions}
          onOpenLinked={(linkedId) => {
            navigate(taskDetailPath(linkedId));
          }}
          onChecklistAdd={(title) => {
            void addChecklistItem(workspaceId, task.id, title).catch((error: unknown) => {
              toast.error(error instanceof Error ? error.message : 'Could not add checklist item.');
            });
          }}
          onChecklistToggle={(itemId, completed) => {
            void updateChecklistItem(workspaceId, task.id, itemId, { completed }).catch(
              (error: unknown) => {
                toast.error(
                  error instanceof Error ? error.message : 'Could not update checklist item.',
                );
              },
            );
          }}
          onChecklistEdit={(itemId, title) => {
            void updateChecklistItem(workspaceId, task.id, itemId, { title }).catch(
              (error: unknown) => {
                toast.error(
                  error instanceof Error ? error.message : 'Could not update checklist item.',
                );
              },
            );
          }}
          onChecklistDelete={(itemId) => {
            void deleteChecklistItem(workspaceId, task.id, itemId).catch((error: unknown) => {
              toast.error(
                error instanceof Error ? error.message : 'Could not delete checklist item.',
              );
            });
          }}
          onChecklistMoveUp={(itemId) => {
            void moveChecklist(itemId, -1).catch((error: unknown) => {
              toast.error(error instanceof Error ? error.message : 'Could not reorder checklist.');
            });
          }}
          onChecklistMoveDown={(itemId) => {
            void moveChecklist(itemId, 1).catch((error: unknown) => {
              toast.error(error instanceof Error ? error.message : 'Could not reorder checklist.');
            });
          }}
          onCommentSubmit={(body, parentId) => {
            void addComment(workspaceId, task.id, body, parentId).catch((error: unknown) => {
              toast.error(error instanceof Error ? error.message : 'Could not add comment.');
            });
          }}
          onAttachmentUpload={() => {
            toast.success('Attachment upload is a placeholder in this phase.');
          }}
          onAttachmentPreview={() => {
            toast.success('Preview is a placeholder in this phase.');
          }}
          onAttachmentDownload={() => {
            toast.success('Download is a placeholder in this phase.');
          }}
          onAttachmentDelete={(attachmentId) => {
            void deleteAttachment(workspaceId, task.id, attachmentId).catch((error: unknown) => {
              toast.error(error instanceof Error ? error.message : 'Could not delete attachment.');
            });
          }}
        />
      </div>

      <ArchiveConfirmation
        open={archiveOpen}
        onOpenChange={setArchiveOpen}
        taskTitle={task.title}
        loading={busy}
        onConfirm={async () => {
          await runAction(() => archiveTask(workspaceId, task.id), 'Task archived');
          setArchiveOpen(false);
          await loadTask(workspaceId, task.id);
        }}
      />

      <DeleteConfirmation
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        taskTitle={task.title}
        loading={busy}
        requireTitleMatch
        onConfirm={async () => {
          setBusy(true);
          try {
            await deleteTask(workspaceId, task.id);
            toast.success('Task deleted');
            setDeleteOpen(false);
            onDeleted?.();
            onClose?.();
            if (!onDeleted && !onClose) {
              navigate(TASK_ROUTES.list, { replace: true });
            }
          } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Could not delete task.');
          } finally {
            setBusy(false);
          }
        }}
      />
    </div>
  );
};

export type { TaskDetailPanelProps };
