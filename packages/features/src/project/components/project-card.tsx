import { Pin, Star } from 'lucide-react';
import type { KeyboardEvent, MouseEvent, ReactElement } from 'react';

import { ProjectAvatar } from '@features/project/components/project-avatar';
import { ProjectCover } from '@features/project/components/project-cover';
import { ProjectProgressCard } from '@features/project/components/project-progress-card';
import { ProjectStatusBadge } from '@features/project/components/project-status-badge';
import type { Project } from '@features/project/types';
import { Inline } from '@shared/ui/layout/inline';
import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@shared/ui/overlays/tooltip';
import { IconButton } from '@shared/ui/primitives/icon-button';
import { Text } from '@shared/ui/typography/text';

type ProjectCardProps = {
  readonly project: Project;
  readonly selected?: boolean;
  readonly onOpen: (projectId: string) => void;
  readonly onToggleFavorite: (projectId: string) => void;
  readonly onTogglePinned: (projectId: string) => void;
  readonly className?: string;
};

export const formatProjectUpdated = (timestamp: number): string => {
  const diffMs = Date.now() - timestamp;
  const minutes = Math.floor(diffMs / 60_000);

  if (minutes < 1) {
    return 'Updated just now';
  }
  if (minutes < 60) {
    return `Updated ${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `Updated ${hours}h ago`;
  }

  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `Updated ${days}d ago`;
  }

  return `Updated ${new Date(timestamp).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })}`;
};

const excerpt = (value: string, max = 96): string => {
  const trimmed = value.trim();
  if (trimmed.length <= max) {
    return trimmed;
  }
  return `${trimmed.slice(0, max - 1).trimEnd()}…`;
};

export const ProjectCard = ({
  project,
  selected = false,
  onOpen,
  onToggleFavorite,
  onTogglePinned,
  className,
}: ProjectCardProps): ReactElement => {
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
          'overflow-hidden rounded-lg border border-border-default bg-surface-card shadow-sm',
          'outline-none ds-transition-fast cursor-pointer',
          'hover:bg-state-hover hover:border-border-strong',
          'focus-visible:ds-focus-ring',
          'active:bg-state-pressed',
        ],
        selected && 'border-border-strong bg-state-selected',
        isArchived && 'opacity-80',
        className,
      )}
      onClick={() => onOpen(project.id)}
      onKeyDown={handleKeyDown}
    >
      <ProjectCover color={project.color} coverUrl={project.coverUrl} size="sm" />

      <Stack gap={12} className="p-4">
        <Inline gap={12} align="start" justify="between" className="w-full">
          <Inline gap={12} align="start" className="min-w-0 flex-1">
            <ProjectAvatar
              name={project.name}
              color={project.color}
              icon={project.icon}
              size="lg"
            />
            <Stack gap={4} className="min-w-0 flex-1">
              <Inline gap={8} align="center" className="min-w-0">
                <Text as="span" variant="h4" truncate className="min-w-0">
                  {project.name}
                </Text>
              </Inline>
              <ProjectStatusBadge status={project.status} health={project.health} />
            </Stack>
          </Inline>

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
        </Inline>

        {project.description ? (
          <Text as="p" variant="caption" muted className="line-clamp-2">
            {excerpt(project.description)}
          </Text>
        ) : null}

        <ProjectProgressCard progress={project.progress} compact />

        <Inline gap={8} align="center" justify="between" className="w-full">
          <Text as="span" variant="caption" muted truncate className="min-w-0">
            {project.owner.fullName}
          </Text>
          <Text as="span" variant="caption" muted className="shrink-0">
            {formatProjectUpdated(project.updatedAt)}
          </Text>
        </Inline>
      </Stack>
    </div>
  );
};

export type { ProjectCardProps };
