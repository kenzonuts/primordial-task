import type { ReactElement } from 'react';

import { NOTES_SIDEBAR_WIDTH } from '@features/notes/constants';
import { cn } from '@shared/ui/lib/cn';
import { Skeleton } from '@shared/ui/primitives/skeleton';

type NoteSkeletonProps = {
  readonly className?: string;
  readonly withSidebar?: boolean;
};

export const NoteSkeleton = ({
  className,
  withSidebar = true,
}: NoteSkeletonProps): ReactElement => {
  return (
    <div
      role="status"
      aria-label="Loading notes"
      aria-busy="true"
      className={cn('flex h-full min-h-0 bg-surface-base', className)}
    >
      {withSidebar ? (
        <div
          className="hidden shrink-0 border-r border-border-subtle p-3 lg:block"
          style={{ width: NOTES_SIDEBAR_WIDTH }}
        >
          <Skeleton className="mb-3 h-4 w-24" />
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="mb-2 h-8 w-full" />
          ))}
          <Skeleton className="mb-2 mt-4 h-3 w-16" />
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={`folder-${index}`} className="mb-2 h-7 w-full" />
          ))}
        </div>
      ) : null}
      <div className="min-w-0 flex-1 p-4">
        <div className="mb-4 flex items-center gap-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="ml-auto h-8 w-28" />
        </div>
        <div className="mb-4 flex gap-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="flex flex-col gap-2">
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} className="flex items-center gap-3 border-b border-border-subtle py-3">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-24" />
              <Skeleton className="ml-auto h-5 w-16" />
            </div>
          ))}
        </div>
      </div>
      <span className="sr-only">Loading notes…</span>
    </div>
  );
};

export type { NoteSkeletonProps };
