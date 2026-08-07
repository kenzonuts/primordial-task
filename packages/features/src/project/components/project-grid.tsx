import type { ReactElement } from 'react';

import { ProjectCard } from '@features/project/components/project-card';
import type { Project } from '@features/project/types';
import { cn } from '@shared/ui/lib/cn';

type ProjectGridProps = {
  readonly projects: readonly Project[];
  readonly selectedId?: string | null;
  readonly onOpen: (projectId: string) => void;
  readonly onToggleFavorite: (projectId: string) => void;
  readonly onTogglePinned: (projectId: string) => void;
  readonly className?: string;
};

export const ProjectGrid = ({
  projects,
  selectedId = null,
  onOpen,
  onToggleFavorite,
  onTogglePinned,
  className,
}: ProjectGridProps): ReactElement => {
  return (
    <div
      role="list"
      aria-label="Projects"
      className={cn('grid grid-cols-1 gap-16 md:grid-cols-2 xl:grid-cols-3', className)}
    >
      {projects.map((project) => (
        <div key={project.id} role="listitem">
          <ProjectCard
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

export type { ProjectGridProps };
