import type { ReactElement, ReactNode } from 'react';

import { CalendarFilter } from '@features/calendar/components/calendar-filter';
import { CalendarHeader } from '@features/calendar/components/calendar-header';
import { CALENDAR_TOOLBAR_HEIGHT } from '@features/calendar/constants';
import type { CalendarFiltersState, CalendarViewMode } from '@features/calendar/types';
import { cn } from '@shared/ui/lib/cn';

type CalendarToolbarProps = {
  readonly view: CalendarViewMode;
  readonly rangeLabel: string;
  readonly searchValue: string;
  readonly filters: CalendarFiltersState;
  readonly announcement?: string | null;
  readonly onViewChange: (view: CalendarViewMode) => void;
  readonly onToday: () => void;
  readonly onPrev: () => void;
  readonly onNext: () => void;
  readonly onSearchChange: (value: string) => void;
  readonly onFiltersChange: (partial: Partial<CalendarFiltersState>) => void;
  readonly onResetFilters?: () => void;
  readonly onQuickCreate?: () => void;
  readonly onGoToDate?: () => void;
  readonly trailing?: ReactNode;
  readonly className?: string;
};

/**
 * Composed calendar chrome: header + filter row.
 * Height of the primary bar matches CALENDAR_TOOLBAR_HEIGHT (~48px).
 */
export const CalendarToolbar = ({
  view,
  rangeLabel,
  searchValue,
  filters,
  announcement = null,
  onViewChange,
  onToday,
  onPrev,
  onNext,
  onSearchChange,
  onFiltersChange,
  onResetFilters,
  onQuickCreate,
  onGoToDate,
  trailing,
  className,
}: CalendarToolbarProps): ReactElement => {
  return (
    <div className={cn('flex shrink-0 flex-col border-b border-border-default', className)}>
      <CalendarHeader
        view={view}
        rangeLabel={rangeLabel}
        searchValue={searchValue}
        announcement={announcement}
        onViewChange={onViewChange}
        onToday={onToday}
        onPrev={onPrev}
        onNext={onNext}
        onSearchChange={onSearchChange}
        onQuickCreate={onQuickCreate}
        onGoToDate={onGoToDate}
        className="border-b-0"
      />
      <div
        className="flex items-center gap-2 border-t border-border-subtle bg-surface-base px-3 py-1.5"
        style={{ minHeight: CALENDAR_TOOLBAR_HEIGHT - 8 }}
      >
        <CalendarFilter
          filters={filters}
          onChange={onFiltersChange}
          onReset={onResetFilters}
          className="min-w-0 flex-1"
        />
        {trailing}
      </div>
    </div>
  );
};

export type { CalendarToolbarProps };
