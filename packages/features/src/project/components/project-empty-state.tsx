import { Archive, FolderKanban, Lock, SearchX } from 'lucide-react';
import type { ReactElement, ReactNode } from 'react';

import { EmptyState } from '@shared/ui/composites/empty-state';
import { Icon } from '@shared/ui/icons/icon';
import { cn } from '@shared/ui/lib/cn';

type ProjectEmptyVariant = 'none' | 'no-results' | 'archived' | 'permission';

type ProjectEmptyStateProps = {
  readonly variant?: ProjectEmptyVariant;
  readonly action?: ReactNode;
  readonly title?: string;
  readonly description?: string;
  readonly className?: string;
};

const VARIANT_CONTENT: Record<
  ProjectEmptyVariant,
  {
    readonly title: string;
    readonly description: string;
    readonly icon: typeof FolderKanban;
  }
> = {
  none: {
    title: 'No projects yet',
    description: 'Create a project to track work, members, and progress in this workspace.',
    icon: FolderKanban,
  },
  'no-results': {
    title: 'No matching projects',
    description: 'Try a different search term or clear filters to see more results.',
    icon: SearchX,
  },
  archived: {
    title: 'No archived projects',
    description: 'Archived projects will appear here when you archive one.',
    icon: Archive,
  },
  permission: {
    title: 'Access restricted',
    description: 'You do not have permission to view these projects.',
    icon: Lock,
  },
};

export const ProjectEmptyState = ({
  variant = 'none',
  action,
  title,
  description,
  className,
}: ProjectEmptyStateProps): ReactElement => {
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

export type { ProjectEmptyStateProps, ProjectEmptyVariant };
