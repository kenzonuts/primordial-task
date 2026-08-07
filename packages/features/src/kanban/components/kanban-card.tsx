import { CheckSquare, Clock, ListTree, MessageSquare, Paperclip, Pin, Star } from 'lucide-react';
import {
  memo,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
} from 'react';

import { KANBAN_CARD_MIN_HEIGHT } from '@features/kanban/constants';
import { TaskLabelBadge } from '@features/task/components/task-badge';
import { TaskPriorityBadge } from '@features/task/components/task-priority-badge';
import { TaskStatusBadge } from '@features/task/components/task-status-badge';
import { checklistProgress, formatTaskDueDate } from '@features/task/services/task-service';
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
import { Progress } from '@shared/ui/primitives/progress';
import { Text } from '@shared/ui/typography/text';

type DragHandleProps = {
  readonly attributes?: HTMLAttributes<HTMLElement>;
  readonly listeners?: HTMLAttributes<HTMLElement>;
};

type KanbanCardProps = {
  readonly task: Task;
  readonly selected?: boolean;
  readonly focused?: boolean;
  readonly isDragging?: boolean;
  readonly onOpen: (taskId: string) => void;
  readonly onSelect: (taskId: string, event: MouseEvent | KeyboardEvent) => void;
  readonly dragHandleProps?: DragHandleProps;
  readonly setNodeRef?: (node: HTMLElement | null) => void;
  readonly style?: CSSProperties;
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

const formatEstimate = (minutes: number | null): string | null => {
  if (minutes == null) {
    return null;
  }
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const rem = minutes % 60;
  return rem === 0 ? `${hours}h` : `${hours}h ${rem}m`;
};

const isOverdue = (task: Task): boolean => {
  if (task.dueDate == null) {
    return false;
  }
  if (task.status === 'completed' || task.status === 'cancelled' || task.status === 'archived') {
    return false;
  }
  return task.dueDate < Date.now();
};

const KanbanCardComponent = ({
  task,
  selected = false,
  focused = false,
  isDragging = false,
  onOpen,
  onSelect,
  dragHandleProps,
  setNodeRef,
  style,
  className,
}: KanbanCardProps): ReactElement => {
  const checklistPct = checklistProgress(task.checklistCompleted, task.checklistTotal);
  const estimate = formatEstimate(task.estimatedMinutes);
  const overdue = isOverdue(task);
  const ariaLabel = [
    task.title,
    `Status ${task.status}`,
    `Priority ${task.priority}`,
    task.dueDate != null ? `Due ${formatTaskDueDate(task.dueDate)}` : null,
    task.assignee ? `Assignee ${task.assignee.fullName}` : 'Unassigned',
    task.status === 'blocked' ? 'Blocked' : null,
  ]
    .filter(Boolean)
    .join(', ');

  const handleClick = (event: MouseEvent<HTMLDivElement>): void => {
    if (event.metaKey || event.ctrlKey || event.shiftKey) {
      event.preventDefault();
      onSelect(task.id, event);
      return;
    }
    onOpen(task.id);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onOpen(task.id);
      return;
    }
    if (event.key === ' ' && !event.metaKey && !event.ctrlKey) {
      // Space is reserved for keyboard drag pickup at the board level.
      return;
    }
    if ((event.key === 'x' || event.key === 'X') && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      onSelect(task.id, event);
    }
  };

  return (
    <div
      ref={setNodeRef}
      data-selected={selected || undefined}
      data-focused={focused || undefined}
      data-dragging={isDragging || undefined}
      data-task-id={task.id}
      style={{ minHeight: KANBAN_CARD_MIN_HEIGHT, ...style }}
      className={cn(
        [
          'group relative flex w-full flex-col gap-8 rounded-lg border border-border-subtle',
          'bg-surface-card p-3 outline-none ds-transition-fast',
          'hover:border-border-default hover:bg-state-hover',
          'focus-visible:ds-focus-ring',
          'motion-reduce:transition-none',
        ],
        selected && 'border-border-strong bg-state-selected',
        focused && !selected && 'ring-1 ring-border-strong',
        isDragging && 'opacity-60 shadow-md',
        className,
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...(dragHandleProps?.listeners ?? {})}
      {...(dragHandleProps?.attributes ?? {})}
      role="listitem"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-selected={selected}
    >
      <Inline gap={8} align="start" justify="between" className="w-full">
        <TooltipProvider delayDuration={400}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Text
                as="span"
                variant="body-sm"
                className="line-clamp-2 min-w-0 flex-1 font-medium leading-snug"
              >
                {task.title}
              </Text>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-[280px]">
              {task.title}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Inline gap={2} align="center" className="shrink-0 opacity-70 group-hover:opacity-100">
          {task.isFavorite ? (
            <Star
              className="size-3.5 fill-current text-warning"
              aria-label="Favorite"
              aria-hidden={false}
            />
          ) : null}
          {task.isPinned ? (
            <Pin className="size-3.5 fill-current text-text-secondary" aria-label="Pinned" />
          ) : null}
        </Inline>
      </Inline>

      <Inline gap={4} align="center" className="flex-wrap">
        <TaskPriorityBadge priority={task.priority} />
        <TaskStatusBadge status={task.status} />
        {task.labels.slice(0, 2).map((label) => (
          <TaskLabelBadge key={label.id} label={label} />
        ))}
        {task.labels.length > 2 ? (
          <Text as="span" variant="caption" muted>
            +{task.labels.length - 2}
          </Text>
        ) : null}
      </Inline>

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

      <Inline gap={8} align="center" justify="between" className="mt-auto w-full">
        <Inline gap={4} align="center" className="min-w-0">
          {task.assignee ? (
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex shrink-0">
                    <Avatar size="xs">
                      {task.assignee.avatarUrl ? (
                        <AvatarImage src={task.assignee.avatarUrl} alt="" />
                      ) : null}
                      <AvatarFallback initials={personInitials(task.assignee.fullName)} />
                    </Avatar>
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top">{task.assignee.fullName}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Text as="span" variant="caption" muted>
              Unassigned
            </Text>
          )}
        </Inline>

        <Inline gap={4} align="center" className="shrink-0 text-text-muted">
          {task.subtaskCount > 0 ? (
            <Inline
              gap={2}
              align="center"
              aria-label={`${task.subtaskCompleted} of ${task.subtaskCount} subtasks`}
            >
              <ListTree className="size-3" aria-hidden="true" />
              <Text as="span" variant="caption" muted>
                {task.subtaskCompleted}/{task.subtaskCount}
              </Text>
            </Inline>
          ) : null}
          {task.commentCount > 0 ? (
            <Inline gap={2} align="center" aria-label={`${task.commentCount} comments`}>
              <MessageSquare className="size-3" aria-hidden="true" />
              <Text as="span" variant="caption" muted>
                {task.commentCount}
              </Text>
            </Inline>
          ) : null}
          {task.attachmentCount > 0 ? (
            <Inline gap={2} align="center" aria-label={`${task.attachmentCount} attachments`}>
              <Paperclip className="size-3" aria-hidden="true" />
              <Text as="span" variant="caption" muted>
                {task.attachmentCount}
              </Text>
            </Inline>
          ) : null}
          {task.checklistTotal > 0 ? (
            <Inline
              gap={2}
              align="center"
              aria-label={`Checklist ${task.checklistCompleted} of ${task.checklistTotal}`}
            >
              <CheckSquare className="size-3" aria-hidden="true" />
              <Text as="span" variant="caption" muted>
                {task.checklistCompleted}/{task.checklistTotal}
              </Text>
            </Inline>
          ) : null}
          {estimate ? (
            <Inline gap={2} align="center" aria-label={`Estimate ${estimate}`}>
              <Clock className="size-3" aria-hidden="true" />
              <Text as="span" variant="caption" muted>
                {estimate}
              </Text>
            </Inline>
          ) : null}
          <Text
            as="span"
            variant="caption"
            className={cn('shrink-0', overdue ? 'text-danger' : 'text-text-muted')}
          >
            {formatTaskDueDate(task.dueDate)}
          </Text>
        </Inline>
      </Inline>
    </div>
  );
};

export const KanbanCard = memo(KanbanCardComponent);
KanbanCard.displayName = 'KanbanCard';

export type { KanbanCardProps, DragHandleProps };

/** Enforced min-height constant for layout / virtualization. */
export const KANBAN_CARD_STYLE_MIN_HEIGHT = KANBAN_CARD_MIN_HEIGHT;
