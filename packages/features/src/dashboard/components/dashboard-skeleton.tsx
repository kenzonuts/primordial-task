import type { ReactElement } from 'react';

import { Inline } from '@shared/ui/layout/inline';
import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import { Skeleton } from '@shared/ui/primitives/skeleton';

type DashboardSkeletonProps = {
  readonly className?: string;
};

const WidgetSkeleton = (): ReactElement => {
  return (
    <div className="rounded-lg border border-border-default bg-surface-card p-4 shadow-sm">
      <Stack gap={16}>
        <Inline gap={12} align="center" justify="between">
          <Skeleton className="h-5 w-36" />
          <Inline gap={8}>
            <Skeleton rounded="full" className="size-7" />
            <Skeleton rounded="full" className="size-7" />
          </Inline>
        </Inline>
        <Stack gap={12}>
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-4/5" />
        </Stack>
      </Stack>
    </div>
  );
};

export const DashboardSkeleton = ({ className }: DashboardSkeletonProps): ReactElement => {
  return (
    <div
      role="status"
      aria-label="Loading dashboard"
      aria-busy="true"
      className={cn('flex flex-col gap-24', className)}
    >
      <Stack gap={12} className="w-full">
        <Skeleton className="h-8 w-64 max-w-full" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-72 max-w-full" />
        <Inline gap={8} className="mt-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-24" />
        </Inline>
      </Stack>

      <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
        <Stack gap={16}>
          <WidgetSkeleton />
          <WidgetSkeleton />
          <WidgetSkeleton />
        </Stack>
        <Stack gap={16}>
          <WidgetSkeleton />
          <WidgetSkeleton />
          <WidgetSkeleton />
        </Stack>
      </div>

      <span className="sr-only">Loading dashboard…</span>
    </div>
  );
};

export type { DashboardSkeletonProps };
