import { LayoutGrid, List } from 'lucide-react';
import type { ReactElement, ReactNode } from 'react';

import { ProjectFilter } from '@features/project/components/project-filter';
import { ProjectSearch } from '@features/project/components/project-search';
import type { ProjectFilterKey, ProjectSortKey, ProjectViewMode } from '@features/project/types';
import { Inline } from '@shared/ui/layout/inline';
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

type ProjectToolbarProps = {
  readonly query: string;
  readonly onQueryChange: (value: string) => void;
  readonly sort: ProjectSortKey;
  readonly onSortChange: (value: ProjectSortKey) => void;
  readonly filter: ProjectFilterKey;
  readonly onFilterChange: (value: ProjectFilterKey) => void;
  readonly view: ProjectViewMode;
  readonly onViewChange: (value: ProjectViewMode) => void;
  readonly createAction?: ReactNode;
  readonly disabled?: boolean;
  readonly className?: string;
};

const SORT_OPTIONS: ReadonlyArray<{
  readonly value: ProjectSortKey;
  readonly label: string;
}> = [
  { value: 'updated', label: 'Recently updated' },
  { value: 'name', label: 'Name' },
  { value: 'status', label: 'Status' },
  { value: 'progress', label: 'Progress' },
  { value: 'favorites', label: 'Favorites first' },
  { value: 'pinned', label: 'Pinned first' },
];

export const ProjectToolbar = ({
  query,
  onQueryChange,
  sort,
  onSortChange,
  filter,
  onFilterChange,
  view,
  onViewChange,
  createAction,
  disabled = false,
  className,
}: ProjectToolbarProps): ReactElement => {
  return (
    <Inline gap={12} align="center" justify="between" className={cn('w-full flex-wrap', className)}>
      <Inline gap={12} align="center" className="min-w-0 flex-1 flex-wrap">
        <ProjectSearch value={query} onChange={onQueryChange} disabled={disabled} />
        <ProjectFilter value={filter} onChange={onFilterChange} disabled={disabled} />
        <Select
          value={sort}
          onValueChange={(value) => onSortChange(value as ProjectSortKey)}
          disabled={disabled}
        >
          <SelectTrigger size="md" aria-label="Sort projects" className="w-[180px]">
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
                  variant={view === 'grid' ? 'selected' : 'ghost'}
                  disabled={disabled}
                  aria-label="Grid view"
                  aria-pressed={view === 'grid'}
                  onClick={() => onViewChange('grid')}
                >
                  <LayoutGrid aria-hidden="true" />
                </IconButton>
              </TooltipTrigger>
              <TooltipContent side="top">Grid view</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <IconButton
                  type="button"
                  size="sm"
                  variant={view === 'list' ? 'selected' : 'ghost'}
                  disabled={disabled}
                  aria-label="List view"
                  aria-pressed={view === 'list'}
                  onClick={() => onViewChange('list')}
                >
                  <List aria-hidden="true" />
                </IconButton>
              </TooltipTrigger>
              <TooltipContent side="top">List view</TooltipContent>
            </Tooltip>
          </Inline>
        </TooltipProvider>
      </Inline>

      {createAction ? (
        <Inline gap={8} align="center" className="shrink-0">
          {createAction}
        </Inline>
      ) : null}
    </Inline>
  );
};

export type { ProjectToolbarProps };
