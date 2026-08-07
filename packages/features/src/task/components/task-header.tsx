import type { ReactElement, ReactNode } from 'react';

import { TaskPriorityBadge } from '@features/task/components/task-priority-badge';
import { TaskStatusBadge } from '@features/task/components/task-status-badge';
import { TaskTypeBadge } from '@features/task/components/task-type-badge';
import type { Task } from '@features/task/types';
import { Inline } from '@shared/ui/layout/inline';
import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import { Heading } from '@shared/ui/typography/heading';
import { Text } from '@shared/ui/typography/text';

type TaskHeaderProps = {
  readonly task: Pick<
    Task,
    'title' | 'description' | 'status' | 'priority' | 'type' | 'projectName'
  >;
  readonly actions?: ReactNode;
  readonly className?: string;
};

export const TaskHeader = ({ task, actions, className }: TaskHeaderProps): ReactElement => {
  return (
    <div
      className={cn(
        'w-full rounded-lg border border-border-default bg-surface-card px-4 py-4 sm:px-6',
        className,
      )}
    >
      <Inline gap={16} align="start" justify="between" className="w-full">
        <Stack gap={8} className="min-w-0 flex-1">
          <Text as="span" variant="caption" muted>
            {task.projectName}
          </Text>
          <Inline gap={8} align="center" className="min-w-0 flex-wrap">
            <Heading level={1} className="truncate">
              {task.title}
            </Heading>
            <TaskStatusBadge status={task.status} size="md" />
            <TaskPriorityBadge priority={task.priority} size="md" />
            <TaskTypeBadge type={task.type} size="md" />
          </Inline>
          {task.description ? (
            <Text as="p" variant="body-md" muted className="max-w-[720px]">
              {task.description}
            </Text>
          ) : null}
        </Stack>
        {actions ? (
          <Inline gap={8} align="center" className="shrink-0">
            {actions}
          </Inline>
        ) : null}
      </Inline>
    </div>
  );
};

export type { TaskHeaderProps };
