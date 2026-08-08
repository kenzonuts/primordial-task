import type { KeyboardEvent, MouseEvent, ReactElement } from 'react';
import { memo } from 'react';

import type { CalendarEvent, TimelineRowModel } from '@features/calendar/types';
import type { TimelineZoomLevel } from '@features/calendar/types';
import { startOfDay, timelineColumnWidth } from '@features/calendar/utils/date-utils';
import { cn } from '@shared/ui/lib/cn';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@shared/ui/overlays/tooltip';
import { Text } from '@shared/ui/typography/text';

type TimelineRowProps = {
  readonly row: TimelineRowModel;
  readonly rangeStart: number;
  readonly zoom: TimelineZoomLevel;
  readonly labelWidthPx?: number;
  readonly rowHeightPx?: number;
  readonly selectedEventIds?: ReadonlySet<string>;
  readonly onOpenEvent?: (event: CalendarEvent) => void;
  readonly onSelectEvent?: (event: CalendarEvent, nativeEvent: MouseEvent | KeyboardEvent) => void;
  readonly className?: string;
};

const MS_DAY = 24 * 60 * 60 * 1000;

const TimelineRowComponent = ({
  row,
  rangeStart,
  zoom,
  labelWidthPx = 180,
  rowHeightPx = 40,
  selectedEventIds,
  onOpenEvent,
  onSelectEvent,
  className,
}: TimelineRowProps): ReactElement => {
  const colWidth = timelineColumnWidth(zoom);
  const rangeStartDay = startOfDay(rangeStart);

  return (
    <div
      role="row"
      aria-label={row.label}
      className={cn('flex border-b border-border-subtle', className)}
      style={{ height: rowHeightPx }}
    >
      <div
        role="rowheader"
        className="flex shrink-0 items-center border-r border-border-subtle px-3"
        style={{ width: labelWidthPx }}
      >
        <Text variant="body-sm" truncate title={row.label}>
          {row.label}
        </Text>
      </div>

      <div className="relative min-w-0 flex-1">
        <TooltipProvider delayDuration={300}>
          {row.events.map((event) => {
            const startOffset = Math.max(0, (startOfDay(event.startAt) - rangeStartDay) / MS_DAY);
            const durationDays = Math.max(
              1,
              Math.ceil((startOfDay(event.endAt) - startOfDay(event.startAt)) / MS_DAY) + 1,
            );
            const left = startOffset * colWidth;
            const width = Math.max(durationDays * colWidth - 4, colWidth * 0.6);
            const selected = selectedEventIds?.has(event.id) ?? false;

            return (
              <Tooltip key={event.id}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    role="gridcell"
                    aria-label={`${event.title} in ${row.label}`}
                    onClick={(nativeEvent) => {
                      onSelectEvent?.(event, nativeEvent);
                      if (!nativeEvent.metaKey && !nativeEvent.ctrlKey && !nativeEvent.shiftKey) {
                        onOpenEvent?.(event);
                      }
                    }}
                    className={cn(
                      'absolute top-1.5 h-7 truncate rounded-md border px-1.5 text-left text-[11px]',
                      'border-border-default bg-surface-card text-text-primary',
                      'hover:bg-state-hover focus-visible:outline-none',
                      'focus-visible:outline-2 focus-visible:outline-offset-1',
                      'focus-visible:outline-[var(--state-focus)]',
                      selected && 'bg-state-selected ring-1 ring-[var(--state-focus)]',
                      event.completed && 'opacity-55',
                      event.isOverdue && !event.completed && 'border-danger/50',
                    )}
                    style={{ left, width }}
                  >
                    {event.title}
                  </button>
                </TooltipTrigger>
                <TooltipContent>{event.title}</TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </div>
    </div>
  );
};

export const TimelineRow = memo(TimelineRowComponent);
TimelineRow.displayName = 'TimelineRow';

export type { TimelineRowProps };
