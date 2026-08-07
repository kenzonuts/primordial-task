import type { ReactElement } from 'react';

import { Inline } from '@shared/ui/layout/inline';
import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import { Skeleton } from '@shared/ui/primitives/skeleton';

type WorkspaceSkeletonProps = {
  readonly count?: number;
  readonly variant?: 'grid' | 'list';
  readonly className?: string;
};

const SkeletonCard = (): ReactElement => {
  return (
    <div className="rounded-lg border border-border-default bg-surface-card p-4 shadow-sm">
      <Stack gap={12}>
        <Inline gap={12} align="start" justify="between">
          <Inline gap={12} align="center" className="min-w-0 flex-1">
            <Skeleton rounded="full" className="size-10 shrink-0" />
            <Stack gap={8} className="min-w-0 flex-1">
              <Skeleton className="h-4 w-2/3" />
              <Inline gap={8} align="center">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-3 w-20" />
              </Inline>
            </Stack>
          </Inline>
          <Skeleton rounded="full" className="size-7 shrink-0" />
        </Inline>
        <Skeleton className="h-3 w-1/3" />
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
      <Skeleton className="ml-auto hidden h-3 w-24 sm:block" />
      <Skeleton rounded="full" className="size-7 shrink-0" />
    </div>
  );
};

export const WorkspaceSkeleton = ({
  count = 6,
  variant = 'grid',
  className,
}: WorkspaceSkeletonProps): ReactElement => {
  const items = Array.from({ length: count }, (_, index) => index);

  if (variant === 'list') {
    return (
      <div
        role="status"
        aria-label="Loading workspaces"
        aria-busy="true"
        className={cn('flex flex-col gap-8', className)}
      >
        {items.map((index) => (
          <SkeletonListItem key={index} />
        ))}
        <span className="sr-only">Loading workspaces…</span>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-label="Loading workspaces"
      aria-busy="true"
      className={cn('grid grid-cols-1 gap-16 md:grid-cols-2 xl:grid-cols-3', className)}
    >
      {items.map((index) => (
        <SkeletonCard key={index} />
      ))}
      <span className="sr-only">Loading workspaces…</span>
    </div>
  );
};

export type { WorkspaceSkeletonProps };
