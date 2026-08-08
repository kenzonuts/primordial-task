import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { KeyboardEvent, MouseEvent, ReactElement } from 'react';
import { useEffect, useMemo, useRef } from 'react';

import { TaskEvent, eventBlockGeometry } from '@features/calendar/components/task-event';
import { WeekHeader } from '@features/calendar/components/week-header';
import { HOUR_HEIGHT_PX, MIN_EVENT_DURATION_MS } from '@features/calendar/constants';
import { eventsOnDay } from '@features/calendar/services/calendar-service';
import type { CalendarEvent } from '@features/calendar/types';
import {
  buildWeekDays,
  formatRangeLabel,
  hoursInDay,
  isToday,
  startOfDay,
  toDateIso,
} from '@features/calendar/utils/date-utils';
import { cn } from '@shared/ui/lib/cn';
import { Text } from '@shared/ui/typography/text';

type WeekViewProps = {
  readonly anchorDate: number;
  readonly events: readonly CalendarEvent[];
  readonly weekStartsOn?: 0 | 1;
  readonly workdayStartHour?: number;
  readonly selectedEventIds?: ReadonlySet<string>;
  readonly dimPastEvents?: boolean;
  readonly announcement?: string | null;
  readonly onSelectDay?: (dateMs: number) => void;
  readonly onOpenEvent?: (event: CalendarEvent) => void;
  readonly onSelectEvent?: (event: CalendarEvent, nativeEvent: MouseEvent | KeyboardEvent) => void;
  readonly onPickupEvent?: (event: CalendarEvent) => void;
  readonly onMoveEvent?: (
    taskId: string,
    startAt: number,
    endAt: number,
    eventIds?: readonly string[],
  ) => void;
  readonly onResize?: (event: CalendarEvent, edge: 'start' | 'end', nextMs: number) => void;
  readonly onCreateAt?: (dateMs: number, hour: number) => void;
  readonly className?: string;
};

const GUTTER = 56;
const DAY_MS = 24 * 60 * 60 * 1000;

const layoutOverlaps = (
  dayEvents: readonly CalendarEvent[],
): Map<string, { leftPct: number; widthPct: number }> => {
  const layout = new Map<string, { leftPct: number; widthPct: number }>();
  const sorted = [...dayEvents].sort((a, b) => a.startAt - b.startAt || a.endAt - b.endAt);
  const columns: CalendarEvent[][] = [];

  for (const event of sorted) {
    let placed = false;
    for (const column of columns) {
      const last = column[column.length - 1];
      if (last && last.endAt <= event.startAt) {
        column.push(event);
        placed = true;
        break;
      }
    }
    if (!placed) {
      columns.push([event]);
    }
  }

  const columnCount = Math.max(columns.length, 1);
  columns.forEach((column, columnIndex) => {
    for (const event of column) {
      layout.set(event.id, {
        leftPct: (columnIndex / columnCount) * 100,
        widthPct: 100 / columnCount,
      });
    }
  });
  return layout;
};

export const WeekView = ({
  anchorDate,
  events,
  weekStartsOn = 1,
  workdayStartHour = 9,
  selectedEventIds,
  dimPastEvents = true,
  announcement = null,
  onSelectDay,
  onOpenEvent,
  onSelectEvent,
  onPickupEvent,
  onMoveEvent,
  onResize,
  onCreateAt,
  className,
}: WeekViewProps): ReactElement => {
  const days = useMemo(() => buildWeekDays(anchorDate, weekStartsOn), [anchorDate, weekStartsOn]);
  const hours = useMemo(() => hoursInDay(), []);
  const scrollRef = useRef<HTMLDivElement>(null);
  const now = Date.now();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  );

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) {
      return;
    }
    const preferReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const target = Math.max(0, (workdayStartHour - 2) * HOUR_HEIGHT_PX);
    if (preferReduced) {
      node.scrollTop = target;
    } else {
      node.scrollTo({ top: target, behavior: 'smooth' });
    }
  }, [anchorDate, workdayStartHour]);

  const handleDragEnd = (dragEvent: DragEndEvent): void => {
    const activeData = dragEvent.active.data.current;
    if (!activeData?.taskId || activeData.type !== 'calendar-event') {
      return;
    }
    const deltaY = dragEvent.delta.y;
    const deltaX = dragEvent.delta.x;
    const minutesDelta = Math.round(deltaY / (HOUR_HEIGHT_PX / 60) / 15) * 15;
    const dayDelta = Math.round(
      deltaX / Math.max(dragEvent.active.rect.current.translated?.width ?? 120, 80),
    );
    const startAt = (activeData.startAt as number) + minutesDelta * 60_000 + dayDelta * DAY_MS;
    const duration = Math.max(
      (activeData.endAt as number) - (activeData.startAt as number),
      MIN_EVENT_DURATION_MS,
    );
    const endAt = startAt + duration;
    const eventId = activeData.eventId as string;
    const multi =
      selectedEventIds && selectedEventIds.has(eventId) && selectedEventIds.size > 1
        ? [...selectedEventIds]
        : undefined;
    onMoveEvent?.(activeData.taskId as string, startAt, endAt, multi);
  };

  const rangeLabel = formatRangeLabel(days[0]!, days[6]!);

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div
        role="grid"
        aria-label={`Week calendar, ${rangeLabel}`}
        className={cn('flex h-full min-h-0 flex-col bg-surface-base', className)}
      >
        <WeekHeader days={days} now={now} gutterWidthPx={GUTTER} onSelectDay={onSelectDay} />
        <div ref={scrollRef} className="relative min-h-0 flex-1 overflow-auto">
          <div
            className="relative grid"
            style={{
              gridTemplateColumns: `${GUTTER}px repeat(7, minmax(0, 1fr))`,
              height: 24 * HOUR_HEIGHT_PX,
            }}
          >
            <div className="relative border-r border-border-subtle">
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="relative border-b border-border-subtle"
                  style={{ height: HOUR_HEIGHT_PX }}
                >
                  <Text
                    as="span"
                    variant="caption"
                    muted
                    className="absolute -top-2 right-2 tabular-nums"
                  >
                    {String(hour).padStart(2, '0')}:00
                  </Text>
                </div>
              ))}
            </div>

            {days.map((day) => {
              const dayEvents = eventsOnDay(events, day).filter((event) => !event.allDay);
              const layout = layoutOverlaps(dayEvents);
              const dayStart = startOfDay(day);
              const showNow = isToday(day, now);
              const nowTop =
                ((new Date(now).getHours() * 60 + new Date(now).getMinutes()) / 60) *
                HOUR_HEIGHT_PX;

              return (
                <div
                  key={toDateIso(day)}
                  role="gridcell"
                  aria-label={`${new Date(day).toLocaleDateString()}, ${dayEvents.length} events`}
                  className="relative border-r border-border-subtle"
                  data-date={toDateIso(day)}
                >
                  {hours.map((hour) => (
                    <button
                      key={hour}
                      type="button"
                      aria-label={`Create at ${String(hour).padStart(2, '0')}:00`}
                      className="absolute inset-x-0 border-b border-border-subtle/80 hover:bg-state-hover/40 focus-visible:bg-state-hover/60 focus-visible:outline-none"
                      style={{ top: hour * HOUR_HEIGHT_PX, height: HOUR_HEIGHT_PX }}
                      onClick={() => onCreateAt?.(day, hour)}
                    />
                  ))}

                  {showNow ? (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 z-[2] border-t border-danger"
                      style={{ top: nowTop }}
                    >
                      <span className="absolute -left-1 -top-1 size-2 rounded-full bg-danger" />
                    </div>
                  ) : null}

                  {dayEvents.map((event) => {
                    const geo = eventBlockGeometry(event, dayStart);
                    const pos = layout.get(event.id) ?? { leftPct: 0, widthPct: 100 };
                    return (
                      <TaskEvent
                        key={event.id}
                        event={event}
                        topPx={geo.topPx}
                        heightPx={geo.heightPx}
                        leftPct={pos.leftPct}
                        widthPct={pos.widthPct}
                        selected={selectedEventIds?.has(event.id)}
                        dimmed={dimPastEvents && event.completed}
                        onOpen={onOpenEvent}
                        onSelect={onSelectEvent}
                        onPickup={onPickupEvent}
                        onResize={onResize}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {announcement}
        </div>
      </div>
    </DndContext>
  );
};

export type { WeekViewProps };
