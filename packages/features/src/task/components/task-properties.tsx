import type { ReactElement } from 'react';

import { TaskPriorityBadge } from '@features/task/components/task-priority-badge';
import { TaskStatusBadge } from '@features/task/components/task-status-badge';
import { TaskTypeBadge } from '@features/task/components/task-type-badge';
import { formatTaskDueDate } from '@features/task/services/task-service';
import type { Task } from '@features/task/types';
import { Inline } from '@shared/ui/layout/inline';
import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import { Avatar, AvatarFallback, AvatarImage } from '@shared/ui/primitives/avatar';
import { Text } from '@shared/ui/typography/text';

type TaskPropertiesProps = {
  readonly task: Pick<
    Task,
    | 'status'
    | 'priority'
    | 'type'
    | 'projectName'
    | 'assignee'
    | 'reporter'
    | 'startDate'
    | 'dueDate'
    | 'completedDate'
    | 'estimatedMinutes'
    | 'actualMinutes'
  >;
  readonly className?: string;
};

const personInitials = (fullName: string): string => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return '?';
  }
  if (parts.length === 1) {
    return parts[0]!.slice(0, 2).toUpperCase();
  }
  return `${parts[0]![0] ?? ''}${parts[1]![0] ?? ''}`.toUpperCase();
};

const formatMinutes = (minutes: number | null): string => {
  if (minutes == null) {
    return '—';
  }
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const rem = minutes % 60;
  return rem === 0 ? `${hours}h` : `${hours}h ${rem}m`;
};

const PropertyRow = ({
  label,
  children,
}: {
  readonly label: string;
  readonly children: ReactElement | string;
}): ReactElement => {
  return (
    <div className="grid grid-cols-[120px_minmax(0,1fr)] items-center gap-12 py-2">
      <Text as="dt" variant="caption" muted>
        {label}
      </Text>
      <dd className="min-w-0">{children}</dd>
    </div>
  );
};

export const TaskProperties = ({ task, className }: TaskPropertiesProps): ReactElement => {
  return (
    <dl
      aria-label="Task properties"
      className={cn(
        'divide-y divide-border-subtle rounded-lg border border-border-subtle px-3',
        className,
      )}
    >
      <PropertyRow label="Status">
        <TaskStatusBadge status={task.status} />
      </PropertyRow>
      <PropertyRow label="Priority">
        <TaskPriorityBadge priority={task.priority} />
      </PropertyRow>
      <PropertyRow label="Type">
        <TaskTypeBadge type={task.type} />
      </PropertyRow>
      <PropertyRow label="Project">
        <Text as="span" variant="body-sm">
          {task.projectName}
        </Text>
      </PropertyRow>
      <PropertyRow label="Assignee">
        {task.assignee ? (
          <Inline gap={8} align="center">
            <Avatar size="xs">
              {task.assignee.avatarUrl ? (
                <AvatarImage src={task.assignee.avatarUrl} alt="" />
              ) : null}
              <AvatarFallback initials={personInitials(task.assignee.fullName)} />
            </Avatar>
            <Text as="span" variant="body-sm" truncate>
              {task.assignee.fullName}
            </Text>
          </Inline>
        ) : (
          <Text as="span" variant="body-sm" muted>
            Unassigned
          </Text>
        )}
      </PropertyRow>
      <PropertyRow label="Reporter">
        <Inline gap={8} align="center">
          <Avatar size="xs">
            {task.reporter.avatarUrl ? <AvatarImage src={task.reporter.avatarUrl} alt="" /> : null}
            <AvatarFallback initials={personInitials(task.reporter.fullName)} />
          </Avatar>
          <Text as="span" variant="body-sm" truncate>
            {task.reporter.fullName}
          </Text>
        </Inline>
      </PropertyRow>
      <PropertyRow label="Start">
        <Text as="span" variant="body-sm">
          {formatTaskDueDate(task.startDate)}
        </Text>
      </PropertyRow>
      <PropertyRow label="Due">
        <Text as="span" variant="body-sm">
          {formatTaskDueDate(task.dueDate)}
        </Text>
      </PropertyRow>
      <PropertyRow label="Completed">
        <Text as="span" variant="body-sm">
          {formatTaskDueDate(task.completedDate)}
        </Text>
      </PropertyRow>
      <PropertyRow label="Estimate">
        <Stack gap={2}>
          <Text as="span" variant="body-sm">
            {formatMinutes(task.estimatedMinutes)}
          </Text>
          {task.actualMinutes != null ? (
            <Text as="span" variant="caption" muted>
              Actual {formatMinutes(task.actualMinutes)}
            </Text>
          ) : null}
        </Stack>
      </PropertyRow>
    </dl>
  );
};

export type { TaskPropertiesProps };
