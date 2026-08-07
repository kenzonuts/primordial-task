import type { ReactElement } from 'react';

import type { KanbanBoardStatistics } from '@features/kanban/types';
import { Inline } from '@shared/ui/layout/inline';
import { cn } from '@shared/ui/lib/cn';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@shared/ui/overlays/tooltip';
import { Text } from '@shared/ui/typography/text';

type KanbanStatisticsProps = {
  readonly statistics: KanbanBoardStatistics;
  readonly columnNames?: Readonly<Record<string, string>>;
  readonly onMetricClick?: (metric: 'completion' | 'blocked' | 'overdue' | 'column') => void;
  readonly className?: string;
};

const Metric = ({
  label,
  value,
  hint,
  onClick,
}: {
  readonly label: string;
  readonly value: string;
  readonly hint: string;
  readonly onClick?: () => void;
}): ReactElement => {
  const content = (
    <button
      type="button"
      disabled={!onClick}
      onClick={onClick}
      className={cn(
        'flex min-w-[100px] flex-col gap-1 rounded-md border border-border-subtle bg-surface-elevated px-3 py-2 text-left',
        'outline-none ds-transition-fast',
        onClick && 'hover:bg-state-hover focus-visible:ds-focus-ring cursor-pointer',
        !onClick && 'cursor-default',
      )}
    >
      <Text as="span" variant="caption" muted className="uppercase tracking-wide">
        {label}
      </Text>
      <Text as="span" variant="body-sm" className="font-semibold tabular-nums">
        {value}
      </Text>
    </button>
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>{content}</TooltipTrigger>
      <TooltipContent side="bottom">{hint}</TooltipContent>
    </Tooltip>
  );
};

export const KanbanStatistics = ({
  statistics,
  columnNames = {},
  onMetricClick,
  className,
}: KanbanStatisticsProps): ReactElement => {
  const columnSummary = Object.entries(statistics.tasksPerColumn)
    .map(([columnId, count]) => `${columnNames[columnId] ?? columnId}: ${count}`)
    .join(' · ');

  return (
    <TooltipProvider delayDuration={300}>
      <div
        role="region"
        aria-label="Board statistics"
        className={cn(
          'flex h-auto min-h-10 flex-wrap items-center gap-8 border-b border-border-subtle px-4 py-2',
          className,
        )}
      >
        <Inline gap={8} align="center" className="flex-wrap">
          <Metric
            label="Visible"
            value={String(statistics.totalVisible)}
            hint="Tasks visible under current filters"
            onClick={onMetricClick ? () => onMetricClick('column') : undefined}
          />
          <Metric
            label="Completion"
            value={`${Math.round(statistics.completionRate * 100)}%`}
            hint="Completed tasks divided by active tasks"
            onClick={onMetricClick ? () => onMetricClick('completion') : undefined}
          />
          <Metric
            label="Blocked"
            value={String(statistics.blockedCount)}
            hint="Tasks blocked by status or dependency"
            onClick={onMetricClick ? () => onMetricClick('blocked') : undefined}
          />
          <Metric
            label="Overdue"
            value={String(statistics.overdueCount)}
            hint="Incomplete tasks past their due date"
            onClick={onMetricClick ? () => onMetricClick('overdue') : undefined}
          />
        </Inline>

        {columnSummary ? (
          <Text
            as="p"
            variant="caption"
            muted
            className="min-w-0 flex-1 truncate"
            title={columnSummary}
          >
            {columnSummary}
          </Text>
        ) : null}
      </div>
    </TooltipProvider>
  );
};

export type { KanbanStatisticsProps };
