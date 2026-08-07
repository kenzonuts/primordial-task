import type { ReactElement } from 'react';

import {
  COLUMN_WIDTH_PRESETS,
  KANBAN_CARD_GAP,
  KANBAN_CARD_MIN_HEIGHT,
  KANBAN_COLUMN_GAP,
} from '@features/kanban/constants';
import { Inline } from '@shared/ui/layout/inline';
import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import { Skeleton } from '@shared/ui/primitives/skeleton';

type KanbanSkeletonProps = {
  readonly columnCount?: number;
  readonly cardsPerColumn?: number;
  readonly className?: string;
};

const SkeletonCard = (): ReactElement => {
  return (
    <div
      className="flex flex-col gap-8 rounded-lg border border-border-subtle bg-surface-card p-3"
      style={{ minHeight: KANBAN_CARD_MIN_HEIGHT }}
    >
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-3 w-3/5" />
      <Inline gap={6} align="center">
        <Skeleton className="h-5 w-14" />
        <Skeleton className="h-5 w-16" />
      </Inline>
      <Inline gap={8} align="center" justify="between" className="mt-auto">
        <Skeleton rounded="full" className="size-6" />
        <Skeleton className="h-3 w-16" />
      </Inline>
    </div>
  );
};

const SkeletonColumn = ({ cardCount }: { readonly cardCount: number }): ReactElement => {
  const cards = Array.from({ length: cardCount }, (_, index) => index);

  return (
    <div
      className="flex shrink-0 flex-col rounded-lg border border-border-subtle bg-surface-elevated"
      style={{ width: COLUMN_WIDTH_PRESETS.default }}
    >
      <div className="flex h-11 items-center gap-8 border-b border-border-subtle px-3">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="ml-auto h-5 w-8 rounded-full" />
      </div>
      <Stack gap={KANBAN_CARD_GAP} className="p-2">
        {cards.map((index) => (
          <SkeletonCard key={index} />
        ))}
      </Stack>
    </div>
  );
};

export const KanbanSkeleton = ({
  columnCount = 4,
  cardsPerColumn = 3,
  className,
}: KanbanSkeletonProps): ReactElement => {
  const columns = Array.from({ length: columnCount }, (_, index) => index);

  return (
    <div
      role="status"
      aria-label="Loading kanban board"
      aria-busy="true"
      className={cn('flex min-h-0 flex-1 flex-col gap-12', className)}
    >
      <Inline gap={12} align="center" className="h-14 shrink-0 px-4">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-5 w-28" />
        <Skeleton className="ml-auto h-9 w-56" />
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-9" />
      </Inline>
      <div
        className="flex min-h-0 flex-1 overflow-hidden px-4 pb-4"
        style={{ gap: KANBAN_COLUMN_GAP }}
      >
        {columns.map((index) => (
          <SkeletonColumn key={index} cardCount={cardsPerColumn} />
        ))}
      </div>
      <span className="sr-only">Loading board…</span>
    </div>
  );
};

export type { KanbanSkeletonProps };
