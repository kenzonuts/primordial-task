import type { ReactElement } from 'react';

import type { CalendarEvent, DaySummary } from '@features/calendar/types';
import { formatDayLabel, formatTime, isToday } from '@features/calendar/utils/date-utils';
import { TaskPriorityBadge } from '@features/task/components/task-priority-badge';
import { TaskStatusBadge } from '@features/task/components/task-status-badge';
import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import { Text } from '@shared/ui/typography/text';

type DaySummaryPanelProps = {
  readonly summary: DaySummary;
  readonly onOpenEvent?: (event: CalendarEvent) => void;
  readonly onCreateAt?: (dateMs: number) => void;
  readonly className?: string;
};

/**
 * Compact day summary for the utility / inspector panel.
 * Opens Task Detail via onOpenEvent — does not embed TaskDetail UI.
 */
export const DaySummaryPanel = ({
  summary,
  onOpenEvent,
  onCreateAt,
  className,
}: DaySummaryPanelProps): ReactElement => {
  const today = isToday(summary.date);

  return (
    <aside
      aria-label={`Day summary for ${formatDayLabel(summary.date)}`}
      className={cn('flex h-full min-h-0 flex-col bg-surface-elevated', className)}
    >
      <header className="shrink-0 border-b border-border-subtle px-4 py-3">
        <Text as="h2" variant="h4">
          {formatDayLabel(summary.date)}
          {today ? ' · Today' : ''}
        </Text>
        <Text variant="caption" muted className="mt-1 block">
          {summary.eventCount} event{summary.eventCount === 1 ? '' : 's'}
          {summary.overdueCount > 0 ? ` · ${summary.overdueCount} overdue` : ''}
          {summary.completedCount > 0 ? ` · ${summary.completedCount} done` : ''}
        </Text>
      </header>

      <div className="min-h-0 flex-1 overflow-auto p-3">
        {summary.events.length === 0 ? (
          <Stack gap={8} className="items-start py-4">
            <Text variant="body-sm" muted>
              No events this day.
            </Text>
            {onCreateAt ? (
              <button
                type="button"
                onClick={() => onCreateAt(summary.date)}
                className={cn(
                  'rounded-md border border-border-default px-3 py-1.5 text-sm text-text-primary',
                  'hover:bg-state-hover focus-visible:outline-none',
                  'focus-visible:outline-2 focus-visible:outline-offset-2',
                  'focus-visible:outline-[var(--state-focus)]',
                )}
              >
                Quick create
              </button>
            ) : null}
          </Stack>
        ) : (
          <ul className="flex flex-col gap-1">
            {summary.events.map((event) => (
              <li key={event.id}>
                <button
                  type="button"
                  onClick={() => onOpenEvent?.(event)}
                  className={cn(
                    'flex w-full flex-col gap-1 rounded-md border border-transparent px-2 py-2 text-left',
                    'hover:border-border-subtle hover:bg-state-hover',
                    'focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-1',
                    'focus-visible:outline-[var(--state-focus)]',
                    event.isOverdue && !event.completed && 'border-danger/30',
                  )}
                >
                  <Text as="span" variant="body-sm" className="font-medium" truncate>
                    {event.title}
                  </Text>
                  <Text as="span" variant="caption" muted>
                    {event.allDay
                      ? 'All day'
                      : `${formatTime(event.startAt)} – ${formatTime(event.endAt)}`}
                    {event.projectName ? ` · ${event.projectName}` : ''}
                  </Text>
                  <div className="flex flex-wrap gap-1">
                    <TaskStatusBadge status={event.status} size="sm" />
                    <TaskPriorityBadge priority={event.priority} size="sm" />
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
};

export type { DaySummaryPanelProps };
