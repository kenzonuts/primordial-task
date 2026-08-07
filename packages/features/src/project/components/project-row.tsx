import { Pin, Star } from 'lucide-react';
import type { KeyboardEvent, MouseEvent, ReactElement } from 'react';

import { ProjectAvatar } from '@features/project/components/project-avatar';
import { formatProjectUpdated } from '@features/project/components/project-card';
import { ProjectProgressCard } from '@features/project/components/project-progress-card';
import { ProjectStatusBadge } from '@features/project/components/project-status-badge';
import type { Project } from '@features/project/types';
import { Inline } from '@shared/ui/layout/inline';
import { cn } from '@shared/ui/lib/cn';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@shared/ui/overlays/tooltip';
import { IconButton } from '@shared/ui/primitives/icon-button';
import { Text } from '@shared/ui/typography/text';

type ProjectRowProps = {
  readonly project: Project;
  readonly selected?: boolean;
  readonly onOpen: (projectId: string) => void;
  readonly onToggleFavorite: (projectId: string) => void;
  readonly onTogglePinned: (projectId: string) => void;
  readonly className?: string;
};

export const ProjectRow = ({
  project,
  selected = false,
  onOpen,
  onToggleFavorite,
  onTogglePinned,
  className,
}: ProjectRowProps): ReactElement => {
  const isArchived = project.archivedAt !== null;

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      onOpen(project.id);
    }
  };

  const handleFavoriteClick = (event: MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();
    onToggleFavorite(project.id);
  };

  const handlePinnedClick = (event: MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();
    onTogglePinned(project.id);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      data-selected={selected || undefined}
      data-archived={isArchived || undefined}
      className={cn(
        [
          'flex items-center gap-12 rounded-lg border border-border-subtle bg-surface-card px-3 py-2.5',
          'outline-none ds-transition-fast cursor-pointer',
          'hover:bg-state-hover hover:border-border-strong',
          'focus-visible:ds-focus-ring',
        ],
        selected && 'border-border-strong bg-state-selected',
        isArchived && 'opacity-80',
        className,
      )}
      onClick={() => onOpen(project.id)}
      onKeyDown={handleKeyDown}
    >
      <ProjectAvatar name={project.name} color={project.color} icon={project.icon} size="md" />

      <Inline gap={8} align="center" className="min-w-0 flex-1">
        <Text as="span" variant="body-sm" truncate className="min-w-0 font-medium">
          {project.name}
        </Text>
        <ProjectStatusBadge status={project.status} health={project.health} />
      </Inline>

      <div className="hidden w-28 shrink-0 lg:block">
        <ProjectProgressCard progress={project.progress} compact size="thin" title="" />
      </div>

      <Text as="span" variant="caption" muted truncate className="hidden w-28 shrink-0 sm:inline">
        {project.owner.fullName}
      </Text>

      <Text as="span" variant="caption" muted className="hidden shrink-0 md:inline">
        {formatProjectUpdated(project.updatedAt)}
      </Text>

      <TooltipProvider delayDuration={300}>
        <Inline gap={4} align="center" className="shrink-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <IconButton
                type="button"
                size="sm"
                variant={project.isFavorite ? 'selected' : 'ghost'}
                aria-label={
                  project.isFavorite
                    ? `Remove ${project.name} from favorites`
                    : `Add ${project.name} to favorites`
                }
                aria-pressed={project.isFavorite}
                onClick={handleFavoriteClick}
                className={cn(project.isFavorite && 'text-warning hover:text-warning')}
              >
                <Star className={cn(project.isFavorite && 'fill-current')} aria-hidden="true" />
              </IconButton>
            </TooltipTrigger>
            <TooltipContent side="top">
              {project.isFavorite ? 'Remove favorite' : 'Add favorite'}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <IconButton
                type="button"
                size="sm"
                variant={project.isPinned ? 'selected' : 'ghost'}
                aria-label={project.isPinned ? `Unpin ${project.name}` : `Pin ${project.name}`}
                aria-pressed={project.isPinned}
                onClick={handlePinnedClick}
              >
                <Pin className={cn(project.isPinned && 'fill-current')} aria-hidden="true" />
              </IconButton>
            </TooltipTrigger>
            <TooltipContent side="top">
              {project.isPinned ? 'Unpin project' : 'Pin project'}
            </TooltipContent>
          </Tooltip>
        </Inline>
      </TooltipProvider>
    </div>
  );
};

export type { ProjectRowProps };
