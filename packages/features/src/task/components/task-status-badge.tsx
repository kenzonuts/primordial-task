import type { ReactElement } from 'react';

import { TASK_STATUS_LABELS } from '@features/task/constants';
import type { TaskStatus } from '@features/task/types';
import { cn } from '@shared/ui/lib/cn';
import { Badge, type BadgeProps } from '@shared/ui/primitives/badge';

type TaskStatusBadgeProps = {
  readonly status: TaskStatus;
  readonly size?: BadgeProps['size'];
  readonly className?: string;
};

const statusVariant = (status: TaskStatus): BadgeProps['variant'] => {
  if (status === 'blocked') {
    return 'danger';
  }
  if (status === 'completed') {
    return 'success';
  }
  return 'neutral';
};

export const TaskStatusBadge = ({
  status,
  size = 'sm',
  className,
}: TaskStatusBadgeProps): ReactElement => {
  return (
    <Badge
      variant={statusVariant(status)}
      size={size}
      className={cn('shrink-0', className)}
      data-status={status}
    >
      {TASK_STATUS_LABELS[status]}
    </Badge>
  );
};

export type { TaskStatusBadgeProps };
