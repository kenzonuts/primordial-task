import { LayoutGrid, List, ListTree, Plus } from 'lucide-react';
import type { ReactElement, ReactNode } from 'react';

import { NoteFilter } from '@features/notes/components/note-filter';
import { NoteSearch } from '@features/notes/components/note-search';
import { NoteSort } from '@features/notes/components/note-sort';
import type { NotesFiltersState, NoteSortKey, NoteViewMode } from '@features/notes/types';
import { Inline } from '@shared/ui/layout/inline';
import { cn } from '@shared/ui/lib/cn';
import { Button } from '@shared/ui/primitives/button';
import { Text } from '@shared/ui/typography/text';

type NoteToolbarProps = {
  readonly title?: string;
  readonly filters: NotesFiltersState;
  readonly searchValue: string;
  readonly onSearchChange: (value: string) => void;
  readonly onFiltersChange: (partial: Partial<NotesFiltersState>) => void;
  readonly onResetFilters?: () => void;
  readonly onCreate?: () => void;
  readonly trailing?: ReactNode;
  readonly className?: string;
};

const VIEW_OPTIONS: readonly {
  readonly id: NoteViewMode;
  readonly label: string;
  readonly icon: typeof List;
}[] = [
  { id: 'list', label: 'List view', icon: List },
  { id: 'grid', label: 'Grid view', icon: LayoutGrid },
  { id: 'tree', label: 'Tree view', icon: ListTree },
];

export const NoteToolbar = ({
  title = 'Notes',
  filters,
  searchValue,
  onSearchChange,
  onFiltersChange,
  onResetFilters,
  onCreate,
  trailing,
  className,
}: NoteToolbarProps): ReactElement => {
  return (
    <div
      className={cn(
        'flex shrink-0 flex-col gap-2 border-b border-border-default px-4 py-3',
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Text as="h1" variant="h3" className="mr-auto">
          {title}
        </Text>
        <NoteSearch value={searchValue} onChange={onSearchChange} />
        <NoteSort
          value={filters.sort}
          onChange={(sort: NoteSortKey) => onFiltersChange({ sort })}
        />
        <div
          role="group"
          aria-label="View mode"
          className="flex items-center rounded-md border border-border-subtle"
        >
          {VIEW_OPTIONS.map((option) => {
            const Icon = option.icon;
            const active = filters.view === option.id;
            return (
              <Button
                key={option.id}
                type="button"
                size="sm"
                variant="ghost"
                aria-label={option.label}
                aria-pressed={active}
                className={cn('size-8 rounded-none p-0', active && 'bg-state-selected')}
                onClick={() => onFiltersChange({ view: option.id })}
              >
                <Icon className="size-3.5" aria-hidden />
              </Button>
            );
          })}
        </div>
        {onCreate ? (
          <Button type="button" variant="primary" size="md" onClick={onCreate}>
            <Plus aria-hidden />
            New note
          </Button>
        ) : null}
        {trailing}
      </div>
      <Inline gap={8} align="center" wrap>
        <NoteFilter filters={filters} onChange={onFiltersChange} onReset={onResetFilters} />
      </Inline>
    </div>
  );
};

export type { NoteToolbarProps };
