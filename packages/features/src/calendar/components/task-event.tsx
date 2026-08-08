import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { CSSProperties, KeyboardEvent, MouseEvent, ReactElement } from 'react';
import { memo } from 'react';

import { HOUR_HEIGHT_PX, MIN_EVENT_DURATION_MS } from '@features/calendar/constants';
import type { CalendarEvent } from '@features/calendar/types';
import { formatTime } from '@features/calendar/utils/date-utils';
import { TaskPriorityBadge } from '@features/task/components/task-priority-badge';
import { TaskStatusBadge } from '@features/task/components/task-status-badge';
import { cn } from '@shared/ui/lib/cn';
import { Text } from '@shared/ui/typography/text';

type TaskEventProps = {
  readonly event: CalendarEvent;
  readonly topPx?: number;
  readonly heightPx?: number;
  readonly leftPct?: number;
  readonly widthPct?: number;
  readonly selected?: boolean;
  readonly dimmed?: boolean;
  readonly showBadges?: boolean;
  readonly showResizeHandles?: boolean;
  readonly draggable?: boolean;
  readonly onOpen?: (event: CalendarEvent) => void;
  readonly onSelect?: (event: CalendarEvent, nativeEvent: MouseEvent | KeyboardEvent) => void;
  readonly onPickup?: (event: CalendarEvent) => void;
  readonly onResize?: (event: CalendarEvent, edge: 'start' | 'end', nextMs: number) => void;
  readonly className?: string;
};

const minutesFromStartOfDay = (ms: number): number => {
  const date = new Date(ms);
  return date.getHours() * 60 + date.getMinutes();
};

export const eventBlockGeometry = (
  event: CalendarEvent,
  dayStartMs: number,
): { topPx: number; heightPx: number } => {
  const startMs = Math.max(event.startAt, dayStartMs);
  const endMs = Math.max(event.endAt, startMs + MIN_EVENT_DURATION_MS);
  const startMinutes = minutesFromStartOfDay(startMs);
  const durationMinutes = Math.max((endMs - startMs) / 60_000, 15);
  return {
    topPx: (startMinutes / 60) * HOUR_HEIGHT_PX,
    heightPx: Math.max((durationMinutes / 60) * HOUR_HEIGHT_PX, HOUR_HEIGHT_PX / 4),
  };
};

const TaskEventComponent = ({
  event,
  topPx,
  heightPx,
  leftPct = 0,
  widthPct = 100,
  selected = false,
  dimmed = false,
  showBadges = true,
  showResizeHandles = true,
  draggable = true,
  onOpen,
  onSelect,
  onPickup,
  onResize,
  className,
}: TaskEventProps): ReactElement => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `event-${event.id}`,
    disabled: !draggable,
    data: {
      type: 'calendar-event',
      eventId: event.id,
      taskId: event.taskId,
      startAt: event.startAt,
      endAt: event.endAt,
    },
  });

  const style: CSSProperties = {
    top: topPx,
    height: heightPx,
    left: `${leftPct}%`,
    width: `calc(${widthPct}% - 4px)`,
    transform: transform ? CSS.Translate.toString(transform) : undefined,
  };

  const compact = (heightPx ?? 48) < 36;

  const handleClick = (nativeEvent: MouseEvent<HTMLDivElement>): void => {
    onSelect?.(event, nativeEvent);
    if (!nativeEvent.metaKey && !nativeEvent.ctrlKey && !nativeEvent.shiftKey) {
      onOpen?.(event);
    }
  };

  const handleKeyDown = (nativeEvent: KeyboardEvent<HTMLDivElement>): void => {
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

  const handleResizePointer = (edge: 'start' | 'end') => (nativeEvent: MouseEvent) => {
    nativeEvent.stopPropagation();
    nativeEvent.preventDefault();
    const deltaMinutes = edge === 'end' ? 15 : -15;
    const nextMs =
      edge === 'end' ? event.endAt + deltaMinutes * 60_000 : event.startAt + deltaMinutes * 60_000;
    onResize?.(event, edge, nextMs);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={`${event.title}, ${formatTime(event.startAt)} to ${formatTime(event.endAt)}, ${event.status}`}
      aria-pressed={selected}
      data-event-id={event.id}
      data-task-id={event.taskId}
      className={cn(
        'absolute z-[1] flex min-h-0 flex-col overflow-hidden rounded-md border px-1.5 py-0.5',
        'border-border-default bg-surface-card text-text-primary',
        'hover:border-border-strong hover:bg-state-hover',
        'focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-1',
        'focus-visible:outline-[var(--state-focus)]',
        'motion-safe:transition-[background-color,border-color] motion-safe:duration-150',
        selected && 'border-border-strong bg-state-selected ring-1 ring-[var(--state-focus)]',
        dimmed && 'opacity-50',
        isDragging && 'z-20 opacity-80 shadow-md',
        event.isOverdue && !event.completed && 'border-danger/50',
        event.completed && 'opacity-60',
        className,
      )}
    >
      {showResizeHandles && onResize ? (
        <button
          type="button"
          tabIndex={-1}
          aria-label={`Resize start of ${event.title}`}
          className="absolute inset-x-1 top-0 h-1 cursor-ns-resize rounded-t opacity-0 hover:opacity-100 hover:bg-border-strong focus-visible:opacity-100"
          onClick={handleResizePointer('start')}
          onPointerDown={(pointerEvent) => pointerEvent.stopPropagation()}
        />
      ) : null}

      <Text as="span" variant="caption" className="truncate font-medium leading-4">
        {event.title}
      </Text>

      {!compact ? (
        <Text as="span" variant="caption" muted className="truncate leading-4">
          {event.allDay ? 'All day' : `${formatTime(event.startAt)} – ${formatTime(event.endAt)}`}
        </Text>
      ) : null}

      {showBadges && !compact && (heightPx ?? 48) >= 52 ? (
        <div className="mt-auto flex min-w-0 flex-wrap gap-1 pt-0.5">
          <TaskStatusBadge status={event.status} size="sm" />
          <TaskPriorityBadge priority={event.priority} size="sm" />
        </div>
      ) : null}

      {showResizeHandles && onResize ? (
        <button
          type="button"
          tabIndex={-1}
          aria-label={`Resize end of ${event.title}`}
          className="absolute inset-x-1 bottom-0 h-1 cursor-ns-resize rounded-b opacity-0 hover:opacity-100 hover:bg-border-strong focus-visible:opacity-100"
          onClick={handleResizePointer('end')}
          onPointerDown={(pointerEvent) => pointerEvent.stopPropagation()}
        />
      ) : null}
    </div>
  );
};

export const TaskEvent = memo(TaskEventComponent);
TaskEvent.displayName = 'TaskEvent';

export type { TaskEventProps };
