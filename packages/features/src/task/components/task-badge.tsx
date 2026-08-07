import type { ReactElement } from 'react';

import type { TaskLabel } from '@features/task/types';
import { cn } from '@shared/ui/lib/cn';
import { Chip, type ChipProps } from '@shared/ui/primitives/chip';
import { Tag, type TagProps } from '@shared/ui/primitives/tag';

type TaskLabelBadgeProps = {
  readonly label: Pick<TaskLabel, 'name' | 'color'> | string;
  readonly size?: ChipProps['size'];
  readonly removable?: boolean;
  readonly onRemove?: ChipProps['onRemove'];
  readonly className?: string;
};

type TaskTagBadgeProps = {
  readonly tag: string;
  readonly size?: TagProps['size'];
  readonly className?: string;
};

const resolveLabel = (
  label: TaskLabelBadgeProps['label'],
): { readonly name: string; readonly color?: string } => {
  if (typeof label === 'string') {
    return { name: label };
  }
  return { name: label.name, color: label.color };
};

export const TaskLabelBadge = ({
  label,
  size = 'sm',
  removable = false,
  onRemove,
  className,
}: TaskLabelBadgeProps): ReactElement => {
  const resolved = resolveLabel(label);

  return (
    <Chip
      size={size}
      removable={removable}
      onRemove={onRemove}
      removeLabel={`Remove label ${resolved.name}`}
      leading={
        resolved.color ? (
          <span
            aria-hidden="true"
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: resolved.color }}
          />
        ) : undefined
      }
      className={cn('max-w-[160px]', className)}
    >
      {resolved.name}
    </Chip>
  );
};

export const TaskTagBadge = ({ tag, size = 'sm', className }: TaskTagBadgeProps): ReactElement => {
  return (
    <Tag size={size} className={cn('max-w-[140px]', className)}>
      {tag}
    </Tag>
  );
};

export type { TaskLabelBadgeProps, TaskTagBadgeProps };
