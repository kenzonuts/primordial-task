import { Group, LayoutList, Table2 } from 'lucide-react';
import type { ReactElement, ReactNode } from 'react';

import { TaskFilter } from '@features/task/components/task-filter';
import { TaskSearch } from '@features/task/components/task-search';
import type {
  TaskFilterPreset,
  TaskGroupBy,
  TaskPriority,
  TaskSortKey,
  TaskStatus,
  TaskViewMode,
} from '@features/task/types';
import { Inline } from '@shared/ui/layout/inline';
import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@shared/ui/overlays/tooltip';
import { IconButton } from '@shared/ui/primitives/icon-button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/ui/primitives/select';

type TaskToolbarProps = {
  readonly query: string;
  readonly onQueryChange: (value: string) => void;
  readonly sort: TaskSortKey;
  readonly onSortChange: (value: TaskSortKey) => void;
  readonly preset: TaskFilterPreset;
  readonly onPresetChange: (value: TaskFilterPreset) => void;
  readonly view: TaskViewMode;
  readonly onViewChange: (value: TaskViewMode) => void;
  readonly groupBy: TaskGroupBy;
  readonly onGroupByChange: (value: TaskGroupBy) => void;
  readonly statuses?: readonly TaskStatus[];
  readonly onStatusesChange?: (value: readonly TaskStatus[]) => void;
  readonly priorities?: readonly TaskPriority[];
  readonly onPrioritiesChange?: (value: readonly TaskPriority[]) => void;
  readonly selectionCount?: number;
  readonly createAction?: ReactNode;
  readonly quickCreateSlot?: ReactNode;
  readonly bulkActionsSlot?: ReactNode;
  readonly disabled?: boolean;
  readonly className?: string;
};

const SORT_OPTIONS: ReadonlyArray<{
  readonly value: TaskSortKey;
  readonly label: string;
}> = [
  { value: 'updated', label: 'Recently updated' },
  { value: 'title', label: 'Title' },
  { value: 'status', label: 'Status' },
  { value: 'priority', label: 'Priority' },
  { value: 'due', label: 'Due date' },
  { value: 'favorites', label: 'Favorites first' },
  { value: 'pinned', label: 'Pinned first' },
];

const GROUP_OPTIONS: ReadonlyArray<{
  readonly value: TaskGroupBy;
  readonly label: string;
}> = [
  { value: 'none', label: 'No grouping' },
  { value: 'status', label: 'Status' },
  { value: 'priority', label: 'Priority' },
  { value: 'project', label: 'Project' },
  { value: 'assignee', label: 'Assignee' },
];

export const TaskToolbar = ({
  query,
  onQueryChange,
  sort,
  onSortChange,
  preset,
  onPresetChange,
  view,
  onViewChange,
  groupBy,
  onGroupByChange,
  statuses,
  onStatusesChange,
  priorities,
  onPrioritiesChange,
  selectionCount = 0,
  createAction,
  quickCreateSlot,
  bulkActionsSlot,
  disabled = false,
  className,
}: TaskToolbarProps): ReactElement => {
  const showBulk = selectionCount > 0 && bulkActionsSlot;

  return (
    <Stack gap={12} className={cn('w-full', className)}>
      <Inline gap={12} align="center" justify="between" className="w-full flex-wrap">
        <Inline gap={12} align="center" className="min-w-0 flex-1 flex-wrap">
          <TaskSearch value={query} onChange={onQueryChange} disabled={disabled} />
          <Select
            value={sort}
            onValueChange={(value) => onSortChange(value as TaskSortKey)}
            disabled={disabled}
          >
            <SelectTrigger size="md" aria-label="Sort tasks" className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={groupBy}
            onValueChange={(value) => onGroupByChange(value as TaskGroupBy)}
            disabled={disabled}
          >
            <SelectTrigger size="md" aria-label="Group tasks" className="w-[160px]">
              <SelectValue placeholder="Group by" />
            </SelectTrigger>
            <SelectContent>
              {GROUP_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <TooltipProvider delayDuration={300}>
            <Inline
              gap={4}
              align="center"
              role="group"
              aria-label="View mode"
              className="rounded-md border border-border-subtle bg-surface-elevated p-1"
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <IconButton
                    type="button"
                    size="sm"
                    variant={view === 'table' ? 'selected' : 'ghost'}
                    disabled={disabled}
                    aria-label="Table view"
                    aria-pressed={view === 'table'}
                    onClick={() => onViewChange('table')}
                  >
                    <Table2 aria-hidden="true" />
                  </IconButton>
                </TooltipTrigger>
                <TooltipContent side="top">Table view</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <IconButton
                    type="button"
                    size="sm"
                    variant={view === 'compact' ? 'selected' : 'ghost'}
                    disabled={disabled}
                    aria-label="Compact view"
                    aria-pressed={view === 'compact'}
                    onClick={() => onViewChange('compact')}
                  >
                    <LayoutList aria-hidden="true" />
                  </IconButton>
                </TooltipTrigger>
                <TooltipContent side="top">Compact view</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <IconButton
                    type="button"
                    size="sm"
                    variant={view === 'grouped' ? 'selected' : 'ghost'}
                    disabled={disabled}
                    aria-label="Grouped view"
                    aria-pressed={view === 'grouped'}
                    onClick={() => onViewChange('grouped')}
                  >
                    <Group aria-hidden="true" />
                  </IconButton>
                </TooltipTrigger>
                <TooltipContent side="top">Grouped view</TooltipContent>
              </Tooltip>
            </Inline>
          </TooltipProvider>
        </Inline>

        <Inline gap={8} align="center" className="shrink-0 flex-wrap">
          {quickCreateSlot}
          {createAction}
        </Inline>
      </Inline>

      <TaskFilter
        preset={preset}
        onPresetChange={onPresetChange}
        statuses={statuses}
        onStatusesChange={onStatusesChange}
        priorities={priorities}
        onPrioritiesChange={onPrioritiesChange}
        disabled={disabled}
      />

      {showBulk ? (
        <div role="region" aria-label={`Bulk actions for ${selectionCount} selected tasks`}>
          {bulkActionsSlot}
        </div>
      ) : null}
    </Stack>
  );
};

export type { TaskToolbarProps };
