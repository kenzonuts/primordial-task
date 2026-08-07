import { Plus, Search, SearchX, Columns3 } from 'lucide-react';
import type { ReactElement, ReactNode } from 'react';

import { EmptyState } from '@shared/ui/composites/empty-state';
import { Icon } from '@shared/ui/icons/icon';
import { cn } from '@shared/ui/lib/cn';

type KanbanEmptyVariant = 'no-tasks' | 'no-columns' | 'no-results';

type KanbanEmptyStateProps = {
  readonly variant?: KanbanEmptyVariant;
  readonly action?: ReactNode;
  readonly title?: string;
  readonly description?: string;
  readonly className?: string;
};

const VARIANT_CONTENT: Record<
  KanbanEmptyVariant,
  {
    readonly title: string;
    readonly description: string;
    readonly icon: typeof Columns3;
  }
> = {
  'no-tasks': {
    title: 'No tasks on this board',
    description: 'Add a task to a column to start tracking work on this board.',
    icon: Plus,
  },
  'no-columns': {
    title: 'No columns yet',
    description: 'Create columns to define your workflow, then add tasks.',
    icon: Columns3,
  },
  'no-results': {
    title: 'No matching cards',
    description: 'Try a different search term or clear filters to see more cards.',
    icon: SearchX,
  },
};

export const KanbanEmptyState = ({
  variant = 'no-tasks',
  action,
  title,
  description,
  className,
}: KanbanEmptyStateProps): ReactElement => {
  const content = VARIANT_CONTENT[variant];
  const IconComponent = variant === 'no-results' ? Search : content.icon;

  return (
    <EmptyState
      className={cn('min-h-[280px]', className)}
      icon={<Icon icon={IconComponent} decorative />}
      title={title ?? content.title}
      description={description ?? content.description}
      action={action}
    />
  );
};

export type { KanbanEmptyStateProps, KanbanEmptyVariant };
