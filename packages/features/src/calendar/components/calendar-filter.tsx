import type { ReactElement } from 'react';

import type { CalendarFiltersState } from '@features/calendar/types';
import { TASK_PRIORITY_LABELS, TASK_STATUS_LABELS } from '@features/task/constants';
import {
  TASK_PRIORITIES,
  TASK_STATUSES,
  type TaskPriority,
  type TaskStatus,
} from '@features/task/types';
import { Inline } from '@shared/ui/layout/inline';
import { cn } from '@shared/ui/lib/cn';
import { Button } from '@shared/ui/primitives/button';

type CalendarFilterProps = {
  readonly filters: CalendarFiltersState;
  readonly onChange: (partial: Partial<CalendarFiltersState>) => void;
  readonly onReset?: () => void;
  readonly className?: string;
  readonly disabled?: boolean;
};

const toggleValue = <T extends string>(list: readonly T[], value: T): readonly T[] => {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
};

type ToggleChipProps = {
  readonly label: string;
  readonly active: boolean;
  readonly disabled?: boolean;
  readonly onClick: () => void;
};

const ToggleChip = ({ label, active, disabled, onClick }: ToggleChipProps): ReactElement => {
  return (
    <Button
      type="button"
      size="sm"
      variant={active ? 'secondary' : 'ghost'}
      disabled={disabled}
      aria-pressed={active}
      onClick={onClick}
      className={cn('h-7 px-2.5', active && 'bg-state-selected text-text-primary')}
    >
      {label}
    </Button>
  );
};

export const CalendarFilter = ({
  filters,
  onChange,
  onReset,
  className,
  disabled = false,
}: CalendarFilterProps): ReactElement => {
  const hasActive =
    filters.favoritesOnly ||
    filters.pinnedOnly ||
    filters.overdueOnly ||
    filters.completedOnly ||
    filters.statuses.length > 0 ||
    filters.priorities.length > 0;

  return (
    <Inline
      gap={4}
      align="center"
      wrap
      role="group"
      aria-label="Calendar filters"
      className={cn('min-w-0', className)}
    >
      <ToggleChip
        label="Favorites"
        active={filters.favoritesOnly}
        disabled={disabled}
        onClick={() => onChange({ favoritesOnly: !filters.favoritesOnly })}
      />
      <ToggleChip
        label="Pinned"
        active={filters.pinnedOnly}
        disabled={disabled}
        onClick={() => onChange({ pinnedOnly: !filters.pinnedOnly })}
      />
      <ToggleChip
        label="Overdue"
        active={filters.overdueOnly}
        disabled={disabled}
        onClick={() => onChange({ overdueOnly: !filters.overdueOnly })}
      />
      <ToggleChip
        label="Completed"
        active={filters.completedOnly}
        disabled={disabled}
        onClick={() => onChange({ completedOnly: !filters.completedOnly })}
      />

      <span className="mx-1 h-4 w-px bg-border-subtle" aria-hidden="true" />

      {TASK_STATUSES.filter((status) => status !== 'archived' && status !== 'cancelled').map(
        (status: TaskStatus) => (
          <ToggleChip
            key={status}
            label={TASK_STATUS_LABELS[status]}
            active={filters.statuses.includes(status)}
            disabled={disabled}
            onClick={() => onChange({ statuses: toggleValue(filters.statuses, status) })}
          />
        ),
      )}

      <span className="mx-1 h-4 w-px bg-border-subtle" aria-hidden="true" />

      {TASK_PRIORITIES.filter((priority) => priority !== 'none').map((priority: TaskPriority) => (
        <ToggleChip
          key={priority}
          label={TASK_PRIORITY_LABELS[priority]}
          active={filters.priorities.includes(priority)}
          disabled={disabled}
          onClick={() => onChange({ priorities: toggleValue(filters.priorities, priority) })}
        />
      ))}

      {hasActive && onReset ? (
        <Button
          type="button"
          size="sm"
          variant="ghost"
          disabled={disabled}
          onClick={onReset}
          className="h-7 px-2 text-text-muted"
        >
          Clear
        </Button>
      ) : null}
    </Inline>
  );
};

export type { CalendarFilterProps };
