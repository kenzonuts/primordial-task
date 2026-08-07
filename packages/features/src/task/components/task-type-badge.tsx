import type { ReactElement } from 'react';

import { TASK_TYPE_LABELS } from '@features/task/constants';
import type { TaskType } from '@features/task/types';
import { cn } from '@shared/ui/lib/cn';
import { Badge, type BadgeProps } from '@shared/ui/primitives/badge';

type TaskTypeBadgeProps = {
  readonly type: TaskType;
  readonly size?: BadgeProps['size'];
  readonly className?: string;
};

export const TaskTypeBadge = ({
  type,
  size = 'sm',
  className,
}: TaskTypeBadgeProps): ReactElement => {
  return (
    <Badge variant="neutral" size={size} className={cn('shrink-0', className)} data-type={type}>
      {TASK_TYPE_LABELS[type]}
    </Badge>
  );
};

/** Alias for consumers that prefer a shorter name for the type chip. */
export const TaskBadge = TaskTypeBadge;

export type { TaskTypeBadgeProps };
