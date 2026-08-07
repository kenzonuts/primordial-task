import type { ReactElement, ReactNode } from 'react';

import { KanbanBulkBar } from '@features/kanban/components/kanban-bulk-bar';
import { KanbanFilter } from '@features/kanban/components/kanban-filter';
import { KanbanSearch } from '@features/kanban/components/kanban-search';
import type { KanbanFiltersState, KanbanSavedFilter } from '@features/kanban/types';
import type { TaskPriority, TaskStatus } from '@features/task/types';
import { Inline } from '@shared/ui/layout/inline';
import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';

type KanbanToolbarProps = {
  readonly query: string;
  readonly onQueryChange: (value: string) => void;
  readonly onDebouncedQueryChange?: (value: string) => void;
  readonly filters: KanbanFiltersState;
  readonly onFiltersChange: (partial: Partial<KanbanFiltersState>) => void;
  readonly onResetFilters?: () => void;
  readonly savedFilters?: readonly KanbanSavedFilter[];
  readonly onApplySavedFilter?: (filter: KanbanSavedFilter) => void;
  readonly selectionCount?: number;
  readonly onClearSelection?: () => void;
  readonly onBulkMove?: () => void;
  readonly onBulkArchive?: () => void;
  readonly onBulkDelete?: () => void;
  readonly onBulkAssign?: () => void;
  readonly onBulkPriorityChange?: (priority: TaskPriority) => void;
  readonly onBulkStatusChange?: (status: TaskStatus) => void;
  readonly onBulkLabels?: () => void;
  readonly onBulkPin?: () => void;
  readonly onBulkFavorite?: () => void;
  readonly leadingSlot?: ReactNode;
  readonly trailingSlot?: ReactNode;
  readonly disabled?: boolean;
  readonly className?: string;
};

export const KanbanToolbar = ({
  query,
  onQueryChange,
  onDebouncedQueryChange,
  filters,
  onFiltersChange,
  onResetFilters,
  savedFilters,
  onApplySavedFilter,
  selectionCount = 0,
  onClearSelection,
  onBulkMove,
  onBulkArchive,
  onBulkDelete,
  onBulkAssign,
  onBulkPriorityChange,
  onBulkStatusChange,
  onBulkLabels,
  onBulkPin,
  onBulkFavorite,
  leadingSlot,
  trailingSlot,
  disabled = false,
  className,
}: KanbanToolbarProps): ReactElement => {
  return (
    <Stack gap={8} className={cn('w-full min-w-0', className)}>
      <Inline gap={12} align="start" justify="between" className="w-full flex-wrap">
        <Inline gap={12} align="start" className="min-w-0 flex-1 flex-wrap">
          {leadingSlot}
          <KanbanSearch
            value={query}
            onChange={onQueryChange}
            onDebouncedChange={onDebouncedQueryChange}
            disabled={disabled}
          />
          <KanbanFilter
            filters={filters}
            onChange={onFiltersChange}
            onReset={onResetFilters}
            savedFilters={savedFilters}
            onApplySaved={onApplySavedFilter}
            disabled={disabled}
            className="min-w-0 flex-1"
          />
        </Inline>
        {trailingSlot ? (
          <Inline gap={8} align="center" className="shrink-0">
            {trailingSlot}
          </Inline>
        ) : null}
      </Inline>

      <KanbanBulkBar
        selectionCount={selectionCount}
        onClearSelection={onClearSelection}
        onMove={onBulkMove}
        onArchive={onBulkArchive}
        onDelete={onBulkDelete}
        onAssign={onBulkAssign}
        onPriorityChange={onBulkPriorityChange}
        onStatusChange={onBulkStatusChange}
        onLabels={onBulkLabels}
        onPin={onBulkPin}
        onFavorite={onBulkFavorite}
        disabled={disabled}
      />
    </Stack>
  );
};

export type { KanbanToolbarProps };
