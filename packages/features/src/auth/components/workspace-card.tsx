import type { KeyboardEvent, ReactElement } from 'react';

import type { AuthWorkspace } from '@features/auth/types';
import { Inline } from '@shared/ui/layout/inline';
import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import { Avatar, AvatarFallback } from '@shared/ui/primitives/avatar';
import { Badge } from '@shared/ui/primitives/badge';
import { Text } from '@shared/ui/typography/text';

type WorkspaceCardProps = {
  readonly workspace: AuthWorkspace;
  readonly selected?: boolean;
  readonly disabled?: boolean;
  readonly onSelect: (workspaceId: string) => void;
  readonly onActivate?: (workspaceId: string) => void;
  readonly className?: string;
};

const formatLastActivity = (timestamp: number): string => {
  const diffMs = Date.now() - timestamp;
  const minutes = Math.floor(diffMs / 60_000);

  if (minutes < 1) {
    return 'Just now';
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `${days}d ago`;
  }

  return new Date(timestamp).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const WorkspaceCard = ({
  workspace,
  selected = false,
  disabled = false,
  onSelect,
  onActivate,
  className,
}: WorkspaceCardProps): ReactElement => {
  const isDisabled = disabled || Boolean(workspace.unavailable);
  const lastActivityLabel = formatLastActivity(workspace.lastActivityAt);
  const memberLabel = `${workspace.memberCount} ${workspace.memberCount === 1 ? 'member' : 'members'}`;

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (isDisabled) {
      return;
    }

    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      onSelect(workspace.id);
      if (event.key === 'Enter' && onActivate) {
        onActivate(workspace.id);
      }
    }
  };

  return (
    <div
      role="radio"
      aria-checked={selected}
      aria-disabled={isDisabled || undefined}
      tabIndex={isDisabled ? -1 : 0}
      data-selected={selected || undefined}
      data-disabled={isDisabled || undefined}
      className={cn(
        [
          'min-w-[300px] rounded-lg border border-border-subtle bg-surface-card p-20 shadow-sm',
          'outline-none ds-transition-fast',
          'hover:bg-state-hover hover:border-border-strong',
          'focus-visible:ds-focus-ring',
          'active:bg-state-pressed',
        ],
        selected && 'border-border-strong bg-state-selected',
        isDisabled && 'pointer-events-none opacity-[var(--opacity-disabled)]',
        className,
      )}
      onClick={() => {
        if (!isDisabled) {
          onSelect(workspace.id);
        }
      }}
      onDoubleClick={() => {
        if (!isDisabled) {
          onSelect(workspace.id);
          onActivate?.(workspace.id);
        }
      }}
      onKeyDown={handleKeyDown}
    >
      <Stack gap={12}>
        <Inline gap={12} align="center">
          <Avatar size="lg">
            <AvatarFallback initials={workspace.initials} />
          </Avatar>
          <Stack gap={4} className="min-w-0 flex-1">
            <Inline gap={8} align="center" justify="between" className="w-full">
              <Text as="span" variant="h4" truncate className="min-w-0">
                {workspace.name}
              </Text>
              <Badge variant="neutral" size="sm" className="shrink-0">
                {workspace.role}
              </Badge>
            </Inline>
            <Text as="span" variant="caption" muted>
              {memberLabel}
            </Text>
          </Stack>
        </Inline>
        <Text as="p" variant="caption" muted>
          Last activity {lastActivityLabel}
        </Text>
      </Stack>
    </div>
  );
};

export type { WorkspaceCardProps };
