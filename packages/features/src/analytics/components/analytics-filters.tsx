import type { ReactElement } from 'react';

import type { AnalyticsFilters as AnalyticsFiltersState } from '@features/analytics/types';
import { Inline } from '@shared/ui/layout/inline';
import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import { Button } from '@shared/ui/primitives/button';
import { Checkbox } from '@shared/ui/primitives/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/ui/primitives/select';
import { Text } from '@shared/ui/typography/text';

type FilterOption = {
  readonly id: string;
  readonly label: string;
};

type AnalyticsFiltersProps = {
  readonly filters: AnalyticsFiltersState;
  readonly projectOptions?: readonly FilterOption[];
  readonly memberOptions?: readonly FilterOption[];
  readonly statusOptions?: readonly FilterOption[];
  readonly priorityOptions?: readonly FilterOption[];
  readonly onChange: (partial: Partial<AnalyticsFiltersState>) => void;
  readonly onReset?: () => void;
  readonly className?: string;
};

const toggleId = (list: readonly string[], id: string): readonly string[] =>
  list.includes(id) ? list.filter((item) => item !== id) : [...list, id];

const ToggleGroup = ({
  label,
  options,
  selected,
  onToggle,
}: {
  readonly label: string;
  readonly options: readonly FilterOption[];
  readonly selected: readonly string[];
  readonly onToggle: (id: string) => void;
}): ReactElement | null => {
  if (options.length === 0) {
    return null;
  }

  return (
    <Inline gap={4} align="center" wrap role="group" aria-label={label}>
      <Text as="span" variant="caption" muted className="shrink-0">
        {label}
      </Text>
      {options.map((option) => {
        const active = selected.includes(option.id);
        return (
          <Button
            key={option.id}
            type="button"
            size="sm"
            variant={active ? 'secondary' : 'ghost'}
            aria-pressed={active}
            onClick={() => onToggle(option.id)}
            className={cn('h-7 px-2.5', active && 'bg-state-selected')}
          >
            {option.label}
          </Button>
        );
      })}
    </Inline>
  );
};

export const AnalyticsFilters = ({
  filters,
  projectOptions = [],
  memberOptions = [],
  statusOptions = [],
  priorityOptions = [],
  onChange,
  onReset,
  className,
}: AnalyticsFiltersProps): ReactElement => {
  const projectSummary =
    filters.projectIds.length === 0
      ? 'All projects'
      : filters.projectIds.length === 1
        ? (projectOptions.find((p) => p.id === filters.projectIds[0])?.label ?? '1 project')
        : `${filters.projectIds.length} projects`;

  const memberSummary =
    filters.memberIds.length === 0
      ? 'All members'
      : filters.memberIds.length === 1
        ? (memberOptions.find((m) => m.id === filters.memberIds[0])?.label ?? '1 member')
        : `${filters.memberIds.length} members`;

  return (
    <Stack gap={8} className={cn('w-full', className)} role="group" aria-label="Analytics filters">
      <Inline gap={8} align="center" wrap>
        {projectOptions.length > 0 ? (
          <Select
            value={filters.projectIds[0] ?? '__all__'}
            onValueChange={(value) => {
              if (value === '__all__') {
                onChange({ projectIds: [] });
                return;
              }
              onChange({
                projectIds: filters.projectIds.includes(value)
                  ? filters.projectIds.filter((id) => id !== value)
                  : [...filters.projectIds, value],
              });
            }}
          >
            <SelectTrigger size="sm" aria-label="Filter by project" className="w-[180px]">
              <SelectValue placeholder="Projects">{projectSummary}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All projects</SelectItem>
              {projectOptions.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {filters.projectIds.includes(project.id) ? `✓ ${project.label}` : project.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}

        {memberOptions.length > 0 ? (
          <Select
            value={filters.memberIds[0] ?? '__all__'}
            onValueChange={(value) => {
              if (value === '__all__') {
                onChange({ memberIds: [] });
                return;
              }
              onChange({
                memberIds: filters.memberIds.includes(value)
                  ? filters.memberIds.filter((id) => id !== value)
                  : [...filters.memberIds, value],
              });
            }}
          >
            <SelectTrigger size="sm" aria-label="Filter by member" className="w-[160px]">
              <SelectValue placeholder="Members">{memberSummary}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All members</SelectItem>
              {memberOptions.map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  {filters.memberIds.includes(member.id) ? `✓ ${member.label}` : member.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}

        <label className="inline-flex items-center gap-2 text-sm text-text-secondary">
          <Checkbox
            checked={filters.includeArchived}
            onCheckedChange={(checked) => onChange({ includeArchived: checked === true })}
            aria-label="Include archived"
            className="size-7"
          />
          <Text as="span" variant="caption">
            Include archived
          </Text>
        </label>

        {onReset ? (
          <Button type="button" size="sm" variant="ghost" onClick={onReset}>
            Reset
          </Button>
        ) : null}
      </Inline>

      <ToggleGroup
        label="Status"
        options={statusOptions}
        selected={filters.statuses}
        onToggle={(id) => onChange({ statuses: toggleId(filters.statuses, id) })}
      />
      <ToggleGroup
        label="Priority"
        options={priorityOptions}
        selected={filters.priorities}
        onToggle={(id) => onChange({ priorities: toggleId(filters.priorities, id) })}
      />
    </Stack>
  );
};

export type { AnalyticsFiltersProps, FilterOption };
