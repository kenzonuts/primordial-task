import type { ReactElement } from 'react';

import { WorkspaceCard } from '@features/workspace/components/workspace-card';
import type { Workspace } from '@features/workspace/types';
import { cn } from '@shared/ui/lib/cn';

type WorkspaceGridProps = {
  readonly workspaces: readonly Workspace[];
  readonly selectedId?: string | null;
  readonly onSelect: (workspaceId: string) => void;
  readonly onOpen: (workspaceId: string) => void;
  readonly onToggleFavorite: (workspaceId: string) => void;
  readonly className?: string;
};

export const WorkspaceGrid = ({
  workspaces,
  selectedId = null,
  onSelect,
  onOpen,
  onToggleFavorite,
  className,
}: WorkspaceGridProps): ReactElement => {
  return (
    <div
      role="list"
      aria-label="Workspaces"
      className={cn('grid grid-cols-1 gap-16 md:grid-cols-2 xl:grid-cols-3', className)}
    >
      {workspaces.map((workspace) => (
        <div key={workspace.id} role="listitem">
          <WorkspaceCard
            workspace={workspace}
            selected={selectedId === workspace.id}
            onSelect={onSelect}
            onOpen={onOpen}
            onToggleFavorite={onToggleFavorite}
          />
        </div>
      ))}
    </div>
  );
};

export type { WorkspaceGridProps };
