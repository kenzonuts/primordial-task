import type { ReactElement } from 'react';

import { isToday, toDateIso } from '@features/calendar/utils/date-utils';
import { cn } from '@shared/ui/lib/cn';
import { Text } from '@shared/ui/typography/text';

type WeekHeaderProps = {
  readonly days: readonly number[];
  readonly now?: number;
  readonly gutterWidthPx?: number;
  readonly onSelectDay?: (dateMs: number) => void;
  readonly className?: string;
};

export const WeekHeader = ({
  days,
  now = Date.now(),
  gutterWidthPx = 56,
  onSelectDay,
  className,
}: WeekHeaderProps): ReactElement => {
  return (
    <div
      role="row"
      className={cn(
        'sticky top-0 z-10 grid border-b border-border-default bg-surface-elevated',
        className,
      )}
      style={{ gridTemplateColumns: `${gutterWidthPx}px repeat(${days.length}, minmax(0, 1fr))` }}
    >
      <div role="columnheader" className="border-r border-border-subtle" aria-hidden="true" />
      {days.map((day) => {
        const today = isToday(day, now);
        const weekday = new Date(day).toLocaleDateString(undefined, { weekday: 'short' });
        const dayNum = new Date(day).getDate();

        return (
          <button
            key={toDateIso(day)}
            type="button"
            role="columnheader"
            onClick={() => onSelectDay?.(day)}
            aria-current={today ? 'date' : undefined}
            className={cn(
              'flex h-12 flex-col items-center justify-center gap-0.5 border-r border-border-subtle',
              'hover:bg-state-hover focus-visible:outline-none',
              'focus-visible:outline-2 focus-visible:outline-offset-[-2px]',
              'focus-visible:outline-[var(--state-focus)]',
              today && 'bg-state-selected/50',
            )}
          >
            <Text as="span" variant="caption" muted className="uppercase tracking-wide">
              {weekday}
            </Text>
            <span
              className={cn(
                'inline-flex size-7 items-center justify-center rounded-full text-sm tabular-nums',
                today ? 'bg-text-primary font-medium text-bg-app' : 'text-text-primary',
              )}
            >
              {dayNum}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export type { WeekHeaderProps };
