import type { ReactElement } from 'react';

import { TASK_PRIORITY_LABELS } from '@features/task/constants';
import type { TaskPriority } from '@features/task/types';
import { cn } from '@shared/ui/lib/cn';
import { Badge, type BadgeProps } from '@shared/ui/primitives/badge';

type TaskPriorityBadgeProps = {
  readonly priority: TaskPriority;
  readonly size?: BadgeProps['size'];
  readonly className?: string;
};

const priorityVariant = (priority: TaskPriority): BadgeProps['variant'] => {
  if (priority === 'critical') {
    return 'danger';
  }
  if (priority === 'high') {
    return 'warning';
  }
  return 'neutral';
};

export const TaskPriorityBadge = ({
  priority,
  size = 'sm',
  className,
}: TaskPriorityBadgeProps): ReactElement => {
  return (
    <Badge
      variant={priorityVariant(priority)}
      size={size}
      className={cn('shrink-0', className)}
      data-priority={priority}
    >
      {TASK_PRIORITY_LABELS[priority]}
    </Badge>
  );
};

export type { TaskPriorityBadgeProps };
