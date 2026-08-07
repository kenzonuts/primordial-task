import type { ReactElement } from 'react';

import { formatTaskDueDate } from '@features/task/services/task-service';
import type { Task } from '@features/task/types';
import { Inline } from '@shared/ui/layout/inline';
import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import { Text } from '@shared/ui/typography/text';

type TaskTimelineProps = {
  readonly task: Pick<Task, 'startDate' | 'dueDate' | 'completedDate' | 'status'>;
  readonly className?: string;
};

type TimelinePoint = {
  readonly key: string;
  readonly label: string;
  readonly value: string;
  readonly active: boolean;
};

export const TaskTimeline = ({ task, className }: TaskTimelineProps): ReactElement => {
  const points: readonly TimelinePoint[] = [
    {
      key: 'start',
      label: 'Start',
      value: formatTaskDueDate(task.startDate),
      active: task.startDate != null,
    },
    {
      key: 'due',
      label: 'Due',
      value: formatTaskDueDate(task.dueDate),
      active: task.dueDate != null,
    },
    {
      key: 'completed',
      label: 'Completed',
      value: formatTaskDueDate(task.completedDate),
      active: task.completedDate != null || task.status === 'completed',
    },
  ];

  return (
    <div
      role="list"
      aria-label="Task timeline"
      className={cn('rounded-lg border border-border-subtle bg-surface-card px-4 py-3', className)}
    >
      <Inline gap={0} align="stretch" className="w-full">
        {points.map((point, index) => (
          <div key={point.key} role="listitem" className="relative min-w-0 flex-1">
            <Stack gap={6} align="center" className="relative z-[1]">
              <span
                aria-hidden="true"
                className={cn(
                  'size-2.5 rounded-full border-2',
                  point.active
                    ? 'border-border-strong bg-text-primary'
                    : 'border-border-default bg-surface-elevated',
                )}
              />
              <Text as="span" variant="caption" muted>
                {point.label}
              </Text>
              <Text as="span" variant="body-sm" className="text-center">
                {point.value}
              </Text>
            </Stack>
            {index < points.length - 1 ? (
              <span
                aria-hidden="true"
                className="absolute top-[5px] left-1/2 h-px w-full bg-border-subtle"
              />
            ) : null}
          </div>
        ))}
      </Inline>
    </div>
  );
};

export type { TaskTimelineProps };
