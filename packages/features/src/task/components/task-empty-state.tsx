import { Archive, CheckSquare, Lock, SearchX } from 'lucide-react';
import type { ReactElement, ReactNode } from 'react';

import { EmptyState } from '@shared/ui/composites/empty-state';
import { Icon } from '@shared/ui/icons/icon';
import { cn } from '@shared/ui/lib/cn';

type TaskEmptyVariant = 'none' | 'no-results' | 'archived' | 'permission';

type TaskEmptyStateProps = {
  readonly variant?: TaskEmptyVariant;
  readonly action?: ReactNode;
  readonly title?: string;
  readonly description?: string;
  readonly className?: string;
};

const VARIANT_CONTENT: Record<
  TaskEmptyVariant,
  {
    readonly title: string;
    readonly description: string;
    readonly icon: typeof CheckSquare;
  }
> = {
  none: {
    title: 'No tasks yet',
    description: 'Create a task to start tracking work in this project or workspace.',
    icon: CheckSquare,
  },
  'no-results': {
    title: 'No matching tasks',
    description: 'Try a different search term or clear filters to see more results.',
    icon: SearchX,
  },
  archived: {
    title: 'No archived tasks',
    description: 'Archived tasks will appear here when you archive one.',
    icon: Archive,
  },
  permission: {
    title: 'Access restricted',
    description: 'You do not have permission to view these tasks.',
    icon: Lock,
  },
};

export const TaskEmptyState = ({
  variant = 'none',
  action,
  title,
  description,
  className,
}: TaskEmptyStateProps): ReactElement => {
  const content = VARIANT_CONTENT[variant];

  return (
    <EmptyState
      className={cn('min-h-[280px]', className)}
      icon={<Icon icon={content.icon} decorative />}
      title={title ?? content.title}
      description={description ?? content.description}
      action={action}
    />
  );
};

export type { TaskEmptyStateProps, TaskEmptyVariant };
