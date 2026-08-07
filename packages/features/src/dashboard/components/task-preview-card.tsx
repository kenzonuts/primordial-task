import { useState, type ReactElement } from 'react';

import type { DashboardTaskPreview } from '@features/dashboard/types';
import { Inline } from '@shared/ui/layout/inline';
import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import { Avatar, AvatarFallback } from '@shared/ui/primitives/avatar';
import { Badge } from '@shared/ui/primitives/badge';
import { Checkbox } from '@shared/ui/primitives/checkbox';
import { Text } from '@shared/ui/typography/text';

type TaskPreviewCardProps = {
  readonly task: DashboardTaskPreview;
  readonly dense?: boolean;
  readonly onOpen?: (taskId: string) => void;
  readonly className?: string;
};

const priorityBadgeVariant = (
  priority: DashboardTaskPreview['priority'],
): 'neutral' | 'warning' | 'danger' => {
  if (priority === 'urgent') {
    return 'danger';
  }
  if (priority === 'high') {
    return 'warning';
  }
  return 'neutral';
};

const priorityLabel = (priority: DashboardTaskPreview['priority']): string => {
  switch (priority) {
    case 'urgent':
      return 'Urgent';
    case 'high':
      return 'High';
    case 'medium':
      return 'Medium';
    case 'low':
      return 'Low';
    default:
      return priority;
  }
};

export const TaskPreviewCard = ({
  task,
  dense = false,
  onOpen,
  className,
}: TaskPreviewCardProps): ReactElement => {
  const [completed, setCompleted] = useState(Boolean(task.completed ?? task.status === 'done'));
  const isOverdue = typeof task.daysOverdue === 'number' && task.daysOverdue > 0;
  const showPriorityTone = task.priority === 'high' || task.priority === 'urgent' || isOverdue;

  return (
    <div
      className={cn(
        'group flex w-full items-start gap-2 rounded-md outline-none ds-transition-fast',
        dense ? 'px-1 py-1.5' : 'px-1.5 py-2',
        onOpen && 'cursor-pointer hover:bg-state-hover',
        completed && 'opacity-70',
        className,
      )}
      onClick={
        onOpen
          ? () => {
              onOpen(task.id);
            }
          : undefined
      }
    >
      <Checkbox
        checked={completed}
        aria-label={`Mark ${task.title} complete`}
        onCheckedChange={(value) => {
          setCompleted(value === true);
        }}
        onClick={(event) => {
          event.stopPropagation();
        }}
        className="mt-0.5"
      />

      <Stack gap={4} className="min-w-0 flex-1">
        <Text
          as="p"
          variant="body-sm"
          truncate
          className={cn(completed && 'text-text-muted line-through')}
        >
          {task.title}
        </Text>
        <Inline gap={8} align="center" wrap className="min-w-0">
          <Text as="span" variant="caption" muted truncate>
            {task.projectName}
          </Text>
          {showPriorityTone ? (
            <Badge variant={priorityBadgeVariant(task.priority)} size="sm">
              {priorityLabel(task.priority)}
            </Badge>
          ) : (
            <Text as="span" variant="caption" muted>
              {priorityLabel(task.priority)}
            </Text>
          )}
          <Text
            as="span"
            variant="caption"
            className={cn(isOverdue ? 'text-danger' : 'text-text-muted')}
          >
            {task.dueLabel}
          </Text>
        </Inline>
      </Stack>

      <Avatar size="xs" className="mt-0.5 shrink-0" aria-hidden>
        <AvatarFallback initials={task.assigneeInitials} />
      </Avatar>
    </div>
  );
};

export type { TaskPreviewCardProps };
