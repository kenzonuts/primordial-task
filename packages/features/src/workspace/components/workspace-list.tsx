import { Archive, Star } from 'lucide-react';
import type { KeyboardEvent, MouseEvent, ReactElement } from 'react';

import { RoleBadge } from '@features/workspace/components/role-badge';
import { WorkspaceAvatar } from '@features/workspace/components/workspace-avatar';
import { formatWorkspaceLastUsed } from '@features/workspace/components/workspace-card';
import type { Workspace } from '@features/workspace/types';
import { Inline } from '@shared/ui/layout/inline';
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

type WorkspaceListProps = {
  readonly workspaces: readonly Workspace[];
  readonly selectedId?: string | null;
  readonly onSelect: (workspaceId: string) => void;
  readonly onOpen: (workspaceId: string) => void;
  readonly onToggleFavorite: (workspaceId: string) => void;
  readonly className?: string;
};

type WorkspaceListItemProps = {
  readonly workspace: Workspace;
  readonly selected: boolean;
  readonly onSelect: (workspaceId: string) => void;
  readonly onOpen: (workspaceId: string) => void;
  readonly onToggleFavorite: (workspaceId: string) => void;
};

const WorkspaceListItem = ({
  workspace,
  selected,
  onSelect,
  onOpen,
  onToggleFavorite,
}: WorkspaceListItemProps): ReactElement => {
  const isArchived = workspace.archivedAt !== null;
  const memberLabel = `${workspace.memberCount} ${workspace.memberCount === 1 ? 'member' : 'members'}`;

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
      className={cn(
        [
          'flex items-center gap-12 rounded-lg border border-border-subtle bg-surface-card px-3 py-2.5',
          'outline-none ds-transition-fast cursor-pointer',
          'hover:bg-state-hover hover:border-border-strong',
          'focus-visible:ds-focus-ring',
        ],
        selected && 'border-border-strong bg-state-selected',
        isArchived && 'opacity-80',
      )}
      onClick={() => onSelect(workspace.id)}
      onDoubleClick={() => onOpen(workspace.id)}
      onKeyDown={handleKeyDown}
    >
      <WorkspaceAvatar
        name={workspace.name}
        color={workspace.color}
        logoUrl={workspace.logoUrl}
        size="md"
      />

      <Inline gap={8} align="center" className="min-w-0 flex-1">
        <Text as="span" variant="body-sm" truncate className="min-w-0 font-medium">
          {workspace.name}
        </Text>
        <RoleBadge role={workspace.role} />
        {isArchived ? (
          <Badge variant="neutral" size="sm" className="shrink-0 gap-1">
            <Archive className="size-3" aria-hidden="true" />
            Archived
          </Badge>
        ) : null}
      </Inline>

      <Text as="span" variant="caption" muted className="hidden shrink-0 sm:inline">
        {memberLabel}
      </Text>
      <Text as="span" variant="caption" muted className="hidden shrink-0 md:inline">
        {formatWorkspaceLastUsed(workspace.lastUsedAt)}
      </Text>

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
    </div>
  );
};

export const WorkspaceList = ({
  workspaces,
  selectedId = null,
  onSelect,
  onOpen,
  onToggleFavorite,
  className,
}: WorkspaceListProps): ReactElement => {
  return (
    <div role="list" aria-label="Workspaces" className={cn('flex flex-col gap-8', className)}>
      {workspaces.map((workspace) => (
        <div key={workspace.id} role="listitem">
          <WorkspaceListItem
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

export type { WorkspaceListProps };
