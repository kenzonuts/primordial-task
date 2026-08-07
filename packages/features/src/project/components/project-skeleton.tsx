import type { ReactElement } from 'react';

import { Inline } from '@shared/ui/layout/inline';
import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import { Skeleton } from '@shared/ui/primitives/skeleton';

type ProjectSkeletonProps = {
  readonly count?: number;
  readonly variant?: 'grid' | 'list';
  readonly className?: string;
};

const SkeletonCard = (): ReactElement => {
  return (
    <div className="overflow-hidden rounded-lg border border-border-default bg-surface-card shadow-sm">
      <Skeleton className="h-10 w-full rounded-none" />
      <Stack gap={12} className="p-4">
        <Inline gap={12} align="start" justify="between">
          <Inline gap={12} align="center" className="min-w-0 flex-1">
            <Skeleton rounded="full" className="size-10 shrink-0" />
            <Stack gap={8} className="min-w-0 flex-1">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-5 w-16" />
            </Stack>
          </Inline>
          <Inline gap={4}>
            <Skeleton rounded="full" className="size-7 shrink-0" />
            <Skeleton rounded="full" className="size-7 shrink-0" />
          </Inline>
        </Inline>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="h-1.5 w-full" />
        <Inline gap={8} justify="between">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-20" />
        </Inline>
      </Stack>
    </div>
  );
};

const SkeletonListItem = (): ReactElement => {
  return (
    <div className="flex items-center gap-12 rounded-lg border border-border-subtle bg-surface-card px-3 py-2.5">
      <Skeleton rounded="full" className="size-8 shrink-0" />
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-5 w-16" />
      <Skeleton className="ml-auto hidden h-1.5 w-28 lg:block" />
      <Skeleton className="hidden h-3 w-24 sm:block" />
      <Skeleton className="hidden h-3 w-20 md:block" />
      <Inline gap={4} className="shrink-0">
        <Skeleton rounded="full" className="size-7" />
        <Skeleton rounded="full" className="size-7" />
      </Inline>
    </div>
  );
};

export const ProjectSkeleton = ({
  count = 6,
  variant = 'grid',
  className,
}: ProjectSkeletonProps): ReactElement => {
  const items = Array.from({ length: count }, (_, index) => index);

  if (variant === 'list') {
    return (
      <div
        role="status"
        aria-label="Loading projects"
        aria-busy="true"
        className={cn('flex flex-col gap-8', className)}
      >
        {items.map((index) => (
          <SkeletonListItem key={index} />
        ))}
        <span className="sr-only">Loading projects…</span>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-label="Loading projects"
      aria-busy="true"
      className={cn('grid grid-cols-1 gap-16 md:grid-cols-2 xl:grid-cols-3', className)}
    >
      {items.map((index) => (
        <SkeletonCard key={index} />
      ))}
      <span className="sr-only">Loading projects…</span>
    </div>
  );
};

export type { ProjectSkeletonProps };
