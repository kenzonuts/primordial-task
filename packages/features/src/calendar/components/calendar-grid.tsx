import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { KeyboardEvent, MouseEvent, ReactElement } from 'react';

import { DateCell } from '@features/calendar/components/date-cell';
import { MonthHeader } from '@features/calendar/components/month-header';
import { eventsOnDay } from '@features/calendar/services/calendar-service';
import type { CalendarEvent } from '@features/calendar/types';
import { buildMonthGrid, formatMonthYear, startOfDay } from '@features/calendar/utils/date-utils';
import { cn } from '@shared/ui/lib/cn';

type CalendarGridProps = {
  readonly anchorDate: number;
  readonly events: readonly CalendarEvent[];
  readonly weekStartsOn?: 0 | 1;
  readonly showWeekends?: boolean;
  readonly selectedDate?: number | null;
  readonly selectedEventIds?: ReadonlySet<string>;
  readonly dimPastEvents?: boolean;
  readonly maxEventsPerCell?: number;
  readonly announcement?: string | null;
  readonly onSelectDate?: (dateMs: number) => void;
  readonly onOpenEvent?: (event: CalendarEvent) => void;
  readonly onSelectEvent?: (event: CalendarEvent, nativeEvent: MouseEvent | KeyboardEvent) => void;
  readonly onPickupEvent?: (event: CalendarEvent) => void;
  readonly onCreateAt?: (dateMs: number) => void;
  readonly onMoveToDate?: (taskId: string, dateMs: number, eventIds?: readonly string[]) => void;
  readonly className?: string;
};

export const CalendarGrid = ({
  anchorDate,
  events,
  weekStartsOn = 1,
  showWeekends = true,
  selectedDate = null,
  selectedEventIds,
  dimPastEvents = true,
  maxEventsPerCell = 3,
  announcement = null,
  onSelectDate,
  onOpenEvent,
  onSelectEvent,
  onPickupEvent,
  onCreateAt,
  onMoveToDate,
  className,
}: CalendarGridProps): ReactElement => {
  const cells = buildMonthGrid(anchorDate, weekStartsOn);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  );

  const handleDragEnd = (dragEvent: DragEndEvent): void => {
    const over = dragEvent.over;
    if (!over) {
      return;
    }
    const overData = over.data.current;
    const activeData = dragEvent.active.data.current;
    if (overData?.type !== 'date-cell' || !activeData?.taskId) {
      return;
    }
    const dateMs = startOfDay(overData.dateMs as number);
    const taskId = activeData.taskId as string;
    const activeId = activeData.eventId as string | undefined;
    const multi =
      selectedEventIds && activeId && selectedEventIds.has(activeId) && selectedEventIds.size > 1
        ? [...selectedEventIds]
        : undefined;
    onMoveToDate?.(taskId, dateMs, multi);
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div
        role="grid"
        aria-label={`Month calendar, ${formatMonthYear(anchorDate)}`}
        className={cn('flex h-full min-h-0 flex-col bg-surface-base', className)}
      >
        <MonthHeader weekStartsOn={weekStartsOn} />
        <div role="rowgroup" className="grid min-h-0 flex-1 grid-cols-7 grid-rows-6">
          {cells.map((cell) => {
            const day = new Date(cell.date).getDay();
            const isWeekend = day === 0 || day === 6;
            if (!showWeekends && isWeekend) {
              return (
                <div
                  key={cell.iso}
                  role="gridcell"
                  aria-hidden="true"
                  className="border-b border-r border-border-subtle bg-surface-elevated/30"
                />
              );
            }
            return (
              <DateCell
                key={cell.iso}
                date={cell.date}
                inCurrentMonth={cell.inCurrentMonth}
                events={eventsOnDay(events, cell.date)}
                maxVisible={maxEventsPerCell}
                selected={selectedDate != null && startOfDay(selectedDate) === cell.date}
                weekend={isWeekend}
                selectedEventIds={selectedEventIds}
                dimPast={dimPastEvents}
                onSelectDate={onSelectDate}
                onOpenEvent={onOpenEvent}
                onSelectEvent={onSelectEvent}
                onPickupEvent={onPickupEvent}
                onCreateAt={onCreateAt}
              />
            );
          })}
        </div>
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {announcement}
        </div>
      </div>
    </DndContext>
  );
};

export type { CalendarGridProps };
