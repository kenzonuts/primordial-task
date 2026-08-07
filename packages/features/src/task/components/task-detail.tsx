import type { ReactElement, ReactNode } from 'react';

import { TaskActivity } from '@features/task/components/task-activity';
import { TaskAttachment } from '@features/task/components/task-attachment';
import { TaskChecklist } from '@features/task/components/task-checklist';
import { TaskComment } from '@features/task/components/task-comment';
import { TaskHeader } from '@features/task/components/task-header';
import { TaskProperties } from '@features/task/components/task-properties';
import { TaskTimeline } from '@features/task/components/task-timeline';
import { TASK_DEPENDENCY_LABELS } from '@features/task/constants';
import type {
  Task,
  TaskActivityItem,
  TaskAttachment as TaskAttachmentModel,
  TaskChecklistItem,
  TaskComment as TaskCommentModel,
  TaskDependency,
} from '@features/task/types';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/composites/card';
import { Inline } from '@shared/ui/layout/inline';
import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import { Badge } from '@shared/ui/primitives/badge';
import { Text } from '@shared/ui/typography/text';

type TaskDetailProps = {
  readonly task: Task;
  readonly checklist?: readonly TaskChecklistItem[];
  readonly comments?: readonly TaskCommentModel[];
  readonly attachments?: readonly TaskAttachmentModel[];
  readonly dependencies?: readonly TaskDependency[];
  readonly activity?: readonly TaskActivityItem[];
  readonly linkedTasks?: readonly Pick<Task, 'id' | 'title' | 'status'>[];
  readonly subtasks?: readonly Pick<
    Task,
    'id' | 'title' | 'status' | 'subtaskCompleted' | 'subtaskCount'
  >[];
  readonly actions?: ReactNode;
  readonly onOpenLinked?: (taskId: string) => void;
  readonly onChecklistAdd?: (title: string) => void;
  readonly onChecklistToggle?: (itemId: string, completed: boolean) => void;
  readonly onChecklistEdit?: (itemId: string, title: string) => void;
  readonly onChecklistDelete?: (itemId: string) => void;
  readonly onChecklistMoveUp?: (itemId: string) => void;
  readonly onChecklistMoveDown?: (itemId: string) => void;
  readonly onCommentSubmit?: (body: string, parentId?: string | null) => void;
  readonly onAttachmentUpload?: (files: FileList) => void;
  readonly onAttachmentPreview?: (attachmentId: string) => void;
  readonly onAttachmentDownload?: (attachmentId: string) => void;
  readonly onAttachmentDelete?: (attachmentId: string) => void;
  readonly className?: string;
};

export const TaskDetail = ({
  task,
  checklist = [],
  comments = [],
  attachments = [],
  dependencies = [],
  activity = [],
  linkedTasks = [],
  subtasks = [],
  actions,
  onOpenLinked,
  onChecklistAdd,
  onChecklistToggle,
  onChecklistEdit,
  onChecklistDelete,
  onChecklistMoveUp,
  onChecklistMoveDown,
  onCommentSubmit,
  onAttachmentUpload,
  onAttachmentPreview,
  onAttachmentDownload,
  onAttachmentDelete,
  className,
}: TaskDetailProps): ReactElement => {
  return (
    <Stack gap={24} className={cn('w-full', className)}>
      <TaskHeader task={task} actions={actions} />
      <TaskTimeline task={task} />

      <div className="grid grid-cols-1 gap-16 xl:grid-cols-3">
        <Stack gap={16} className="xl:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <TaskProperties task={task} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Time tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <Text as="p" variant="caption" muted>
                Time tracking controls will appear here.
              </Text>
              <Text as="p" variant="caption" muted className="mt-2">
                Estimate and actual minutes are shown in properties.
              </Text>
            </CardContent>
          </Card>
        </Stack>

        <Stack gap={16} className="xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <TaskChecklist
                items={checklist}
                onAdd={onChecklistAdd}
                onToggle={onChecklistToggle}
                onEdit={onChecklistEdit}
                onDelete={onChecklistDelete}
                onMoveUp={onChecklistMoveUp}
                onMoveDown={onChecklistMoveDown}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Comments</CardTitle>
            </CardHeader>
            <CardContent>
              <TaskComment comments={comments} onSubmit={onCommentSubmit} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Attachments</CardTitle>
            </CardHeader>
            <CardContent>
              <TaskAttachment
                attachments={attachments}
                onUpload={onAttachmentUpload}
                onPreview={onAttachmentPreview}
                onDownload={onAttachmentDownload}
                onDelete={onAttachmentDelete}
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Dependencies</CardTitle>
              </CardHeader>
              <CardContent>
                {dependencies.length === 0 ? (
                  <Text as="p" variant="caption" muted>
                    No dependencies linked.
                  </Text>
                ) : (
                  <Stack gap={8} role="list" aria-label="Dependencies">
                    {dependencies.map((dependency) => (
                      <Inline
                        key={dependency.id}
                        gap={8}
                        align="center"
                        justify="between"
                        role="listitem"
                        className="w-full"
                      >
                        <Stack gap={2} className="min-w-0">
                          <Text as="span" variant="body-sm" truncate className="font-medium">
                            {dependency.relatedTitle}
                          </Text>
                          <Text as="span" variant="caption" muted>
                            {TASK_DEPENDENCY_LABELS[dependency.type]}
                          </Text>
                        </Stack>
                        <Badge variant="neutral" size="sm">
                          {TASK_DEPENDENCY_LABELS[dependency.type]}
                        </Badge>
                      </Inline>
                    ))}
                  </Stack>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Subtasks</CardTitle>
              </CardHeader>
              <CardContent>
                {subtasks.length === 0 ? (
                  <Text as="p" variant="caption" muted>
                    No subtasks yet.
                  </Text>
                ) : (
                  <Stack gap={8} role="list" aria-label="Subtasks">
                    {subtasks.map((subtask) => (
                      <button
                        key={subtask.id}
                        type="button"
                        role="listitem"
                        className={cn(
                          'flex w-full items-center justify-between gap-8 rounded-md px-2 py-1.5 text-left',
                          'outline-none ds-transition-fast hover:bg-state-hover focus-visible:ds-focus-ring',
                        )}
                        onClick={() => onOpenLinked?.(subtask.id)}
                      >
                        <Text as="span" variant="body-sm" truncate className="font-medium">
                          {subtask.title}
                        </Text>
                        <Badge variant="neutral" size="sm">
                          {subtask.status}
                        </Badge>
                      </button>
                    ))}
                  </Stack>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Linked tasks</CardTitle>
            </CardHeader>
            <CardContent>
              {linkedTasks.length === 0 ? (
                <Text as="p" variant="caption" muted>
                  Linked tasks will appear here.
                </Text>
              ) : (
                <Stack gap={8} role="list" aria-label="Linked tasks">
                  {linkedTasks.map((linked) => (
                    <button
                      key={linked.id}
                      type="button"
                      role="listitem"
                      className={cn(
                        'flex w-full items-center justify-between gap-8 rounded-md px-2 py-1.5 text-left',
                        'outline-none ds-transition-fast hover:bg-state-hover focus-visible:ds-focus-ring',
                      )}
                      onClick={() => onOpenLinked?.(linked.id)}
                    >
                      <Text as="span" variant="body-sm" truncate className="font-medium">
                        {linked.title}
                      </Text>
                      <Badge variant="neutral" size="sm">
                        {linked.status}
                      </Badge>
                    </button>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <TaskActivity items={activity} />
            </CardContent>
          </Card>
        </Stack>
      </div>
    </Stack>
  );
};

export type { TaskDetailProps };
