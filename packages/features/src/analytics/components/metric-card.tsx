import type { KeyboardEvent, ReactElement } from 'react';

import { MetricComparison } from '@features/analytics/components/metric-comparison';
import type { MetricResult } from '@features/analytics/types';
import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@shared/ui/overlays/tooltip';
import { Skeleton } from '@shared/ui/primitives/skeleton';
import { Text } from '@shared/ui/typography/text';

type MetricCardProps = {
  readonly metric?: MetricResult | null;
  readonly loading?: boolean;
  readonly onClick?: (metricId: string) => void;
  readonly className?: string;
};

export const MetricCard = ({
  metric,
  loading = false,
  onClick,
  className,
}: MetricCardProps): ReactElement => {
  if (loading) {
    return (
      <div
        className={cn(
          'rounded-lg border border-border-default bg-surface-card p-4 shadow-sm',
          className,
        )}
        role="status"
        aria-busy="true"
        aria-label="Loading metric"
      >
        <Stack gap={12}>
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-3 w-16" />
        </Stack>
      </div>
    );
  }

  if (!metric || metric.value === null) {
    return (
      <div
        className={cn(
          'rounded-lg border border-border-default bg-surface-card p-4 shadow-sm',
          className,
        )}
        role="status"
      >
        <Stack gap={8}>
          <Text as="p" variant="label" muted>
            {metric?.name ?? 'Metric'}
          </Text>
          <Text as="p" variant="mono" className="text-2xl text-text-muted">
            —
          </Text>
          <Text as="p" variant="caption" muted>
            {metric?.unavailableReason ?? 'No data for this range'}
          </Text>
        </Stack>
      </div>
    );
  }

  const interactive = typeof onClick === 'function';

  const handleActivate = (): void => {
    onClick?.(metric.id);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (!interactive) {
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleActivate();
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            role={interactive ? 'button' : undefined}
            tabIndex={interactive ? 0 : undefined}
            aria-label={`${metric.name}: ${metric.formatted}. ${metric.description}`}
            onClick={interactive ? handleActivate : undefined}
            onKeyDown={interactive ? handleKeyDown : undefined}
            className={cn(
              'rounded-lg border border-border-default bg-surface-card p-4 shadow-sm outline-none',
              interactive &&
                'cursor-pointer ds-transition-fast hover:border-border-strong hover:bg-state-hover focus-visible:ds-focus-ring',
              className,
            )}
          >
            <Stack gap={8}>
              <Text as="p" variant="label" muted>
                {metric.name}
              </Text>
              <Text
                as="p"
                variant="mono"
                className="text-[28px] leading-9 font-medium tabular-nums tracking-tight text-text-primary"
              >
                {metric.formatted}
              </Text>
              <MetricComparison comparison={metric.comparison} />
            </Stack>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">{metric.description}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export type { MetricCardProps };
