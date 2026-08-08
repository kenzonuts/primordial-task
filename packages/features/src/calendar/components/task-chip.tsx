import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { KeyboardEvent, MouseEvent, ReactElement } from 'react';
import { memo } from 'react';

import type { CalendarEvent } from '@features/calendar/types';
import type { TaskPriority } from '@features/task/types';
import { cn } from '@shared/ui/lib/cn';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@shared/ui/overlays/tooltip';

type TaskChipProps = {
  readonly event: CalendarEvent;
  readonly selected?: boolean;
  readonly dimmed?: boolean;
  readonly draggable?: boolean;
  readonly onOpen?: (event: CalendarEvent) => void;
  readonly onSelect?: (event: CalendarEvent, nativeEvent: MouseEvent | KeyboardEvent) => void;
  readonly onPickup?: (event: CalendarEvent) => void;
  readonly className?: string;
};

const PRIORITY_DOT: Record<TaskPriority, string> = {
  critical: 'bg-danger',
  high: 'bg-warning',
  medium: 'bg-text-secondary',
  low: 'bg-text-muted',
  none: 'bg-border-strong',
};

const TaskChipComponent = ({
  event,
  selected = false,
  dimmed = false,
  draggable = true,
  onOpen,
  onSelect,
  onPickup,
  className,
}: TaskChipProps): ReactElement => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `chip-${event.id}`,
    disabled: !draggable,
    data: {
      type: 'calendar-chip',
      eventId: event.id,
      taskId: event.taskId,
      startAt: event.startAt,
      endAt: event.endAt,
    },
  });

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
      }
    : undefined;

  const handleClick = (nativeEvent: MouseEvent<HTMLButtonElement>): void => {
    onSelect?.(event, nativeEvent);
    if (!nativeEvent.metaKey && !nativeEvent.ctrlKey && !nativeEvent.shiftKey) {
      onOpen?.(event);
    }
  };

  const handleKeyDown = (nativeEvent: KeyboardEvent<HTMLButtonElement>): void => {
    if (nativeEvent.key === 'Enter') {
      nativeEvent.preventDefault();
      onOpen?.(event);
      return;
    }
    if (nativeEvent.key === ' ') {
      nativeEvent.preventDefault();
      onPickup?.(event);
    }
  };

  return (
    <TooltipProvider delayDuration={400}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            ref={setNodeRef}
            type="button"
            style={style}
            {...attributes}
            {...listeners}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            aria-label={`${event.title}, priority ${event.priority}`}
            aria-pressed={selected}
            data-event-id={event.id}
            data-task-id={event.taskId}
            className={cn(
              'group flex h-5 w-full min-w-0 items-center gap-1 rounded-sm px-1 text-left',
              'border border-transparent bg-surface-elevated text-[11px] leading-4 text-text-primary',
              'hover:bg-state-hover focus-visible:outline-none',
              'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--state-focus)]',
              'motion-safe:transition-colors motion-safe:duration-150',
              selected && 'border-border-strong bg-state-selected',
              dimmed && 'opacity-50',
              isDragging && 'opacity-70 shadow-sm z-10',
              event.isOverdue && !event.completed && 'border-danger/40',
              className,
            )}
          >
            <span
              aria-hidden="true"
              className={cn('size-1.5 shrink-0 rounded-full', PRIORITY_DOT[event.priority])}
            />
            <span className="min-w-0 flex-1 truncate">{event.title}</span>
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[240px]">
          {event.title}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const TaskChip = memo(TaskChipComponent);
TaskChip.displayName = 'TaskChip';

export type { TaskChipProps };
