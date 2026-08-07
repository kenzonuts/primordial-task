import type { ReactElement, ReactNode } from 'react';

import { WorkspaceFilter } from '@features/workspace/components/workspace-filter';
import { WorkspaceSearch } from '@features/workspace/components/workspace-search';
import type { WorkspaceFilterKey, WorkspaceSortKey } from '@features/workspace/types';
import { Inline } from '@shared/ui/layout/inline';
import { cn } from '@shared/ui/lib/cn';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/ui/primitives/select';

type WorkspaceToolbarProps = {
  readonly query: string;
  readonly onQueryChange: (value: string) => void;
  readonly sort: WorkspaceSortKey;
  readonly onSortChange: (value: WorkspaceSortKey) => void;
  readonly filter: WorkspaceFilterKey;
  readonly onFilterChange: (value: WorkspaceFilterKey) => void;
  readonly createAction?: ReactNode;
  readonly disabled?: boolean;
  readonly className?: string;
};

const SORT_OPTIONS: ReadonlyArray<{
  readonly value: WorkspaceSortKey;
  readonly label: string;
}> = [
  { value: 'recent', label: 'Recently used' },
  { value: 'name', label: 'Name' },
  { value: 'created', label: 'Date created' },
  { value: 'favorites', label: 'Favorites first' },
];

export const WorkspaceToolbar = ({
  query,
  onQueryChange,
  sort,
  onSortChange,
  filter,
  onFilterChange,
  createAction,
  disabled = false,
  className,
}: WorkspaceToolbarProps): ReactElement => {
  return (
    <Inline gap={12} align="center" justify="between" className={cn('w-full flex-wrap', className)}>
      <Inline gap={12} align="center" className="min-w-0 flex-1 flex-wrap">
        <WorkspaceSearch value={query} onChange={onQueryChange} disabled={disabled} />
        <WorkspaceFilter value={filter} onChange={onFilterChange} disabled={disabled} />
        <Select
          value={sort}
          onValueChange={(value) => onSortChange(value as WorkspaceSortKey)}
          disabled={disabled}
        >
          <SelectTrigger size="md" aria-label="Sort workspaces" className="w-[180px]">
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
      </Inline>
      {createAction ? (
        <Inline gap={8} align="center" className="shrink-0">
          {createAction}
        </Inline>
      ) : null}
    </Inline>
  );
};

export type { WorkspaceToolbarProps };
