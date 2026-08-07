import type { ReactElement } from 'react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ContentLayout } from '@features/shell/layouts/content-layout';
import { useTaskContext } from '@features/task/context/task-context';
import { useTaskDetailStore } from '@features/task/store';
import { TASK_ROUTES, taskDetailPath } from '@features/task/types';
import { EmptyState } from '@shared/ui/composites/empty-state';
import { LoadingIndicator } from '@shared/ui/composites/loading-indicator';
import { Alert } from '@shared/ui/feedback/alert';
import { Stack } from '@shared/ui/layout/stack';
import { Button } from '@shared/ui/primitives/button';
import { Text } from '@shared/ui/typography/text';

export const TaskHistoryPage = (): ReactElement => {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { workspaceId } = useTaskContext();
  const currentTask = useTaskDetailStore((state) => state.currentTask);
  const history = useTaskDetailStore((state) => state.history);
  const status = useTaskDetailStore((state) => state.status);
  const loadTask = useTaskDetailStore((state) => state.loadTask);
  const loadHistory = useTaskDetailStore((state) => state.loadHistory);

  useEffect(() => {
    if (!workspaceId || !id) {
      return;
    }
    void (async () => {
      await loadTask(workspaceId, id);
      await loadHistory(workspaceId, id);
    })();
  }, [workspaceId, id, loadTask, loadHistory]);

  const task = currentTask?.id === id ? currentTask : null;
  const isLoading = status === 'idle' || status === 'loading';

  if (!workspaceId) {
    return (
      <ContentLayout title="Task history">
        <Alert variant="warning" className="mt-24" title="No workspace selected">
          Select a workspace to view task history.
        </Alert>
      </ContentLayout>
    );
  }

  if (isLoading && !task) {
    return (
      <ContentLayout title="Task history">
        <div className="mt-24 flex justify-center">
          <LoadingIndicator label="Loading history" />
        </div>
      </ContentLayout>
    );
  }

  if (!task) {
    return (
      <ContentLayout title="Task history">
        <EmptyState
          className="mt-24"
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
      </ContentLayout>
    );
  }

  return (
    <ContentLayout
      title={`History · ${task.title}`}
      description="Field-level changes for this task."
      actions={
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={() => {
            navigate(taskDetailPath(task.id));
          }}
        >
          Back to task
        </Button>
      }
    >
      <Stack gap={16} className="mt-24">
        {history.length === 0 ? (
          <Text as="p" variant="body-md" muted>
            No history recorded yet.
          </Text>
        ) : (
          <ol aria-label="Task history" className="flex flex-col gap-0">
            {history.map((item, index) => {
              const isLast = index === history.length - 1;
              return (
                <li key={item.id} className="relative flex gap-12 pb-16 last:pb-0">
                  <div className="relative flex w-3 shrink-0 justify-center" aria-hidden="true">
                    <span className="mt-1.5 size-2 rounded-full bg-border-strong" />
                    {!isLast ? (
                      <span className="absolute top-4 bottom-0 w-px bg-border-subtle" />
                    ) : null}
                  </div>
                  <Stack gap={2} className="min-w-0 flex-1">
                    <Text as="p" variant="body-sm">
                      <span className="font-medium text-text-primary">{item.actor}</span>{' '}
                      <span className="text-text-secondary">changed</span>{' '}
                      <span className="font-medium text-text-primary">{item.field}</span>
                    </Text>
                    <Text as="p" variant="caption" muted>
                      {item.fromValue || '—'} → {item.toValue || '—'}
                    </Text>
                    <Text as="span" variant="caption" muted>
                      {item.timestampLabel}
                    </Text>
                  </Stack>
                </li>
              );
            })}
          </ol>
        )}
      </Stack>
    </ContentLayout>
  );
};
