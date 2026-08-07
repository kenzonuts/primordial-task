import { Archive, FolderOpen, Lock, SearchX } from 'lucide-react';
import type { ReactElement, ReactNode } from 'react';

import { EmptyState } from '@shared/ui/composites/empty-state';
import { Icon } from '@shared/ui/icons/icon';
import { cn } from '@shared/ui/lib/cn';

type WorkspaceEmptyVariant = 'none' | 'no-results' | 'permission-denied' | 'archived';

type WorkspaceEmptyStateProps = {
  readonly variant?: WorkspaceEmptyVariant;
  readonly action?: ReactNode;
  readonly title?: string;
  readonly description?: string;
  readonly className?: string;
};

const VARIANT_CONTENT: Record<
  WorkspaceEmptyVariant,
  {
    readonly title: string;
    readonly description: string;
    readonly icon: typeof FolderOpen;
  }
> = {
  none: {
    title: 'No workspaces yet',
    description: 'Create a workspace to organize projects, members, and settings.',
    icon: FolderOpen,
  },
  'no-results': {
    title: 'No matching workspaces',
    description: 'Try a different search term or clear filters to see more results.',
    icon: SearchX,
  },
  'permission-denied': {
    title: 'Access restricted',
    description: 'You do not have permission to view these workspaces.',
    icon: Lock,
  },
  archived: {
    title: 'No archived workspaces',
    description: 'Archived workspaces will appear here when you archive one.',
    icon: Archive,
  },
};

export const WorkspaceEmptyState = ({
  variant = 'none',
  action,
  title,
  description,
  className,
}: WorkspaceEmptyStateProps): ReactElement => {
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

export type { WorkspaceEmptyStateProps, WorkspaceEmptyVariant };
