import type { ReactElement } from 'react';

import type { KanbanFiltersState, KanbanSavedFilter } from '@features/kanban/types';
import { TASK_PRIORITY_LABELS, TASK_STATUS_LABELS } from '@features/task/constants';
import {
  TASK_PRIORITIES,
  TASK_STATUSES,
  type TaskPriority,
  type TaskStatus,
} from '@features/task/types';
import { Inline } from '@shared/ui/layout/inline';
import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import { Button } from '@shared/ui/primitives/button';
import { Chip } from '@shared/ui/primitives/chip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/ui/primitives/select';

type KanbanFilterPresetKey = 'all' | 'favorites' | 'pinned' | 'blocked' | 'completed' | 'archived';

type KanbanFilterProps = {
  readonly filters: KanbanFiltersState;
  readonly onChange: (partial: Partial<KanbanFiltersState>) => void;
  readonly onReset?: () => void;
  readonly savedFilters?: readonly KanbanSavedFilter[];
  readonly onApplySaved?: (filter: KanbanSavedFilter) => void;
  readonly className?: string;
  readonly disabled?: boolean;
};

const PRESET_OPTIONS: ReadonlyArray<{
  readonly key: KanbanFilterPresetKey;
  readonly label: string;
}> = [
  { key: 'all', label: 'All' },
  { key: 'favorites', label: 'Favorites' },
  { key: 'pinned', label: 'Pinned' },
  { key: 'blocked', label: 'Blocked' },
  { key: 'completed', label: 'Completed' },
  { key: 'archived', label: 'Archived' },
];

const toggleValue = <T extends string>(list: readonly T[], value: T): readonly T[] => {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
};

const activePreset = (filters: KanbanFiltersState): KanbanFilterPresetKey => {
  if (filters.favoritesOnly) return 'favorites';
  if (filters.pinnedOnly) return 'pinned';
  if (filters.blockedOnly) return 'blocked';
  if (filters.completedOnly) return 'completed';
  if (filters.archivedOnly) return 'archived';
  return 'all';
};

const applyPreset = (key: KanbanFilterPresetKey): Partial<KanbanFiltersState> => {
  const clear = {
    favoritesOnly: false,
    pinnedOnly: false,
    blockedOnly: false,
    completedOnly: false,
    archivedOnly: false,
  };
  switch (key) {
    case 'favorites':
      return { ...clear, favoritesOnly: true };
    case 'pinned':
      return { ...clear, pinnedOnly: true };
    case 'blocked':
      return { ...clear, blockedOnly: true };
    case 'completed':
      return { ...clear, completedOnly: true };
    case 'archived':
      return { ...clear, archivedOnly: true };
    default:
      return clear;
  }
};

export const KanbanFilter = ({
  filters,
  onChange,
  onReset,
  savedFilters = [],
  onApplySaved,
  className,
  disabled = false,
}: KanbanFilterProps): ReactElement => {
  const preset = activePreset(filters);
  const chips: Array<{ id: string; label: string; onRemove: () => void }> = [];

  for (const status of filters.statuses) {
    chips.push({
      id: `status-${status}`,
      label: TASK_STATUS_LABELS[status],
      onRemove: () => onChange({ statuses: filters.statuses.filter((item) => item !== status) }),
    });
  }
  for (const priority of filters.priorities) {
    chips.push({
      id: `priority-${priority}`,
      label: TASK_PRIORITY_LABELS[priority],
      onRemove: () =>
        onChange({ priorities: filters.priorities.filter((item) => item !== priority) }),
    });
  }
  for (const label of filters.labels) {
    chips.push({
      id: `label-${label}`,
      label,
      onRemove: () => onChange({ labels: filters.labels.filter((item) => item !== label) }),
    });
  }
  if (filters.favoritesOnly) {
    chips.push({
      id: 'favorites',
      label: 'Favorites',
      onRemove: () => onChange({ favoritesOnly: false }),
    });
  }
  if (filters.pinnedOnly) {
    chips.push({
      id: 'pinned',
      label: 'Pinned',
      onRemove: () => onChange({ pinnedOnly: false }),
    });
  }
  if (filters.blockedOnly) {
    chips.push({
      id: 'blocked',
      label: 'Blocked',
      onRemove: () => onChange({ blockedOnly: false }),
    });
  }

  return (
    <Stack gap={8} className={cn('min-w-0', className)}>
      <Inline
        gap={4}
        align="center"
        role="group"
        aria-label="Board filter presets"
        className="flex-wrap rounded-md border border-border-subtle bg-surface-elevated p-1"
      >
        {PRESET_OPTIONS.map((option) => {
          const isActive = preset === option.key;
          return (
            <Button
              key={option.key}
              type="button"
              size="sm"
              variant={isActive ? 'secondary' : 'ghost'}
              disabled={disabled}
              aria-pressed={isActive}
              onClick={() => onChange(applyPreset(option.key))}
              className={cn('h-7 px-2.5', isActive && 'bg-state-selected text-text-primary')}
            >
              {option.label}
            </Button>
          );
        })}
      </Inline>

      <Inline gap={8} align="center" className="flex-wrap">
        <Select
          value={filters.statuses.length === 1 ? filters.statuses[0] : 'all'}
          onValueChange={(value) => {
            if (value === 'all') {
              onChange({ statuses: [] });
              return;
            }
            onChange({ statuses: toggleValue(filters.statuses, value as TaskStatus) });
          }}
          disabled={disabled}
        >
          <SelectTrigger size="sm" aria-label="Filter by status" className="w-[140px]">
            <SelectValue
              placeholder={
                filters.statuses.length > 1 ? `${filters.statuses.length} statuses` : 'Status'
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {TASK_STATUSES.filter((status) => status !== 'archived').map((status) => (
              <SelectItem key={status} value={status}>
                {TASK_STATUS_LABELS[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.priorities.length === 1 ? filters.priorities[0] : 'all'}
          onValueChange={(value) => {
            if (value === 'all') {
              onChange({ priorities: [] });
              return;
            }
            onChange({ priorities: toggleValue(filters.priorities, value as TaskPriority) });
          }}
          disabled={disabled}
        >
          <SelectTrigger size="sm" aria-label="Filter by priority" className="w-[140px]">
            <SelectValue
              placeholder={
                filters.priorities.length > 1
                  ? `${filters.priorities.length} priorities`
                  : 'Priority'
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All priorities</SelectItem>
            {TASK_PRIORITIES.map((priority) => (
              <SelectItem key={priority} value={priority}>
                {TASK_PRIORITY_LABELS[priority]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {savedFilters.length > 0 && onApplySaved ? (
          <Select
            onValueChange={(id) => {
              const found = savedFilters.find((item) => item.id === id);
              if (found) {
                onApplySaved(found);
              }
            }}
            disabled={disabled}
          >
            <SelectTrigger size="sm" aria-label="Saved filters" className="w-[160px]">
              <SelectValue placeholder="Saved filters" />
            </SelectTrigger>
            <SelectContent>
              {savedFilters.map((saved) => (
                <SelectItem key={saved.id} value={saved.id}>
                  {saved.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}

        {chips.length > 0 && onReset ? (
          <Button type="button" size="sm" variant="ghost" disabled={disabled} onClick={onReset}>
            Clear filters
          </Button>
        ) : null}
      </Inline>

      {chips.length > 0 ? (
        <Inline gap={6} align="center" className="flex-wrap" aria-label="Active filters">
          {chips.map((chip) => (
            <Chip key={chip.id} size="sm" removable onRemove={chip.onRemove}>
              {chip.label}
            </Chip>
          ))}
        </Inline>
      ) : null}
    </Stack>
  );
};

export type { KanbanFilterProps, KanbanFilterPresetKey };
