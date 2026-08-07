import { Archive, Star } from 'lucide-react';
import type { KeyboardEvent, MouseEvent, ReactElement } from 'react';

import { RoleBadge } from '@features/workspace/components/role-badge';
import { WorkspaceAvatar } from '@features/workspace/components/workspace-avatar';
import type { Workspace } from '@features/workspace/types';
import { Inline } from '@shared/ui/layout/inline';
import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@shared/ui/overlays/tooltip';
import { Badge } from '@shared/ui/primitives/badge';
import { IconButton } from '@shared/ui/primitives/icon-button';
import { Text } from '@shared/ui/typography/text';

type WorkspaceCardProps = {
  readonly workspace: Workspace;
  readonly selected?: boolean;
  readonly onSelect: (workspaceId: string) => void;
  readonly onOpen: (workspaceId: string) => void;
  readonly onToggleFavorite: (workspaceId: string) => void;
  readonly className?: string;
};

export const formatWorkspaceLastUsed = (timestamp: number): string => {
  const diffMs = Date.now() - timestamp;
  const minutes = Math.floor(diffMs / 60_000);

  if (minutes < 1) {
    return 'Opened recently';
  }
  if (minutes < 60) {
    return `Opened ${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `Opened ${hours}h ago`;
  }

  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `Opened ${days}d ago`;
  }

  return `Opened ${new Date(timestamp).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })}`;
};

export const WorkspaceCard = ({
  workspace,
  selected = false,
  onSelect,
  onOpen,
  onToggleFavorite,
  className,
}: WorkspaceCardProps): ReactElement => {
  const isArchived = workspace.archivedAt !== null;
  const memberLabel = `${workspace.memberCount} ${workspace.memberCount === 1 ? 'member' : 'members'}`;
  const lastUsedLabel = formatWorkspaceLastUsed(workspace.lastUsedAt);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      onSelect(workspace.id);
      if (event.key === 'Enter') {
        onOpen(workspace.id);
      }
    }
  };

  const handleFavoriteClick = (event: MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();
    onToggleFavorite(workspace.id);
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
          'rounded-lg border border-border-default bg-surface-card p-4 shadow-sm',
          'outline-none ds-transition-fast cursor-pointer',
          'hover:bg-state-hover hover:border-border-strong',
          'focus-visible:ds-focus-ring',
          'active:bg-state-pressed',
        ],
        selected && 'border-border-strong bg-state-selected',
        isArchived && 'opacity-80',
        className,
      )}
      onClick={() => onSelect(workspace.id)}
      onDoubleClick={() => onOpen(workspace.id)}
      onKeyDown={handleKeyDown}
    >
      <Stack gap={12}>
        <Inline gap={12} align="start" justify="between" className="w-full">
          <Inline gap={12} align="center" className="min-w-0 flex-1">
            <WorkspaceAvatar
              name={workspace.name}
              color={workspace.color}
              logoUrl={workspace.logoUrl}
              size="lg"
            />
            <Stack gap={4} className="min-w-0 flex-1">
              <Inline gap={8} align="center" className="min-w-0">
                <Text as="span" variant="h4" truncate className="min-w-0">
                  {workspace.name}
                </Text>
                {isArchived ? (
                  <Badge variant="neutral" size="sm" className="shrink-0 gap-1">
                    <Archive className="size-3" aria-hidden="true" />
                    Archived
                  </Badge>
                ) : null}
              </Inline>
              <Inline gap={8} align="center" className="min-w-0">
                <RoleBadge role={workspace.role} />
                <Text as="span" variant="caption" muted>
                  {memberLabel}
                </Text>
              </Inline>
            </Stack>
          </Inline>

          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <IconButton
                  type="button"
                  size="sm"
                  variant={workspace.isFavorite ? 'selected' : 'ghost'}
                  aria-label={
                    workspace.isFavorite
                      ? `Remove ${workspace.name} from favorites`
                      : `Add ${workspace.name} to favorites`
                  }
                  aria-pressed={workspace.isFavorite}
                  onClick={handleFavoriteClick}
                  className={cn(workspace.isFavorite && 'text-warning hover:text-warning')}
                >
                  <Star className={cn(workspace.isFavorite && 'fill-current')} aria-hidden="true" />
                </IconButton>
              </TooltipTrigger>
              <TooltipContent side="top">
                {workspace.isFavorite ? 'Remove favorite' : 'Add favorite'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Inline>

        <Text as="p" variant="caption" muted>
          {lastUsedLabel}
        </Text>
      </Stack>
    </div>
  );
};

export type { WorkspaceCardProps };
