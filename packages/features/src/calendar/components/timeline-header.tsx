import type { ReactElement } from 'react';

import { TIMELINE_ZOOM_LABELS } from '@features/calendar/constants';
import type { TimelineZoomLevel } from '@features/calendar/types';
import {
  addDays,
  formatMonthYear,
  toDateIso,
  timelineColumnWidth,
  timelineSpanDays,
} from '@features/calendar/utils/date-utils';
import { Inline } from '@shared/ui/layout/inline';
import { cn } from '@shared/ui/lib/cn';
import { Button } from '@shared/ui/primitives/button';
import { Text } from '@shared/ui/typography/text';

type TimelineHeaderProps = {
  readonly zoom: TimelineZoomLevel;
  readonly rangeStart: number;
  readonly labelWidthPx?: number;
  readonly onZoomChange?: (zoom: TimelineZoomLevel) => void;
  readonly className?: string;
};

const ZOOM_ORDER: readonly TimelineZoomLevel[] = ['day', 'week', 'month', 'quarter'];

export const TimelineHeader = ({
  zoom,
  rangeStart,
  labelWidthPx = 180,
  onZoomChange,
  className,
}: TimelineHeaderProps): ReactElement => {
  const colWidth = timelineColumnWidth(zoom);
  const span = timelineSpanDays(zoom);
  const ticks = Array.from({ length: span }, (_, index) => addDays(rangeStart, index));

  return (
    <div
      className={cn(
        'sticky top-0 z-10 flex border-b border-border-default bg-surface-elevated',
        className,
      )}
    >
      <div
        className="flex shrink-0 flex-col justify-center gap-1 border-r border-border-subtle px-3 py-2"
        style={{ width: labelWidthPx }}
      >
        <Text variant="caption" muted>
          {formatMonthYear(rangeStart)}
        </Text>
        <Inline gap={4} role="group" aria-label="Timeline zoom">
          {ZOOM_ORDER.map((level) => (
            <Button
              key={level}
              type="button"
              size="sm"
              variant={zoom === level ? 'secondary' : 'ghost'}
              aria-pressed={zoom === level}
              className={cn('h-6 px-2 text-[11px]', zoom === level && 'bg-state-selected')}
              onClick={() => onZoomChange?.(level)}
            >
              {TIMELINE_ZOOM_LABELS[level]}
            </Button>
          ))}
        </Inline>
      </div>

      <div className="relative min-w-0 flex-1 overflow-hidden">
        <div className="flex" style={{ width: span * colWidth }}>
          {ticks.map((tick, index) => {
            const date = new Date(tick);
            const showLabel =
              zoom === 'day' ||
              (zoom === 'week' && date.getDay() === 1) ||
              (zoom === 'month' && date.getDate() === 1) ||
              (zoom === 'quarter' && date.getDate() === 1 && index % 7 === 0);
            return (
              <div
                key={toDateIso(tick)}
                className="shrink-0 border-r border-border-subtle/60 px-0.5 py-2"
                style={{ width: colWidth }}
              >
                {showLabel ? (
                  <Text as="span" variant="caption" muted className="block truncate tabular-nums">
                    {date.toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Text>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export type { TimelineHeaderProps };
