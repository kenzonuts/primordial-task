import { useVirtualizer } from '@tanstack/react-virtual';
import type { KeyboardEvent, MouseEvent, ReactElement } from 'react';
import { useMemo, useRef } from 'react';

import { CalendarEmptyState } from '@features/calendar/components/calendar-empty-state';
import type { CalendarEvent } from '@features/calendar/types';
import {
  formatDayLabel,
  formatTime,
  isSameDay,
  isToday,
  startOfDay,
  toDateIso,
} from '@features/calendar/utils/date-utils';
import { TaskPriorityBadge } from '@features/task/components/task-priority-badge';
import { TaskStatusBadge } from '@features/task/components/task-status-badge';
import { cn } from '@shared/ui/lib/cn';
import { Text } from '@shared/ui/typography/text';

type AgendaListProps = {
  readonly events: readonly CalendarEvent[];
  readonly selectedEventIds?: ReadonlySet<string>;
  readonly dimPastEvents?: boolean;
  readonly emptyAction?: ReactElement;
  readonly onOpenEvent?: (event: CalendarEvent) => void;
  readonly onSelectEvent?: (event: CalendarEvent, nativeEvent: MouseEvent | KeyboardEvent) => void;
  readonly className?: string;
};

type AgendaRow =
  | { readonly kind: 'header'; readonly date: number; readonly id: string; readonly count: number }
  | { readonly kind: 'event'; readonly event: CalendarEvent; readonly id: string };

const buildAgendaRows = (events: readonly CalendarEvent[]): AgendaRow[] => {
  const sorted = [...events].sort(
    (a, b) => a.startAt - b.startAt || a.title.localeCompare(b.title),
  );
  const rows: AgendaRow[] = [];
  let currentDay: number | null = null;
  let headerIndex = -1;

  for (const event of sorted) {
    const day = startOfDay(event.startAt);
    if (currentDay === null || !isSameDay(currentDay, day)) {
      currentDay = day;
      headerIndex = rows.length;
      rows.push({
        kind: 'header',
        date: day,
        id: `header-${toDateIso(day)}`,
        count: 0,
      });
    }
    const header = rows[headerIndex];
    if (header?.kind === 'header') {
      rows[headerIndex] = { ...header, count: header.count + 1 };
    }
    rows.push({ kind: 'event', event, id: event.id });
  }
  return rows;
};

export const AgendaList = ({
  events,
  selectedEventIds,
  dimPastEvents = true,
  emptyAction,
  onOpenEvent,
  onSelectEvent,
  className,
}: AgendaListProps): ReactElement => {
  const parentRef = useRef<HTMLDivElement>(null);
  const rows = useMemo(() => buildAgendaRows(events), [events]);
  const now = Date.now();

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => (rows[index]?.kind === 'header' ? 36 : 56),
    overscan: 12,
  });

  if (events.length === 0) {
    return <CalendarEmptyState variant="none" action={emptyAction} className={className} />;
  }

  return (
    <div
      ref={parentRef}
      role="list"
      aria-label="Agenda"
      className={cn('h-full min-h-0 overflow-auto bg-surface-base', className)}
    >
      <div className="relative w-full" style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const row = rows[virtualRow.index];
          if (!row) {
            return null;
          }

          if (row.kind === 'header') {
            const today = isToday(row.date, now);
            return (
              <div
                key={row.id}
                role="presentation"
                className="sticky top-0 z-[1] flex items-center gap-2 border-b border-border-subtle bg-surface-elevated px-3"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: virtualRow.size,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <Text
                  as="h3"
                  variant="body-sm"
                  className={cn('font-medium', today && 'text-text-primary')}
                  id={row.id}
                >
                  {formatDayLabel(row.date)}
                  {today ? ' · Today' : ''}
                </Text>
                <Text variant="caption" muted aria-label={`${row.count} events`}>
                  {row.count}
                </Text>
              </div>
            );
          }

          const { event } = row;
          const selected = selectedEventIds?.has(event.id) ?? false;
          const dimmed = dimPastEvents && (event.completed || event.endAt < now);

          return (
            <button
              key={row.id}
              type="button"
              role="listitem"
              aria-labelledby={undefined}
              aria-label={`${event.title}, ${formatTime(event.startAt)}, ${event.status}`}
              onClick={(nativeEvent) => {
                onSelectEvent?.(event, nativeEvent);
                if (!nativeEvent.metaKey && !nativeEvent.ctrlKey && !nativeEvent.shiftKey) {
                  onOpenEvent?.(event);
                }
              }}
              className={cn(
                'absolute left-0 flex w-full items-center gap-3 border-b border-border-subtle px-3 text-left',
                'hover:bg-state-hover focus-visible:outline-none',
                'focus-visible:outline-2 focus-visible:outline-offset-[-2px]',
                'focus-visible:outline-[var(--state-focus)]',
                selected && 'bg-state-selected',
                dimmed && 'opacity-55',
              )}
              style={{
                height: virtualRow.size,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <Text as="span" variant="caption" muted className="w-20 shrink-0 tabular-nums">
                {event.allDay ? 'All day' : formatTime(event.startAt)}
              </Text>
              <div className="min-w-0 flex-1">
                <Text as="span" variant="body-sm" className="font-medium" truncate>
                  {event.title}
                </Text>
                <Text as="span" variant="caption" muted truncate>
                  {event.projectName}
                  {event.assigneeName ? ` · ${event.assigneeName}` : ''}
                </Text>
              </div>
              <div className="hidden shrink-0 gap-1 sm:flex">
                <TaskStatusBadge status={event.status} size="sm" />
                <TaskPriorityBadge priority={event.priority} size="sm" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export type { AgendaListProps };
