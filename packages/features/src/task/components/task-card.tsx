import { Pin, Star } from 'lucide-react';
import type { KeyboardEvent, MouseEvent, ReactElement } from 'react';

import { TaskLabelBadge } from '@features/task/components/task-badge';
import { TaskPriorityBadge } from '@features/task/components/task-priority-badge';
import { TaskStatusBadge } from '@features/task/components/task-status-badge';
import { formatTaskDueDate, checklistProgress } from '@features/task/services/task-service';
import type { Task } from '@features/task/types';
import { Inline } from '@shared/ui/layout/inline';
import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@shared/ui/overlays/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@shared/ui/primitives/avatar';
import { IconButton } from '@shared/ui/primitives/icon-button';
import { Progress } from '@shared/ui/primitives/progress';
import { Text } from '@shared/ui/typography/text';

type TaskCardProps = {
  readonly task: Task;
  readonly selected?: boolean;
  readonly onOpen: (taskId: string) => void;
  readonly onToggleFavorite: (taskId: string) => void;
  readonly onTogglePinned: (taskId: string) => void;
  readonly className?: string;
};

const personInitials = (fullName: string): string => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return '?';
  }
  if (parts.length === 1) {
    return parts[0]!.slice(0, 2).toUpperCase();
  }
  return `${parts[0]![0] ?? ''}${parts[1]![0] ?? ''}`.toUpperCase();
};

export const TaskCard = ({
  task,
  selected = false,
  onOpen,
  onToggleFavorite,
  onTogglePinned,
  className,
}: TaskCardProps): ReactElement => {
  const isArchived = task.archivedAt !== null;
  const checklistPct = checklistProgress(task.checklistCompleted, task.checklistTotal);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      onOpen(task.id);
    }
  };

  const handleFavoriteClick = (event: MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();
    onToggleFavorite(task.id);
  };

  const handlePinnedClick = (event: MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();
    onTogglePinned(task.id);
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
      onClick={() => onOpen(task.id)}
      onKeyDown={handleKeyDown}
    >
      <Stack gap={12} className="p-4">
        <Inline gap={8} align="start" justify="between" className="w-full">
          <Stack gap={6} className="min-w-0 flex-1">
            <Text as="span" variant="h4" truncate className="min-w-0">
              {task.title}
            </Text>
            <Inline gap={6} align="center" className="flex-wrap">
              <TaskStatusBadge status={task.status} />
              <TaskPriorityBadge priority={task.priority} />
            </Inline>
          </Stack>

          <TooltipProvider delayDuration={300}>
            <Inline gap={4} align="center" className="shrink-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <IconButton
                    type="button"
                    size="sm"
                    variant={task.isFavorite ? 'selected' : 'ghost'}
                    aria-label={
                      task.isFavorite
                        ? `Remove ${task.title} from favorites`
                        : `Add ${task.title} to favorites`
                    }
                    aria-pressed={task.isFavorite}
                    onClick={handleFavoriteClick}
                    className={cn(task.isFavorite && 'text-warning hover:text-warning')}
                  >
                    <Star className={cn(task.isFavorite && 'fill-current')} aria-hidden="true" />
                  </IconButton>
                </TooltipTrigger>
                <TooltipContent side="top">
                  {task.isFavorite ? 'Remove favorite' : 'Add favorite'}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <IconButton
                    type="button"
                    size="sm"
                    variant={task.isPinned ? 'selected' : 'ghost'}
                    aria-label={task.isPinned ? `Unpin ${task.title}` : `Pin ${task.title}`}
                    aria-pressed={task.isPinned}
                    onClick={handlePinnedClick}
                  >
                    <Pin className={cn(task.isPinned && 'fill-current')} aria-hidden="true" />
                  </IconButton>
                </TooltipTrigger>
                <TooltipContent side="top">
                  {task.isPinned ? 'Unpin task' : 'Pin task'}
                </TooltipContent>
              </Tooltip>
            </Inline>
          </TooltipProvider>
        </Inline>

        <Text as="span" variant="caption" muted truncate>
          {task.projectName}
        </Text>

        {task.labels.length > 0 ? (
          <Inline gap={4} align="center" className="flex-wrap">
            {task.labels.slice(0, 3).map((label) => (
              <TaskLabelBadge key={label.id} label={label} />
            ))}
            {task.labels.length > 3 ? (
              <Text as="span" variant="caption" muted>
                +{task.labels.length - 3}
              </Text>
            ) : null}
          </Inline>
        ) : null}

        {task.checklistTotal > 0 ? (
          <Stack gap={4}>
            <Inline gap={8} align="center" justify="between">
              <Text as="span" variant="caption" muted>
                Checklist
              </Text>
              <Text as="span" variant="caption" muted>
                {task.checklistCompleted}/{task.checklistTotal}
              </Text>
            </Inline>
            <Progress
              value={checklistPct}
              size="thin"
              aria-label={`Checklist ${checklistPct}% complete`}
            />
          </Stack>
        ) : null}

        <Inline gap={8} align="center" justify="between" className="w-full">
          {task.assignee ? (
            <Inline gap={8} align="center" className="min-w-0">
              <Avatar size="xs">
                {task.assignee.avatarUrl ? (
                  <AvatarImage src={task.assignee.avatarUrl} alt="" />
                ) : null}
                <AvatarFallback initials={personInitials(task.assignee.fullName)} />
              </Avatar>
              <Text as="span" variant="caption" muted truncate className="min-w-0">
                {task.assignee.fullName}
              </Text>
            </Inline>
          ) : (
            <Text as="span" variant="caption" muted>
              Unassigned
            </Text>
          )}
          <Text as="span" variant="caption" muted className="shrink-0">
            {formatTaskDueDate(task.dueDate)}
          </Text>
        </Inline>
      </Stack>
    </div>
  );
};

export type { TaskCardProps };
