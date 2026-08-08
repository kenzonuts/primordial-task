import type { ReactElement } from 'react';

import { Inline } from '@shared/ui/layout/inline';
import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import { Skeleton } from '@shared/ui/primitives/skeleton';

type AnalyticsSkeletonProps = {
  readonly variant?: 'dashboard' | 'kpi' | 'chart' | 'table';
  readonly className?: string;
};

const KpiSkeleton = (): ReactElement => (
  <div className="rounded-lg border border-border-default bg-surface-card p-4 shadow-sm">
    <Stack gap={12}>
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-9 w-28" />
      <Skeleton className="h-3 w-16" />
    </Stack>
  </div>
);

const ChartSkeleton = (): ReactElement => (
  <div className="rounded-lg border border-border-default bg-surface-card p-4 shadow-sm">
    <Stack gap={16}>
      <Inline gap={12} align="center" justify="between">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-7 w-20" />
      </Inline>
      <Skeleton className="h-[220px] w-full" />
    </Stack>
  </div>
);

const TableSkeleton = (): ReactElement => (
  <div className="rounded-lg border border-border-default bg-surface-card p-4 shadow-sm">
    <Stack gap={8}>
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-5/6" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-4/5" />
    </Stack>
  </div>
);

export const AnalyticsSkeleton = ({
  variant = 'dashboard',
  className,
}: AnalyticsSkeletonProps): ReactElement => {
  if (variant === 'kpi') {
    return (
      <div role="status" aria-busy="true" aria-label="Loading metrics" className={cn(className)}>
        <KpiSkeleton />
        <span className="sr-only">Loading…</span>
      </div>
    );
  }

  if (variant === 'chart') {
    return (
      <div role="status" aria-busy="true" aria-label="Loading chart" className={cn(className)}>
        <ChartSkeleton />
        <span className="sr-only">Loading…</span>
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div role="status" aria-busy="true" aria-label="Loading table" className={cn(className)}>
        <TableSkeleton />
        <span className="sr-only">Loading…</span>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading analytics"
      className={cn('flex flex-col gap-4', className)}
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiSkeleton />
        <KpiSkeleton />
        <KpiSkeleton />
        <KpiSkeleton />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
      <ChartSkeleton />
      <span className="sr-only">Loading analytics…</span>
    </div>
  );
};

export type { AnalyticsSkeletonProps };
