import type { KeyboardEvent, MouseEvent, ReactElement } from 'react';
import { useMemo, useRef } from 'react';

import { CalendarEmptyState } from '@features/calendar/components/calendar-empty-state';
import { TimelineHeader } from '@features/calendar/components/timeline-header';
import { TimelineRow } from '@features/calendar/components/timeline-row';
import type {
  CalendarDependencyIndicator,
  CalendarEvent,
  CalendarMilestone,
  TimelineRowModel,
  TimelineZoomLevel,
} from '@features/calendar/types';
import {
  addDays,
  startOfDay,
  startOfMonth,
  timelineColumnWidth,
  timelineSpanDays,
} from '@features/calendar/utils/date-utils';
import { cn } from '@shared/ui/lib/cn';

type TimelineProps = {
  readonly rows: readonly TimelineRowModel[];
  readonly zoom: TimelineZoomLevel;
  readonly anchorDate: number;
  readonly milestones?: readonly CalendarMilestone[];
  readonly dependencies?: readonly CalendarDependencyIndicator[];
  readonly selectedEventIds?: ReadonlySet<string>;
  readonly labelWidthPx?: number;
  readonly onZoomChange?: (zoom: TimelineZoomLevel) => void;
  readonly onOpenEvent?: (event: CalendarEvent) => void;
  readonly onSelectEvent?: (event: CalendarEvent, nativeEvent: MouseEvent | KeyboardEvent) => void;
  readonly onScrollLeftChange?: (value: number) => void;
  readonly className?: string;
};

const MS_DAY = 24 * 60 * 60 * 1000;
const LABEL_WIDTH = 180;

export const Timeline = ({
  rows,
  zoom,
  anchorDate,
  milestones = [],
  dependencies = [],
  selectedEventIds,
  labelWidthPx = LABEL_WIDTH,
  onZoomChange,
  onOpenEvent,
  onSelectEvent,
  onScrollLeftChange,
  className,
}: TimelineProps): ReactElement => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const rangeStart = startOfDay(startOfMonth(anchorDate));
  const colWidth = timelineColumnWidth(zoom);
  const span = timelineSpanDays(zoom);
  const totalWidth = span * colWidth;
  const now = Date.now();
  const todayOffset = (startOfDay(now) - rangeStart) / MS_DAY;
  const todayLeft = todayOffset * colWidth;

  const eventIndex = useMemo(() => {
    const map = new Map<string, { rowIndex: number; left: number; width: number }>();
    rows.forEach((row, rowIndex) => {
      for (const event of row.events) {
        const startOffset = Math.max(0, (startOfDay(event.startAt) - rangeStart) / MS_DAY);
        const durationDays = Math.max(
          1,
          Math.ceil((startOfDay(event.endAt) - startOfDay(event.startAt)) / MS_DAY) + 1,
        );
        map.set(event.taskId, {
          rowIndex,
          left: startOffset * colWidth,
          width: Math.max(durationDays * colWidth - 4, colWidth * 0.6),
        });
      }
    });
    return map;
  }, [rows, rangeStart, colWidth]);

  if (rows.length === 0 || rows.every((row) => row.events.length === 0)) {
    return <CalendarEmptyState variant="none" className={className} />;
  }

  return (
    <div
      role="grid"
      aria-label="Timeline"
      className={cn('flex h-full min-h-0 flex-col bg-surface-base', className)}
    >
      <TimelineHeader
        zoom={zoom}
        rangeStart={rangeStart}
        labelWidthPx={labelWidthPx}
        onZoomChange={onZoomChange}
      />

      <div
        ref={scrollRef}
        className="relative min-h-0 flex-1 overflow-auto"
        onScroll={(scrollEvent) => onScrollLeftChange?.(scrollEvent.currentTarget.scrollLeft)}
      >
        <div className="relative" style={{ minWidth: labelWidthPx + totalWidth }}>
          {todayOffset >= 0 && todayOffset <= span ? (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 top-0 z-[2] w-px bg-danger"
              style={{ left: labelWidthPx + todayLeft }}
            />
          ) : null}

          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[1] h-full"
            width={labelWidthPx + totalWidth}
            height={rows.length * 40}
          >
            {dependencies.map((dep) => {
              const from = eventIndex.get(dep.fromTaskId);
              const to = eventIndex.get(dep.toTaskId);
              if (!from || !to) {
                return null;
              }
              const x1 = labelWidthPx + from.left + from.width;
              const y1 = from.rowIndex * 40 + 20;
              const x2 = labelWidthPx + to.left;
              const y2 = to.rowIndex * 40 + 20;
              return (
                <line
                  key={dep.id}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={dep.soft ? 'var(--text-muted)' : 'var(--text-secondary)'}
                  strokeWidth={1}
                  strokeDasharray={dep.soft ? '4 3' : undefined}
                />
              );
            })}

            {milestones.map((milestone) => {
              const offset = (startOfDay(milestone.at) - rangeStart) / MS_DAY;
              if (offset < 0 || offset > span) {
                return null;
              }
              const x = labelWidthPx + offset * colWidth;
              const y = 12;
              return (
                <polygon
                  key={milestone.id}
                  points={`${x},${y} ${x + 6},${y + 6} ${x},${y + 12} ${x - 6},${y + 6}`}
                  fill="var(--text-primary)"
                >
                  <title>{milestone.title}</title>
                </polygon>
              );
            })}
          </svg>

          {rows.map((row) => (
            <TimelineRow
              key={row.id}
              row={row}
              rangeStart={rangeStart}
              zoom={zoom}
              labelWidthPx={labelWidthPx}
              selectedEventIds={selectedEventIds}
              onOpenEvent={onOpenEvent}
              onSelectEvent={onSelectEvent}
            />
          ))}

          {/* trailing spacer days for scroll extent */}
          <div aria-hidden="true" className="h-0" style={{ width: labelWidthPx + totalWidth }} />
          <div className="sr-only">
            Range through {new Date(addDays(rangeStart, span - 1)).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export type { TimelineProps };
