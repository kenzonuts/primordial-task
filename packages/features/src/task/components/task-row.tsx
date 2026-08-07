import { ChevronDown, ChevronRight, Pin, Star } from 'lucide-react';
import type { KeyboardEvent, MouseEvent, ReactElement } from 'react';

import { TaskPriorityBadge } from '@features/task/components/task-priority-badge';
import { TaskStatusBadge } from '@features/task/components/task-status-badge';
import { formatTaskDueDate } from '@features/task/services/task-service';
import type { Task } from '@features/task/types';
import { Inline } from '@shared/ui/layout/inline';
import { cn } from '@shared/ui/lib/cn';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@shared/ui/overlays/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@shared/ui/primitives/avatar';
import { Checkbox } from '@shared/ui/primitives/checkbox';
import { IconButton } from '@shared/ui/primitives/icon-button';
import { Text } from '@shared/ui/typography/text';

type TaskRowProps = {
  readonly task: Task;
  readonly selected?: boolean;
  readonly expanded?: boolean;
  readonly onOpen: (taskId: string) => void;
  readonly onSelectChange?: (taskId: string, selected: boolean) => void;
  readonly onToggleExpand?: (taskId: string) => void;
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

export const TaskRow = ({
  task,
  selected = false,
  expanded = false,
  onOpen,
  onSelectChange,
  onToggleExpand,
  onToggleFavorite,
  onTogglePinned,
  className,
}: TaskRowProps): ReactElement => {
  const isArchived = task.archivedAt !== null;
  const hasSubtasks = task.subtaskCount > 0;
  const indentPx = Math.min(task.depth, 6) * 16;

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      onOpen(task.id);
    }
  };

  const stopAnd = (handler: () => void) => (event: MouseEvent) => {
    event.stopPropagation();
    handler();
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      data-selected={selected || undefined}
      data-archived={isArchived || undefined}
      data-depth={task.depth}
      className={cn(
        [
          'flex items-center gap-8 rounded-lg border border-border-subtle bg-surface-card px-3 py-2',
          'outline-none ds-transition-fast cursor-pointer',
          'hover:bg-state-hover hover:border-border-strong',
          'focus-visible:ds-focus-ring',
        ],
        selected && 'border-border-strong bg-state-selected',
        isArchived && 'opacity-80',
        className,
      )}
      style={{ paddingLeft: `${12 + indentPx}px` }}
      onClick={() => onOpen(task.id)}
      onKeyDown={handleKeyDown}
    >
      {onSelectChange ? (
        <Checkbox
          checked={selected}
          aria-label={`Select ${task.title}`}
          onCheckedChange={(value) => {
            onSelectChange(task.id, value === true);
          }}
          onClick={(event) => {
            event.stopPropagation();
          }}
          className="shrink-0"
        />
      ) : null}

      {hasSubtasks && onToggleExpand ? (
        <IconButton
          type="button"
          size="sm"
          variant="ghost"
          aria-label={
            expanded ? `Collapse subtasks of ${task.title}` : `Expand subtasks of ${task.title}`
          }
          aria-expanded={expanded}
          onClick={stopAnd(() => onToggleExpand(task.id))}
          className="shrink-0"
        >
          {expanded ? <ChevronDown aria-hidden="true" /> : <ChevronRight aria-hidden="true" />}
        </IconButton>
      ) : (
        <span className="inline-flex size-7 shrink-0" aria-hidden="true" />
      )}

      <Inline gap={8} align="center" className="min-w-0 flex-1">
        <Text as="span" variant="body-sm" truncate className="min-w-0 font-medium">
          {task.title}
        </Text>
      </Inline>

      <Text as="span" variant="caption" muted truncate className="hidden w-28 shrink-0 md:inline">
        {task.projectName}
      </Text>

      {task.assignee ? (
        <Inline gap={8} align="center" className="hidden w-32 shrink-0 lg:inline-flex">
          <Avatar size="xs">
            {task.assignee.avatarUrl ? <AvatarImage src={task.assignee.avatarUrl} alt="" /> : null}
            <AvatarFallback initials={personInitials(task.assignee.fullName)} />
          </Avatar>
          <Text as="span" variant="caption" muted truncate>
            {task.assignee.fullName}
          </Text>
        </Inline>
      ) : (
        <Text as="span" variant="caption" muted className="hidden w-32 shrink-0 lg:inline">
          Unassigned
        </Text>
      )}

      <div className="hidden shrink-0 sm:block">
        <TaskPriorityBadge priority={task.priority} />
      </div>

      <div className="hidden shrink-0 md:block">
        <TaskStatusBadge status={task.status} />
      </div>

      <Text as="span" variant="caption" muted className="hidden w-20 shrink-0 text-right xl:inline">
        {formatTaskDueDate(task.dueDate)}
      </Text>

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
                onClick={stopAnd(() => onToggleFavorite(task.id))}
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
                onClick={stopAnd(() => onTogglePinned(task.id))}
              >
                <Pin className={cn(task.isPinned && 'fill-current')} aria-hidden="true" />
              </IconButton>
            </TooltipTrigger>
            <TooltipContent side="top">{task.isPinned ? 'Unpin task' : 'Pin task'}</TooltipContent>
          </Tooltip>
        </Inline>
      </TooltipProvider>
    </div>
  );
};

export type { TaskRowProps };
