import { AlertTriangle, Star } from 'lucide-react';
import type { ReactElement } from 'react';
import { useMemo } from 'react';

import { MiniCalendar } from '@features/calendar/components/mini-calendar';
import { CALENDAR_SIDEBAR_WIDTH } from '@features/calendar/constants';
import type { CalendarEvent, CalendarFiltersState } from '@features/calendar/types';
import { formatDayLabel, formatTime, toDateIso } from '@features/calendar/utils/date-utils';
import { ScrollArea } from '@shared/ui/layout/scroll-area';
import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import { Text } from '@shared/ui/typography/text';

type CalendarSidebarProps = {
  readonly events: readonly CalendarEvent[];
  readonly upcoming: readonly CalendarEvent[];
  readonly overdue: readonly CalendarEvent[];
  readonly favorites: readonly CalendarEvent[];
  readonly filters?: CalendarFiltersState;
  readonly anchorDate: number;
  readonly selectedDate?: number | null;
  readonly weekStartsOn?: 0 | 1;
  readonly onSelectDate?: (dateMs: number) => void;
  readonly onMonthChange?: (anchorMs: number) => void;
  readonly onOpenEvent?: (event: CalendarEvent) => void;
  readonly className?: string;
};

const SidebarEventButton = ({
  event,
  onOpen,
  emphasize,
}: {
  readonly event: CalendarEvent;
  readonly onOpen?: (event: CalendarEvent) => void;
  readonly emphasize?: 'overdue' | 'favorite';
}): ReactElement => {
  return (
    <button
      type="button"
      onClick={() => onOpen?.(event)}
      className={cn(
        'flex w-full flex-col gap-0.5 rounded-md px-2 py-1.5 text-left',
        'hover:bg-state-hover focus-visible:outline-none',
        'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--state-focus)]',
      )}
    >
      <Text as="span" variant="caption" className="truncate font-medium">
        {event.title}
      </Text>
      <Text as="span" variant="caption" muted truncate>
        {formatDayLabel(event.startAt)}
        {!event.allDay ? ` · ${formatTime(event.startAt)}` : ''}
      </Text>
      {emphasize === 'overdue' ? <span className="sr-only">Overdue</span> : null}
    </button>
  );
};

const filterSummary = (filters?: CalendarFiltersState): string[] => {
  if (!filters) {
    return [];
  }
  const chips: string[] = [];
  if (filters.query.trim()) {
    chips.push(`Search: ${filters.query.trim()}`);
  }
  if (filters.favoritesOnly) {
    chips.push('Favorites');
  }
  if (filters.pinnedOnly) {
    chips.push('Pinned');
  }
  if (filters.overdueOnly) {
    chips.push('Overdue');
  }
  if (filters.completedOnly) {
    chips.push('Completed');
  }
  if (filters.statuses.length > 0) {
    chips.push(`${filters.statuses.length} status`);
  }
  if (filters.priorities.length > 0) {
    chips.push(`${filters.priorities.length} priority`);
  }
  if (filters.projectIds.length > 0) {
    chips.push(`${filters.projectIds.length} project`);
  }
  return chips;
};

export const CalendarSidebar = ({
  events,
  upcoming,
  overdue,
  favorites,
  filters,
  anchorDate,
  selectedDate = null,
  weekStartsOn = 1,
  onSelectDate,
  onMonthChange,
  onOpenEvent,
  className,
}: CalendarSidebarProps): ReactElement => {
  const eventDates = useMemo(() => {
    const set = new Set<string>();
    for (const event of events) {
      set.add(toDateIso(event.startAt));
      set.add(toDateIso(event.endAt));
    }
    return set;
  }, [events]);

  const summary = filterSummary(filters);

  return (
    <aside
      aria-label="Calendar sidebar"
      className={cn(
        'flex h-full min-h-0 flex-col border-r border-border-default bg-surface-sidebar',
        className,
      )}
      style={{ width: CALENDAR_SIDEBAR_WIDTH }}
    >
      <div className="shrink-0 border-b border-border-subtle p-3">
        <MiniCalendar
          value={anchorDate}
          selectedDate={selectedDate}
          weekStartsOn={weekStartsOn}
          eventDates={eventDates}
          onChange={onSelectDate}
          onMonthChange={onMonthChange}
        />
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <Stack gap={16} className="p-3">
          {summary.length > 0 ? (
            <section aria-label="Active filters">
              <Text variant="caption" muted className="mb-1.5 uppercase tracking-wide font-medium">
                Filters
              </Text>
              <div className="flex flex-wrap gap-1">
                {summary.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-md border border-border-subtle bg-surface-elevated px-1.5 py-0.5 text-[11px] text-text-secondary"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </section>
          ) : null}

          <section aria-label="Overdue">
            <div className="mb-1.5 flex items-center gap-1.5">
              <AlertTriangle className="size-3.5 text-danger" aria-hidden="true" />
              <Text variant="caption" muted className="uppercase tracking-wide font-medium">
                Overdue
              </Text>
              <Text variant="caption" muted>
                {overdue.length}
              </Text>
            </div>
            {overdue.length === 0 ? (
              <Text variant="caption" muted>
                None
              </Text>
            ) : (
              <Stack gap={2}>
                {overdue.slice(0, 6).map((event) => (
                  <SidebarEventButton
                    key={event.id}
                    event={event}
                    onOpen={onOpenEvent}
                    emphasize="overdue"
                  />
                ))}
              </Stack>
            )}
          </section>

          <section aria-label="Upcoming">
            <Text variant="caption" muted className="mb-1.5 uppercase tracking-wide font-medium">
              Upcoming
            </Text>
            {upcoming.length === 0 ? (
              <Text variant="caption" muted>
                Nothing upcoming
              </Text>
            ) : (
              <Stack gap={2}>
                {upcoming.map((event) => (
                  <SidebarEventButton key={event.id} event={event} onOpen={onOpenEvent} />
                ))}
              </Stack>
            )}
          </section>

          <section aria-label="Favorites">
            <div className="mb-1.5 flex items-center gap-1.5">
              <Star className="size-3.5 text-text-muted" aria-hidden="true" />
              <Text variant="caption" muted className="uppercase tracking-wide font-medium">
                Favorites
              </Text>
            </div>
            {favorites.length === 0 ? (
              <Text variant="caption" muted>
                No favorites
              </Text>
            ) : (
              <Stack gap={2}>
                {favorites.slice(0, 6).map((event) => (
                  <SidebarEventButton
                    key={event.id}
                    event={event}
                    onOpen={onOpenEvent}
                    emphasize="favorite"
                  />
                ))}
              </Stack>
            )}
          </section>
        </Stack>
      </ScrollArea>
    </aside>
  );
};

export type { CalendarSidebarProps };
