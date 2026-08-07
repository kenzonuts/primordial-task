import { FolderPlus } from 'lucide-react';
import type { ReactElement, ReactNode } from 'react';

import { EmptyState } from '@shared/ui/composites/empty-state';
import { Icon } from '@shared/ui/icons/icon';
import { cn } from '@shared/ui/lib/cn';
import { Button } from '@shared/ui/primitives/button';

type EmptyDashboardStateProps = {
  readonly title?: string;
  readonly description?: string;
  readonly action?: ReactNode;
  readonly onCreateProject?: () => void;
  readonly className?: string;
};

export const EmptyDashboardState = ({
  title = 'Start with your first project.',
  description = 'Create a project to organize tasks, deadlines, and team activity.',
  action,
  onCreateProject,
  className,
}: EmptyDashboardStateProps): ReactElement => {
  const resolvedAction =
    action ??
    (onCreateProject ? (
      <Button type="button" variant="primary" size="md" onClick={onCreateProject}>
        New Project
      </Button>
    ) : null);

  return (
    <EmptyState
      className={cn('min-h-[320px]', className)}
      icon={<Icon icon={FolderPlus} decorative />}
      title={title}
      description={description}
      action={resolvedAction}
    />
  );
};

export type { EmptyDashboardStateProps };
