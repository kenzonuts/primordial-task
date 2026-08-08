import { useDroppable } from '@dnd-kit/core';
import type { KeyboardEvent, MouseEvent, ReactElement } from 'react';
import { memo, useState } from 'react';

import { TaskChip } from '@features/calendar/components/task-chip';
import type { CalendarEvent } from '@features/calendar/types';
import { formatDayLabel, isToday, toDateIso } from '@features/calendar/utils/date-utils';
import { cn } from '@shared/ui/lib/cn';
import { Popover, PopoverContent, PopoverTrigger } from '@shared/ui/overlays/popover';
import { Button } from '@shared/ui/primitives/button';
import { Text } from '@shared/ui/typography/text';

type DateCellProps = {
  readonly date: number;
  readonly inCurrentMonth?: boolean;
  readonly events: readonly CalendarEvent[];
  readonly maxVisible?: number;
  readonly selected?: boolean;
  readonly weekend?: boolean;
  readonly selectedEventIds?: ReadonlySet<string>;
  readonly dimPast?: boolean;
  readonly now?: number;
  readonly onSelectDate?: (dateMs: number) => void;
  readonly onOpenEvent?: (event: CalendarEvent) => void;
  readonly onSelectEvent?: (event: CalendarEvent, nativeEvent: MouseEvent | KeyboardEvent) => void;
  readonly onPickupEvent?: (event: CalendarEvent) => void;
  readonly onCreateAt?: (dateMs: number) => void;
  readonly className?: string;
};

const DateCellComponent = ({
  date,
  inCurrentMonth = true,
  events,
  maxVisible = 3,
  selected = false,
  weekend = false,
  selectedEventIds,
  dimPast = true,
  now = Date.now(),
  onSelectDate,
  onOpenEvent,
  onSelectEvent,
  onPickupEvent,
  onCreateAt,
  className,
}: DateCellProps): ReactElement => {
  const iso = toDateIso(date);
  const today = isToday(date, now);
  const dayNumber = new Date(date).getDate();
  const overflow = Math.max(0, events.length - maxVisible);
  const visible = events.slice(0, maxVisible);
  const [overflowOpen, setOverflowOpen] = useState(false);

  const { setNodeRef, isOver } = useDroppable({
    id: `date-cell-${iso}`,
    data: {
      type: 'date-cell',
      dateMs: date,
      iso,
    },
  });

  const past = dimPast && date < now && !today;

  return (
    <div
      ref={setNodeRef}
      role="gridcell"
      aria-selected={selected}
      aria-label={`${formatDayLabel(date)}, ${events.length} event${events.length === 1 ? '' : 's'}`}
      data-date={iso}
      className={cn(
        'group relative flex min-h-0 min-w-0 flex-col gap-0.5 border-b border-r border-border-subtle p-1',
        'bg-surface-base',
        !inCurrentMonth && 'bg-surface-elevated/40 text-text-muted',
        weekend && inCurrentMonth && 'bg-surface-elevated/20',
        today && 'bg-state-selected/40',
        selected && 'ring-1 ring-inset ring-[var(--state-focus)]',
        isOver && 'bg-state-hover ring-1 ring-inset ring-border-strong',
        past && 'opacity-80',
        className,
      )}
      onClick={() => onSelectDate?.(date)}
      onDoubleClick={() => onCreateAt?.(date)}
    >
      <div className="flex items-center justify-between gap-1 px-0.5">
        <button
          type="button"
          onClick={(nativeEvent) => {
            nativeEvent.stopPropagation();
            onSelectDate?.(date);
          }}
          aria-current={today ? 'date' : undefined}
          className={cn(
            'inline-flex size-6 items-center justify-center rounded-full text-xs tabular-nums',
            'text-text-secondary hover:bg-state-hover hover:text-text-primary',
            'focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-1',
            'focus-visible:outline-[var(--state-focus)]',
            today && 'bg-text-primary font-medium text-bg-app hover:bg-text-primary',
            !inCurrentMonth && 'text-text-muted',
          )}
        >
          {dayNumber}
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-hidden">
        {visible.map((event) => (
          <TaskChip
            key={event.id}
            event={event}
            selected={selectedEventIds?.has(event.id)}
            dimmed={dimPast && event.completed}
            onOpen={onOpenEvent}
            onSelect={onSelectEvent}
            onPickup={onPickupEvent}
          />
        ))}

        {overflow > 0 ? (
          <Popover open={overflowOpen} onOpenChange={setOverflowOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-5 justify-start px-1 text-[11px] text-text-muted"
                onClick={(nativeEvent) => nativeEvent.stopPropagation()}
                aria-label={`Show ${overflow} more events on ${formatDayLabel(date)}`}
              >
                +{overflow} more
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-64 p-2">
              <Text variant="caption" className="mb-2 px-1 font-medium">
                {formatDayLabel(date)}
              </Text>
              <div className="flex max-h-64 flex-col gap-1 overflow-auto">
                {events.map((event) => (
                  <TaskChip
                    key={event.id}
                    event={event}
                    selected={selectedEventIds?.has(event.id)}
                    onOpen={(item) => {
                      setOverflowOpen(false);
                      onOpenEvent?.(item);
                    }}
                    onSelect={onSelectEvent}
                    onPickup={onPickupEvent}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>
        ) : null}
      </div>
    </div>
  );
};

export const DateCell = memo(DateCellComponent);
DateCell.displayName = 'DateCell';

export type { DateCellProps };
