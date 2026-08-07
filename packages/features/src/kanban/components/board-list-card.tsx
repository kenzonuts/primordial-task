import { Pin, Star } from 'lucide-react';
import type { KeyboardEvent, MouseEvent, ReactElement } from 'react';

import type { KanbanBoard } from '@features/kanban/types';
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

type BoardListCardProps = {
  readonly board: KanbanBoard;
  readonly selected?: boolean;
  readonly onOpen: (boardId: string) => void;
  readonly onToggleFavorite?: (boardId: string) => void;
  readonly onTogglePinned?: (boardId: string) => void;
  readonly className?: string;
};

const formatUpdated = (timestamp: number): string => {
  const diffMs = Date.now() - timestamp;
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return 'Updated just now';
  if (minutes < 60) return `Updated ${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Updated ${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `Updated ${days}d ago`;
  return `Updated ${new Date(timestamp).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })}`;
};

const excerpt = (value: string, max = 96): string => {
  const trimmed = value.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1).trimEnd()}…`;
};

export const BoardListCard = ({
  board,
  selected = false,
  onOpen,
  onToggleFavorite,
  onTogglePinned,
  className,
}: BoardListCardProps): ReactElement => {
  const isArchived = board.archivedAt !== null;

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      onOpen(board.id);
    }
  };

  const handleFavoriteClick = (event: MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();
    onToggleFavorite?.(board.id);
  };

  const handlePinnedClick = (event: MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();
    onTogglePinned?.(board.id);
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
          'overflow-hidden rounded-lg border border-border-subtle bg-surface-card',
          'outline-none ds-transition-fast cursor-pointer',
          'hover:bg-state-hover hover:border-border-default',
          'focus-visible:ds-focus-ring',
        ],
        selected && 'border-border-strong bg-state-selected',
        isArchived && 'opacity-80',
        className,
      )}
      onClick={() => onOpen(board.id)}
      onKeyDown={handleKeyDown}
    >
      <Stack gap={12} className="p-4">
        <Inline gap={8} align="start" justify="between" className="w-full">
          <Stack gap={4} className="min-w-0 flex-1">
            <Text as="span" variant="h4" truncate className="min-w-0">
              {board.name}
            </Text>
            <Text as="span" variant="caption" muted truncate>
              {board.projectName}
            </Text>
          </Stack>

          <TooltipProvider delayDuration={300}>
            <Inline gap={4} align="center" className="shrink-0">
              {onToggleFavorite ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <IconButton
                      type="button"
                      size="sm"
                      variant={board.isFavorite ? 'selected' : 'ghost'}
                      aria-label={
                        board.isFavorite
                          ? `Remove ${board.name} from favorites`
                          : `Add ${board.name} to favorites`
                      }
                      aria-pressed={board.isFavorite}
                      onClick={handleFavoriteClick}
                      className={cn(board.isFavorite && 'text-warning hover:text-warning')}
                    >
                      <Star className={cn(board.isFavorite && 'fill-current')} aria-hidden="true" />
                    </IconButton>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    {board.isFavorite ? 'Remove favorite' : 'Add favorite'}
                  </TooltipContent>
                </Tooltip>
              ) : null}

              {onTogglePinned ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <IconButton
                      type="button"
                      size="sm"
                      variant={board.isPinned ? 'selected' : 'ghost'}
                      aria-label={board.isPinned ? `Unpin ${board.name}` : `Pin ${board.name}`}
                      aria-pressed={board.isPinned}
                      onClick={handlePinnedClick}
                    >
                      <Pin className={cn(board.isPinned && 'fill-current')} aria-hidden="true" />
                    </IconButton>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    {board.isPinned ? 'Unpin board' : 'Pin board'}
                  </TooltipContent>
                </Tooltip>
              ) : null}
            </Inline>
          </TooltipProvider>
        </Inline>

        {board.description ? (
          <Text as="p" variant="body-sm" muted className="line-clamp-2">
            {excerpt(board.description)}
          </Text>
        ) : null}

        <Text as="span" variant="caption" muted>
          {formatUpdated(board.updatedAt)}
        </Text>
      </Stack>
    </div>
  );
};

export type { BoardListCardProps };
