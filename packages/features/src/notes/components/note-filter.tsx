import type { ReactElement } from 'react';

import type { NoteFilterPreset, NotesFiltersState } from '@features/notes/types';
import { Inline } from '@shared/ui/layout/inline';
import { cn } from '@shared/ui/lib/cn';
import { Button } from '@shared/ui/primitives/button';

type NoteFilterProps = {
  readonly filters: NotesFiltersState;
  readonly onChange: (partial: Partial<NotesFiltersState>) => void;
  readonly onReset?: () => void;
  readonly className?: string;
  readonly disabled?: boolean;
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

const PRESET_CHIPS: readonly { readonly id: NoteFilterPreset; readonly label: string }[] = [
  { id: 'favorites', label: 'Favorites' },
  { id: 'pinned', label: 'Pinned' },
  { id: 'recent', label: 'Recent' },
];

export const NoteFilter = ({
  filters,
  onChange,
  onReset,
  className,
  disabled = false,
}: NoteFilterProps): ReactElement => {
  const hasActive =
    filters.preset !== 'all' ||
    filters.tags.length > 0 ||
    filters.noteTypes.length > 0 ||
    filters.folderId != null ||
    filters.query.trim().length > 0;

  return (
    <Inline
      gap={4}
      align="center"
      wrap
      role="group"
      aria-label="Note filters"
      className={cn('min-w-0', className)}
    >
      {PRESET_CHIPS.map((chip) => (
        <ToggleChip
          key={chip.id}
          label={chip.label}
          active={filters.preset === chip.id}
          disabled={disabled}
          onClick={() =>
            onChange({
              preset: filters.preset === chip.id ? 'all' : chip.id,
              folderId: null,
            })
          }
        />
      ))}
      {hasActive && onReset ? (
        <>
          <span className="mx-1 h-4 w-px bg-border-subtle" aria-hidden="true" />
          <Button
            type="button"
            size="sm"
            variant="ghost"
            disabled={disabled}
            onClick={onReset}
            className="h-7 px-2.5"
          >
            Clear
          </Button>
        </>
      ) : null}
    </Inline>
  );
};

export type { NoteFilterProps };
