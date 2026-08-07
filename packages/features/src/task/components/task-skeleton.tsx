import type { ReactElement } from 'react';

import { Inline } from '@shared/ui/layout/inline';
import { cn } from '@shared/ui/lib/cn';
import { Skeleton } from '@shared/ui/primitives/skeleton';

type TaskSkeletonProps = {
  readonly count?: number;
  readonly variant?: 'table' | 'list';
  readonly className?: string;
};

const SkeletonListItem = (): ReactElement => {
  return (
    <div className="flex items-center gap-8 rounded-lg border border-border-subtle bg-surface-card px-3 py-2">
      <Skeleton className="size-4 shrink-0 rounded-sm" />
      <Skeleton rounded="full" className="size-7 shrink-0" />
      <Skeleton className="h-4 w-40" />
      <Skeleton className="hidden h-3 w-24 md:block" />
      <Skeleton className="hidden h-3 w-28 lg:block" />
      <Skeleton className="hidden h-5 w-16 sm:block" />
      <Skeleton className="ml-auto h-5 w-16" />
      <Inline gap={4} className="shrink-0">
        <Skeleton rounded="full" className="size-7" />
        <Skeleton rounded="full" className="size-7" />
      </Inline>
    </div>
  );
};

const SkeletonTable = ({ count }: { readonly count: number }): ReactElement => {
  const rows = Array.from({ length: count }, (_, index) => index);

  return (
    <div className="w-full overflow-hidden rounded-lg border border-border-default">
      <div className="border-b border-border-subtle bg-surface-elevated px-3 py-2.5">
        <Inline gap={12} align="center">
          <Skeleton className="size-4 shrink-0 rounded-sm" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="hidden h-3 w-20 md:block" />
          <Skeleton className="hidden h-3 w-20 lg:block" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="ml-auto h-3 w-12" />
        </Inline>
      </div>
      <div className="divide-y divide-border-subtle">
        {rows.map((index) => (
          <div key={index} className="flex items-center gap-12 px-3 py-2.5">
            <Skeleton className="size-4 shrink-0 rounded-sm" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="hidden h-3 w-24 md:block" />
            <Skeleton className="hidden h-3 w-28 lg:block" />
            <Skeleton className="h-5 w-14" />
            <Skeleton className="h-5 w-16" />
            <Skeleton className="ml-auto hidden h-3 w-16 xl:block" />
            <Inline gap={4}>
              <Skeleton rounded="full" className="size-7" />
              <Skeleton rounded="full" className="size-7" />
            </Inline>
          </div>
        ))}
      </div>
    </div>
  );
};

export const TaskSkeleton = ({
  count = 6,
  variant = 'list',
  className,
}: TaskSkeletonProps): ReactElement => {
  const items = Array.from({ length: count }, (_, index) => index);

  if (variant === 'table') {
    return (
      <div role="status" aria-label="Loading tasks" aria-busy="true" className={cn(className)}>
        <SkeletonTable count={count} />
        <span className="sr-only">Loading tasks…</span>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-label="Loading tasks"
      aria-busy="true"
      className={cn('flex flex-col gap-8', className)}
    >
      {items.map((index) => (
        <SkeletonListItem key={index} />
      ))}
      <span className="sr-only">Loading tasks…</span>
    </div>
  );
};

export type { TaskSkeletonProps };
