import { Archive, FileText, Lock, SearchX, Trash2 } from 'lucide-react';
import type { ReactElement, ReactNode } from 'react';

import { EmptyState } from '@shared/ui/composites/empty-state';
import { Icon } from '@shared/ui/icons/icon';
import { cn } from '@shared/ui/lib/cn';

type NoteEmptyVariant = 'none' | 'no-results' | 'trash' | 'archived' | 'docs' | 'permission';

type NoteEmptyStateProps = {
  readonly variant?: NoteEmptyVariant;
  readonly action?: ReactNode;
  readonly title?: string;
  readonly description?: string;
  readonly className?: string;
};

const VARIANT_CONTENT: Record<
  NoteEmptyVariant,
  {
    readonly title: string;
    readonly description: string;
    readonly icon: typeof FileText;
  }
> = {
  none: {
    title: 'No notes yet',
    description: 'Create a note to capture ideas, meeting notes, or project docs.',
    icon: FileText,
  },
  'no-results': {
    title: 'No matching notes',
    description: 'Try a different search term or clear filters to see more results.',
    icon: SearchX,
  },
  trash: {
    title: 'Trash is empty',
    description: 'Deleted notes stay here for 30 days before permanent removal.',
    icon: Trash2,
  },
  archived: {
    title: 'No archived notes',
    description: 'Archived notes will appear here when you archive one.',
    icon: Archive,
  },
  docs: {
    title: 'No documentation yet',
    description: 'Create a documentation page to build structured project knowledge.',
    icon: FileText,
  },
  permission: {
    title: 'Access restricted',
    description: 'You do not have permission to view these notes.',
    icon: Lock,
  },
};

export const NoteEmptyState = ({
  variant = 'none',
  action,
  title,
  description,
  className,
}: NoteEmptyStateProps): ReactElement => {
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

export type { NoteEmptyStateProps, NoteEmptyVariant };
