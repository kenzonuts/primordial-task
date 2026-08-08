import { CalendarDays, CalendarOff, Lock, SearchX } from 'lucide-react';
import type { ReactElement, ReactNode } from 'react';

import { EmptyState } from '@shared/ui/composites/empty-state';
import { Icon } from '@shared/ui/icons/icon';
import { cn } from '@shared/ui/lib/cn';

type CalendarEmptyVariant = 'none' | 'no-results' | 'permission' | 'filtered';

type CalendarEmptyStateProps = {
  readonly variant?: CalendarEmptyVariant;
  readonly action?: ReactNode;
  readonly title?: string;
  readonly description?: string;
  readonly className?: string;
};

const VARIANT_CONTENT: Record<
  CalendarEmptyVariant,
  {
    readonly title: string;
    readonly description: string;
    readonly icon: typeof CalendarDays;
  }
> = {
  none: {
    title: 'No events in this range',
    description: 'Create a task with a start or due date to see it on the calendar.',
    icon: CalendarDays,
  },
  'no-results': {
    title: 'No matching events',
    description: 'Try a different search term or clear filters to see more results.',
    icon: SearchX,
  },
  filtered: {
    title: 'Nothing matches these filters',
    description: 'Adjust or clear filters to reveal scheduled work.',
    icon: CalendarOff,
  },
  permission: {
    title: 'Access restricted',
    description: 'You do not have permission to view this calendar.',
    icon: Lock,
  },
};

export const CalendarEmptyState = ({
  variant = 'none',
  action,
  title,
  description,
  className,
}: CalendarEmptyStateProps): ReactElement => {
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

export type { CalendarEmptyStateProps, CalendarEmptyVariant };
