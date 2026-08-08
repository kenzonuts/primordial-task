import type { ReactElement } from 'react';

import type { WorkloadCell } from '@features/analytics/types';
import { cn } from '@shared/ui/lib/cn';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@shared/ui/overlays/tooltip';
import { Text } from '@shared/ui/typography/text';

type HeatmapProps = {
  readonly cells: readonly WorkloadCell[];
  readonly className?: string;
  readonly onCellClick?: (cell: WorkloadCell) => void;
};

const LOAD_COLORS = [
  'bg-[#1C1C1C]',
  'bg-[#333333]',
  'bg-[#525252]',
  'bg-[#737373]',
  'bg-[#A3A3A3]',
  'bg-[#E6E6E6]',
] as const;

const intensityClass = (load: number, maxLoad: number): string => {
  if (maxLoad <= 0 || load <= 0) {
    return LOAD_COLORS[0]!;
  }
  const ratio = Math.min(1, load / maxLoad);
  const index = Math.min(LOAD_COLORS.length - 1, Math.ceil(ratio * (LOAD_COLORS.length - 1)));
  return LOAD_COLORS[index]!;
};

export const Heatmap = ({ cells, className, onCellClick }: HeatmapProps): ReactElement => {
  const members = Array.from(
    new Map(cells.map((cell) => [cell.memberId, cell.memberName])).entries(),
  );
  const days = Array.from(new Set(cells.map((cell) => cell.dayKey))).sort();
  const maxLoad = cells.reduce((max, cell) => Math.max(max, cell.load), 0);
  const cellMap = new Map(cells.map((cell) => [`${cell.memberId}:${cell.dayKey}`, cell]));

  if (members.length === 0 || days.length === 0) {
    return (
      <div
        role="status"
        className={cn(
          'flex min-h-[160px] items-center justify-center rounded-lg border border-border-subtle',
          className,
        )}
      >
        <Text as="p" variant="body-sm" muted>
          No workload data
        </Text>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div
        className={cn('w-full overflow-x-auto', className)}
        role="grid"
        aria-label="Workload heatmap"
      >
        <div
          className="inline-grid min-w-full gap-1"
          style={{
            gridTemplateColumns: `minmax(120px, 1.2fr) repeat(${days.length}, minmax(28px, 1fr))`,
          }}
        >
          <div className="sticky left-0 bg-surface-card" aria-hidden="true" />
          {days.map((day) => (
            <Text
              key={day}
              as="div"
              variant="caption"
              muted
              className="truncate px-0.5 text-center tabular-nums"
              title={day}
            >
              {day.slice(-5)}
            </Text>
          ))}

          {members.map(([memberId, memberName]) => (
            <div key={memberId} className="contents" role="row">
              <Text
                as="div"
                variant="caption"
                className="sticky left-0 truncate bg-surface-card pr-2 text-text-secondary"
                title={memberName}
              >
                {memberName}
              </Text>
              {days.map((day) => {
                const cell = cellMap.get(`${memberId}:${day}`);
                const load = cell?.load ?? 0;
                const interactive = cell && onCellClick;

                const button = (
                  <button
                    type="button"
                    disabled={!interactive}
                    onClick={() => cell && onCellClick?.(cell)}
                    aria-label={`${memberName}, ${day}: load ${load}`}
                    className={cn(
                      'h-7 w-full rounded-sm border border-border-subtle outline-none',
                      intensityClass(load, maxLoad),
                      interactive &&
                        'cursor-pointer focus-visible:ds-focus-ring hover:brightness-110',
                      !interactive && 'cursor-default',
                    )}
                  />
                );

                return (
                  <Tooltip key={`${memberId}-${day}`}>
                    <TooltipTrigger asChild>{button}</TooltipTrigger>
                    <TooltipContent>
                      {memberName} · {day}: {load}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
};

export type { HeatmapProps };
