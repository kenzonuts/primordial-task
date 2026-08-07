import type { ReactElement } from 'react';

import { TASK_PRIORITY_LABELS, TASK_STATUS_LABELS } from '@features/task/constants';
import {
  TASK_PRIORITIES,
  TASK_STATUSES,
  type TaskFilterPreset,
  type TaskPriority,
  type TaskStatus,
} from '@features/task/types';
import { Inline } from '@shared/ui/layout/inline';
import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import { Button } from '@shared/ui/primitives/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/ui/primitives/select';

type TaskFilterProps = {
  readonly preset: TaskFilterPreset;
  readonly onPresetChange: (value: TaskFilterPreset) => void;
  readonly statuses?: readonly TaskStatus[];
  readonly onStatusesChange?: (value: readonly TaskStatus[]) => void;
  readonly priorities?: readonly TaskPriority[];
  readonly onPrioritiesChange?: (value: readonly TaskPriority[]) => void;
  readonly className?: string;
  readonly disabled?: boolean;
};

const PRESET_OPTIONS: ReadonlyArray<{
  readonly value: TaskFilterPreset;
  readonly label: string;
}> = [
  { value: 'all', label: 'All' },
  { value: 'mine', label: 'Mine' },
  { value: 'favorites', label: 'Favorites' },
  { value: 'pinned', label: 'Pinned' },
  { value: 'completed', label: 'Completed' },
  { value: 'archived', label: 'Archived' },
];

const toggleValue = <T extends string>(list: readonly T[], value: T): readonly T[] => {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
};

export const TaskFilter = ({
  preset,
  onPresetChange,
  statuses,
  onStatusesChange,
  priorities,
  onPrioritiesChange,
  className,
  disabled = false,
}: TaskFilterProps): ReactElement => {
  const showStatusFilter = statuses !== undefined && onStatusesChange !== undefined;
  const showPriorityFilter = priorities !== undefined && onPrioritiesChange !== undefined;

  return (
    <Stack gap={8} className={cn('min-w-0', className)}>
      <Inline
        gap={4}
        align="center"
        role="group"
        aria-label="Filter tasks"
        className="flex-wrap rounded-md border border-border-subtle bg-surface-elevated p-1"
      >
        {PRESET_OPTIONS.map((option) => {
          const isActive = preset === option.value;
          return (
            <Button
              key={option.value}
              type="button"
              size="sm"
              variant={isActive ? 'secondary' : 'ghost'}
              disabled={disabled}
              aria-pressed={isActive}
              onClick={() => onPresetChange(option.value)}
              className={cn('h-7 px-2.5', isActive && 'bg-state-selected text-text-primary')}
            >
              {option.label}
            </Button>
          );
        })}
      </Inline>

      {showStatusFilter || showPriorityFilter ? (
        <Inline gap={8} align="center" className="flex-wrap">
          {showStatusFilter ? (
            <Select
              value={statuses.length === 1 ? statuses[0] : 'all'}
              onValueChange={(value) => {
                if (value === 'all') {
                  onStatusesChange([]);
                  return;
                }
                onStatusesChange(toggleValue(statuses, value as TaskStatus));
              }}
              disabled={disabled}
            >
              <SelectTrigger size="md" aria-label="Filter by status" className="w-[160px]">
                <SelectValue
                  placeholder={
                    statuses.length > 1
                      ? `${statuses.length} statuses`
                      : statuses.length === 1
                        ? TASK_STATUS_LABELS[statuses[0]!]
                        : 'Status'
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {TASK_STATUSES.filter((status) => status !== 'archived').map((status) => (
                  <SelectItem key={status} value={status}>
                    {TASK_STATUS_LABELS[status]}
                    {statuses.includes(status) ? ' ✓' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : null}

          {showPriorityFilter ? (
            <Select
              value={priorities.length === 1 ? priorities[0] : 'all'}
              onValueChange={(value) => {
                if (value === 'all') {
                  onPrioritiesChange([]);
                  return;
                }
                onPrioritiesChange(toggleValue(priorities, value as TaskPriority));
              }}
              disabled={disabled}
            >
              <SelectTrigger size="md" aria-label="Filter by priority" className="w-[160px]">
                <SelectValue
                  placeholder={
                    priorities.length > 1
                      ? `${priorities.length} priorities`
                      : priorities.length === 1
                        ? TASK_PRIORITY_LABELS[priorities[0]!]
                        : 'Priority'
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All priorities</SelectItem>
                {TASK_PRIORITIES.map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {TASK_PRIORITY_LABELS[priority]}
                    {priorities.includes(priority) ? ' ✓' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : null}
        </Inline>
      ) : null}
    </Stack>
  );
};

export type { TaskFilterProps };
