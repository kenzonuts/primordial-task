import { Pin, Star } from 'lucide-react';
import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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
import { Stack } from '@shared/ui/layout/stack';
import { Button } from '@shared/ui/primitives/button';

export const TaskDetailPage = (): ReactElement => {
  const { id = '' } = useParams();
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

  const toggleFavorite = useTaskStore((state) => state.toggleFavorite);
  const togglePinned = useTaskStore((state) => state.togglePinned);
  const duplicateTask = useTaskStore((state) => state.duplicateTask);
  const archiveTask = useTaskStore((state) => state.archiveTask);
  const restoreTask = useTaskStore((state) => state.restoreTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);

  const [busy, setBusy] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    if (!workspaceId || !id) {
      return;
    }
    void (async () => {
      await loadTask(workspaceId, id);
      await Promise.all([
        loadChecklist(workspaceId, id),
        loadComments(workspaceId, id),
        loadDependencies(workspaceId, id),
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
    id,
    loadTask,
    loadChecklist,
    loadComments,
    loadDependencies,
    clearDetail,
    clearChecklist,
    clearComments,
    clearDependencies,
  ]);

  const task = currentTask?.id === id ? currentTask : null;
  const isLoading = detailStatus === 'idle' || detailStatus === 'loading';

  if (!workspaceId) {
    return (
      <div className="mx-auto w-full max-w-none p-24">
        <Alert variant="warning" title="No workspace selected">
          Select a workspace to open tasks.
        </Alert>
      </div>
    );
  }

  if (isLoading && !task) {
    return (
      <div className="mx-auto flex w-full justify-center p-24">
        <LoadingIndicator label="Loading task" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="mx-auto w-full max-w-none p-24">
        <EmptyState
          title="Task not found"
          description="This task may have been deleted or you no longer have access."
          action={
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => {
                navigate(TASK_ROUTES.list);
              }}
            >
              Back to tasks
            </Button>
          }
        />
      </div>
    );
  }

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

  return (
    <div className="mx-auto w-full max-w-none p-24">
      {task.archivedAt ? (
        <Alert variant="warning" className="mb-16" title="Archived">
          This task is archived. Restore it to use it again.
        </Alert>
      ) : null}

      <Stack gap={24}>
        <TaskDetail
          task={task}
          checklist={checklist}
          comments={comments}
          attachments={attachments}
          dependencies={dependencies}
          activity={activity}
          subtasks={subtasks}
          onOpenLinked={(taskId) => {
            navigate(taskDetailPath(taskId));
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
          actions={
            <Inline gap={8} className="flex-wrap">
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={() => {
                  navigate(taskEditPath(task.id));
                }}
              >
                Edit
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={() => {
                  navigate(taskHistoryPath(task.id));
                }}
              >
                History
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="md"
                loading={busy}
                aria-pressed={task.isFavorite}
                onClick={() => {
                  void runAction(
                    () => toggleFavorite(workspaceId, task.id),
                    task.isFavorite ? 'Removed from favorites' : 'Added to favorites',
                  );
                }}
              >
                <Star aria-hidden="true" className={task.isFavorite ? 'fill-current' : undefined} />
                Favorite
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="md"
                loading={busy}
                aria-pressed={task.isPinned}
                onClick={() => {
                  void runAction(
                    () => togglePinned(workspaceId, task.id),
                    task.isPinned ? 'Unpinned' : 'Pinned',
                  );
                }}
              >
                <Pin aria-hidden="true" className={task.isPinned ? 'fill-current' : undefined} />
                Pin
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="md"
                loading={busy}
                onClick={() => {
                  void (async () => {
                    setBusy(true);
                    try {
                      const duplicate = await duplicateTask(workspaceId, task.id);
                      toast.success('Task duplicated');
                      navigate(taskDetailPath(duplicate.id));
                    } catch (error) {
                      toast.error(
                        error instanceof Error ? error.message : 'Could not duplicate task.',
                      );
                    } finally {
                      setBusy(false);
                    }
                  })();
                }}
              >
                Duplicate
              </Button>
              {task.archivedAt ? (
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  loading={busy}
                  onClick={() => {
                    void runAction(() => restoreTask(workspaceId, task.id), 'Task restored');
                  }}
                >
                  Restore
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  loading={busy}
                  onClick={() => {
                    setArchiveOpen(true);
                  }}
                >
                  Archive
                </Button>
              )}
              <Button
                type="button"
                variant="destructive"
                size="md"
                loading={busy}
                onClick={() => {
                  setDeleteOpen(true);
                }}
              >
                Delete
              </Button>
            </Inline>
          }
        />
      </Stack>

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
            navigate(TASK_ROUTES.list, { replace: true });
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
