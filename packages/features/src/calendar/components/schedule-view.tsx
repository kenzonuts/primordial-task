import type { KeyboardEvent, MouseEvent, ReactElement } from 'react';
import { useMemo } from 'react';

import { CalendarEmptyState } from '@features/calendar/components/calendar-empty-state';
import { eventsOnDay } from '@features/calendar/services/calendar-service';
import type { CalendarEvent } from '@features/calendar/types';
import {
  buildWeekDays,
  formatDayLabel,
  formatTime,
  isToday,
  toDateIso,
} from '@features/calendar/utils/date-utils';
import { TaskPriorityBadge } from '@features/task/components/task-priority-badge';
import { TaskStatusBadge } from '@features/task/components/task-status-badge';
import { cn } from '@shared/ui/lib/cn';
import { Text } from '@shared/ui/typography/text';

type ScheduleViewProps = {
  readonly anchorDate: number;
  readonly events: readonly CalendarEvent[];
  readonly weekStartsOn?: 0 | 1;
  readonly selectedEventIds?: ReadonlySet<string>;
  readonly dimPastEvents?: boolean;
  readonly onOpenEvent?: (event: CalendarEvent) => void;
  readonly onSelectEvent?: (event: CalendarEvent, nativeEvent: MouseEvent | KeyboardEvent) => void;
  readonly onSelectDay?: (dateMs: number) => void;
  readonly className?: string;
};

export const ScheduleView = ({
  anchorDate,
  events,
  weekStartsOn = 1,
  selectedEventIds,
  dimPastEvents = true,
  onOpenEvent,
  onSelectEvent,
  onSelectDay,
  className,
}: ScheduleViewProps): ReactElement => {
  const days = useMemo(() => buildWeekDays(anchorDate, weekStartsOn), [anchorDate, weekStartsOn]);
  const now = Date.now();
  const hasAny = days.some((day) => eventsOnDay(events, day).length > 0);

  if (!hasAny) {
    return <CalendarEmptyState variant="none" className={className} />;
  }

  return (
    <div
      role="list"
      aria-label="Schedule"
      className={cn('h-full min-h-0 overflow-auto bg-surface-base', className)}
    >
      {days.map((day) => {
        const dayEvents = eventsOnDay(events, day).sort((a, b) => a.startAt - b.startAt);
        const today = isToday(day, now);

        return (
          <section
            key={toDateIso(day)}
            aria-labelledby={`schedule-${toDateIso(day)}`}
            className="border-b border-border-subtle"
          >
            <button
              type="button"
              id={`schedule-${toDateIso(day)}`}
              onClick={() => onSelectDay?.(day)}
              className={cn(
                'sticky top-0 z-[1] flex w-full items-center gap-2 border-b border-border-subtle',
                'bg-surface-elevated px-3 py-2 text-left hover:bg-state-hover',
                'focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-[-2px]',
                'focus-visible:outline-[var(--state-focus)]',
                today && 'bg-state-selected/60',
              )}
            >
              <Text variant="body-sm" className="font-medium">
                {formatDayLabel(day)}
              </Text>
              <Text variant="caption" muted>
                {dayEvents.length} event{dayEvents.length === 1 ? '' : 's'}
              </Text>
            </button>

            {dayEvents.length === 0 ? (
              <Text variant="caption" muted className="px-3 py-2">
                No events
              </Text>
            ) : (
              <ul className="divide-y divide-border-subtle">
                {dayEvents.map((event) => {
                  const selected = selectedEventIds?.has(event.id) ?? false;
                  const dimmed = dimPastEvents && (event.completed || event.endAt < now);
                  return (
                    <li key={event.id}>
                      <button
                        type="button"
                        role="listitem"
                        aria-label={`${event.title}, ${formatTime(event.startAt)}`}
                        onClick={(nativeEvent) => {
                          onSelectEvent?.(event, nativeEvent);
                          if (
                            !nativeEvent.metaKey &&
                            !nativeEvent.ctrlKey &&
                            !nativeEvent.shiftKey
                          ) {
                            onOpenEvent?.(event);
                          }
                        }}
                        className={cn(
                          'flex w-full items-center gap-3 px-3 py-2 text-left',
                          'hover:bg-state-hover focus-visible:outline-none',
                          'focus-visible:outline-2 focus-visible:outline-offset-[-2px]',
                          'focus-visible:outline-[var(--state-focus)]',
                          selected && 'bg-state-selected',
                          dimmed && 'opacity-55',
                        )}
                      >
                        <Text
                          as="span"
                          variant="caption"
                          muted
                          className="w-24 shrink-0 tabular-nums"
                        >
                          {event.allDay
                            ? 'All day'
                            : `${formatTime(event.startAt)} – ${formatTime(event.endAt)}`}
                        </Text>
                        <div className="min-w-0 flex-1">
                          <Text as="span" variant="body-sm" className="font-medium" truncate>
                            {event.title}
                          </Text>
                          <Text as="span" variant="caption" muted truncate>
                            {event.projectName}
                          </Text>
                        </div>
                        <div className="hidden shrink-0 gap-1 md:flex">
                          <TaskStatusBadge status={event.status} size="sm" />
                          <TaskPriorityBadge priority={event.priority} size="sm" />
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
};

export type { ScheduleViewProps };
