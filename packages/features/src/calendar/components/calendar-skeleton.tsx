import type { ReactElement } from 'react';

import { CALENDAR_SIDEBAR_WIDTH, HOUR_HEIGHT_PX } from '@features/calendar/constants';
import type { CalendarViewMode } from '@features/calendar/types';
import { cn } from '@shared/ui/lib/cn';
import { Skeleton } from '@shared/ui/primitives/skeleton';

type CalendarSkeletonProps = {
  readonly view?: CalendarViewMode;
  readonly className?: string;
};

const MonthSkeleton = (): ReactElement => {
  const cells = Array.from({ length: 42 }, (_, index) => index);
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="grid grid-cols-7 border-b border-border-subtle">
        {Array.from({ length: 7 }, (_, index) => (
          <div key={index} className="flex h-8 items-center justify-center">
            <Skeleton className="h-3 w-8" />
          </div>
        ))}
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-7 grid-rows-6">
        {cells.map((index) => (
          <div
            key={index}
            className="flex flex-col gap-1 border-b border-r border-border-subtle p-1"
          >
            <Skeleton rounded="full" className="size-6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        ))}
      </div>
    </div>
  );
};

const WeekDaySkeleton = ({ columns }: { readonly columns: number }): ReactElement => {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div
        className="grid border-b border-border-subtle"
        style={{ gridTemplateColumns: `56px repeat(${columns}, minmax(0, 1fr))` }}
      >
        <div />
        {Array.from({ length: columns }, (_, index) => (
          <div key={index} className="flex h-12 flex-col items-center justify-center gap-1">
            <Skeleton className="h-3 w-8" />
            <Skeleton rounded="full" className="size-7" />
          </div>
        ))}
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `56px repeat(${columns}, minmax(0, 1fr))`,
            height: 12 * HOUR_HEIGHT_PX,
          }}
        >
          <div className="border-r border-border-subtle">
            {Array.from({ length: 12 }, (_, index) => (
              <div
                key={index}
                className="border-b border-border-subtle p-1"
                style={{ height: HOUR_HEIGHT_PX }}
              >
                <Skeleton className="ml-auto h-3 w-10" />
              </div>
            ))}
          </div>
          {Array.from({ length: columns }, (_, col) => (
            <div key={col} className="relative border-r border-border-subtle">
              {Array.from({ length: 12 }, (_, hour) => (
                <div
                  key={hour}
                  className="border-b border-border-subtle"
                  style={{ height: HOUR_HEIGHT_PX }}
                />
              ))}
              <Skeleton
                className="absolute left-1 right-1 rounded-md"
                style={{ top: (col + 1) * 28, height: 40 }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ListSkeleton = (): ReactElement => {
  return (
    <div className="flex flex-col gap-2 p-3">
      {Array.from({ length: 8 }, (_, index) => (
        <div key={index} className="flex items-center gap-3 border-b border-border-subtle py-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="ml-auto h-5 w-16" />
        </div>
      ))}
    </div>
  );
};

const TimelineSkeleton = (): ReactElement => {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex h-14 items-center gap-2 border-b border-border-subtle px-3">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-6 w-40" />
      </div>
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="flex h-10 items-center border-b border-border-subtle">
          <div className="w-[180px] shrink-0 border-r border-border-subtle px-3">
            <Skeleton className="h-3 w-24" />
          </div>
          <div className="relative flex-1 px-2">
            <Skeleton
              className="h-7 rounded-md"
              style={{ width: `${30 + ((index * 17) % 40)}%`, marginLeft: `${(index * 11) % 30}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export const CalendarSkeleton = ({
  view = 'month',
  className,
}: CalendarSkeletonProps): ReactElement => {
  return (
    <div
      role="status"
      aria-label="Loading calendar"
      aria-busy="true"
      className={cn('flex h-full min-h-0 bg-surface-base', className)}
    >
      <div
        className="hidden shrink-0 border-r border-border-subtle p-3 lg:block"
        style={{ width: CALENDAR_SIDEBAR_WIDTH }}
      >
        <Skeleton className="mb-3 h-4 w-28" />
        <div className="mb-4 grid grid-cols-7 gap-1">
          {Array.from({ length: 35 }, (_, index) => (
            <Skeleton key={index} rounded="full" className="size-7" />
          ))}
        </div>
        <Skeleton className="mb-2 h-3 w-20" />
        <Skeleton className="mb-2 h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
      <div className="min-w-0 flex-1">
        {view === 'month' ? <MonthSkeleton /> : null}
        {view === 'week' ? <WeekDaySkeleton columns={7} /> : null}
        {view === 'day' ? <WeekDaySkeleton columns={1} /> : null}
        {view === 'agenda' || view === 'schedule' ? <ListSkeleton /> : null}
        {view === 'timeline' ? <TimelineSkeleton /> : null}
      </div>
      <span className="sr-only">Loading calendar…</span>
    </div>
  );
};

export type { CalendarSkeletonProps };
