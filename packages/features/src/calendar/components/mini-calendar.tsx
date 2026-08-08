import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ReactElement } from 'react';

import { WEEKDAY_LABELS_MON, WEEKDAY_LABELS_SHORT } from '@features/calendar/constants';
import {
  addMonths,
  buildMonthGrid,
  formatMonthYear,
  isSameDay,
  isToday,
  startOfDay,
  startOfMonth,
} from '@features/calendar/utils/date-utils';
import { Inline } from '@shared/ui/layout/inline';
import { cn } from '@shared/ui/lib/cn';
import { IconButton } from '@shared/ui/primitives/icon-button';
import { Text } from '@shared/ui/typography/text';

type MiniCalendarProps = {
  readonly value: number;
  readonly selectedDate?: number | null;
  readonly weekStartsOn?: 0 | 1;
  readonly eventDates?: ReadonlySet<string>;
  readonly onChange?: (dateMs: number) => void;
  readonly onMonthChange?: (anchorMs: number) => void;
  readonly className?: string;
};

export const MiniCalendar = ({
  value,
  selectedDate = null,
  weekStartsOn = 1,
  eventDates,
  onChange,
  onMonthChange,
  className,
}: MiniCalendarProps): ReactElement => {
  const anchor = startOfMonth(value);
  const cells = buildMonthGrid(anchor, weekStartsOn);
  const labels = weekStartsOn === 1 ? WEEKDAY_LABELS_MON : WEEKDAY_LABELS_SHORT;
  const now = Date.now();

  return (
    <div role="group" aria-label="Mini calendar" className={cn('w-full select-none', className)}>
      <Inline align="center" justify="between" className="mb-2 px-0.5">
        <IconButton
          type="button"
          size="sm"
          variant="ghost"
          aria-label="Previous month"
          onClick={() => onMonthChange?.(addMonths(anchor, -1))}
        >
          <ChevronLeft aria-hidden="true" />
        </IconButton>
        <Text variant="body-sm" className="font-medium">
          {formatMonthYear(anchor)}
        </Text>
        <IconButton
          type="button"
          size="sm"
          variant="ghost"
          aria-label="Next month"
          onClick={() => onMonthChange?.(addMonths(anchor, 1))}
        >
          <ChevronRight aria-hidden="true" />
        </IconButton>
      </Inline>

      <div className="mb-1 grid grid-cols-7 gap-0.5">
        {labels.map((label) => (
          <Text
            key={label}
            as="span"
            variant="caption"
            muted
            className="text-center uppercase tracking-wide"
          >
            {label.slice(0, 2)}
          </Text>
        ))}
      </div>

      <div role="grid" aria-label={formatMonthYear(anchor)} className="grid grid-cols-7 gap-0.5">
        {cells.map((cell) => {
          const today = isToday(cell.date, now);
          const selected = selectedDate != null && isSameDay(selectedDate, cell.date);
          const hasEvents = eventDates?.has(cell.iso) ?? false;

          return (
            <button
              key={cell.iso}
              type="button"
              role="gridcell"
              aria-selected={selected}
              aria-current={today ? 'date' : undefined}
              onClick={() => {
                onChange?.(startOfDay(cell.date));
                if (!cell.inCurrentMonth) {
                  onMonthChange?.(startOfMonth(cell.date));
                }
              }}
              className={cn(
                'relative flex size-8 items-center justify-center rounded-md text-xs tabular-nums',
                'text-text-secondary hover:bg-state-hover hover:text-text-primary',
                'focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-1',
                'focus-visible:outline-[var(--state-focus)]',
                !cell.inCurrentMonth && 'text-text-muted opacity-50',
                selected && 'bg-state-selected text-text-primary',
                today && !selected && 'ring-1 ring-border-strong',
                today && selected && 'bg-text-primary text-bg-app hover:bg-text-primary',
              )}
            >
              {new Date(cell.date).getDate()}
              {hasEvents ? (
                <span
                  aria-hidden="true"
                  className="absolute bottom-0.5 size-1 rounded-full bg-text-muted"
                />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export type { MiniCalendarProps };
