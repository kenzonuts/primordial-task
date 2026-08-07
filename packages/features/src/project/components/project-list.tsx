import type { ReactElement } from 'react';

import { ProjectRow } from '@features/project/components/project-row';
import type { Project } from '@features/project/types';
import { cn } from '@shared/ui/lib/cn';

type ProjectListProps = {
  readonly projects: readonly Project[];
  readonly selectedId?: string | null;
  readonly onOpen: (projectId: string) => void;
  readonly onToggleFavorite: (projectId: string) => void;
  readonly onTogglePinned: (projectId: string) => void;
  readonly className?: string;
};

export const ProjectList = ({
  projects,
  selectedId = null,
  onOpen,
  onToggleFavorite,
  onTogglePinned,
  className,
}: ProjectListProps): ReactElement => {
  return (
    <div role="list" aria-label="Projects" className={cn('flex flex-col gap-8', className)}>
      {projects.map((project) => (
        <div key={project.id} role="listitem">
          <ProjectRow
            project={project}
            selected={selectedId === project.id}
            onOpen={onOpen}
            onToggleFavorite={onToggleFavorite}
            onTogglePinned={onTogglePinned}
          />
        </div>
      ))}
    </div>
  );
};

export type { ProjectListProps };
