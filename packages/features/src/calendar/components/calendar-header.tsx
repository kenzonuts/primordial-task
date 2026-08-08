import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import type { ReactElement, ReactNode } from 'react';

import { CalendarSearch } from '@features/calendar/components/calendar-search';
import { CALENDAR_TOOLBAR_HEIGHT, CALENDAR_VIEW_LABELS } from '@features/calendar/constants';
import type { CalendarViewMode } from '@features/calendar/types';
import { CALENDAR_VIEWS } from '@features/calendar/types';
import { Inline } from '@shared/ui/layout/inline';
import { cn } from '@shared/ui/lib/cn';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@shared/ui/overlays/tooltip';
import { Button } from '@shared/ui/primitives/button';
import { IconButton } from '@shared/ui/primitives/icon-button';
import { Text } from '@shared/ui/typography/text';

type CalendarHeaderProps = {
  readonly view: CalendarViewMode;
  readonly rangeLabel: string;
  readonly searchValue: string;
  readonly announcement?: string | null;
  readonly onViewChange: (view: CalendarViewMode) => void;
  readonly onToday: () => void;
  readonly onPrev: () => void;
  readonly onNext: () => void;
  readonly onSearchChange: (value: string) => void;
  readonly onQuickCreate?: () => void;
  readonly onGoToDate?: () => void;
  readonly filterSlot?: ReactNode;
  readonly className?: string;
};

const VIEW_SHORT: Record<CalendarViewMode, string> = {
  month: 'M',
  week: 'W',
  day: 'D',
  agenda: 'A',
  timeline: 'L',
  schedule: 'S',
};

export const CalendarHeader = ({
  view,
  rangeLabel,
  searchValue,
  announcement = null,
  onViewChange,
  onToday,
  onPrev,
  onNext,
  onSearchChange,
  onQuickCreate,
  onGoToDate,
  filterSlot,
  className,
}: CalendarHeaderProps): ReactElement => {
  return (
    <header
      className={cn(
        'flex shrink-0 items-center gap-3 border-b border-border-default bg-surface-elevated px-3',
        className,
      )}
      style={{ height: CALENDAR_TOOLBAR_HEIGHT }}
    >
      <Inline gap={4} align="center" className="shrink-0">
        <Button type="button" size="sm" variant="secondary" onClick={onToday}>
          Today
        </Button>
        <IconButton
          type="button"
          size="sm"
          variant="ghost"
          aria-label="Previous period"
          onClick={onPrev}
        >
          <ChevronLeft aria-hidden="true" />
        </IconButton>
        <IconButton
          type="button"
          size="sm"
          variant="ghost"
          aria-label="Next period"
          onClick={onNext}
        >
          <ChevronRight aria-hidden="true" />
        </IconButton>
        {onGoToDate ? (
          <IconButton
            type="button"
            size="sm"
            variant="ghost"
            aria-label="Go to date"
            onClick={onGoToDate}
          >
            <CalendarIcon aria-hidden="true" />
          </IconButton>
        ) : null}
      </Inline>

      <Text variant="body-sm" className="min-w-0 truncate font-medium" aria-live="polite">
        {rangeLabel}
      </Text>

      <div className="ml-auto flex min-w-0 items-center gap-2">
        <CalendarSearch value={searchValue} onChange={onSearchChange} className="w-[200px]" />
        {filterSlot}
        <TooltipProvider delayDuration={300}>
          <Inline
            gap={2}
            align="center"
            role="tablist"
            aria-label="Calendar view"
            className="rounded-md border border-border-subtle bg-surface-base p-0.5"
          >
            {CALENDAR_VIEWS.map((mode) => {
              const active = view === mode;
              return (
                <Tooltip key={mode}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={active}
                      aria-label={CALENDAR_VIEW_LABELS[mode]}
                      onClick={() => onViewChange(mode)}
                      className={cn(
                        'inline-flex h-7 min-w-7 items-center justify-center rounded-sm px-2 text-xs font-medium',
                        'text-text-secondary hover:bg-state-hover hover:text-text-primary',
                        'focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-1',
                        'focus-visible:outline-[var(--state-focus)]',
                        active && 'bg-state-selected text-text-primary',
                      )}
                    >
                      {VIEW_SHORT[mode]}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>{CALENDAR_VIEW_LABELS[mode]}</TooltipContent>
                </Tooltip>
              );
            })}
          </Inline>
        </TooltipProvider>

        {onQuickCreate ? (
          <Button type="button" size="sm" onClick={onQuickCreate} className="gap-1">
            <Plus className="size-3.5" aria-hidden="true" />
            Create
          </Button>
        ) : null}
      </div>

      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>
    </header>
  );
};

export type { CalendarHeaderProps };
