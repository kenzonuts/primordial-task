import type { ReactElement } from 'react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  NoteErrorState,
  NotesExplorer,
  NoteSkeleton,
  NoteToolbar,
} from '@features/notes/components';
import { useNotesContext } from '@features/notes/context/notes-context';
import {
  filterNotes,
  useNotesFilterStore,
  useNotesSearchStore,
  useNotesStore,
} from '@features/notes/store';
import { noteDetailPath, NOTES_ROUTES } from '@features/notes/types';
import { toast } from '@shared/ui/feedback/toast';
import { Button } from '@shared/ui/primitives/button';

export const TrashPage = (): ReactElement => {
  const navigate = useNavigate();
  const { workspaceId, status, loadNotes } = useNotesContext();
  const notes = useNotesStore((state) => state.notes);
  const error = useNotesStore((state) => state.error);
  const clearError = useNotesStore((state) => state.clearError);
  const restoreNote = useNotesStore((state) => state.restoreNote);

  const filters = useNotesFilterStore((state) => state.filters);
  const setFilters = useNotesFilterStore((state) => state.setFilters);
  const searchValue = useNotesSearchStore((state) => state.query);
  const setSearch = useNotesSearchStore((state) => state.setQuery);

  const trashFilters = useMemo(() => ({ ...filters, preset: 'trash' as const }), [filters]);
  const filtered = useMemo(() => filterNotes(notes, trashFilters), [notes, trashFilters]);

  if (status === 'error') {
    return (
      <NoteErrorState
        message={error ?? undefined}
        onRetry={() => {
          clearError();
          void loadNotes();
        }}
      />
    );
  }

  if (status === 'idle' || status === 'loading') {
    return <NoteSkeleton withSidebar={false} />;
  }

  return (
    <div className="flex h-full min-h-0 flex-col" data-testid="trash-page">
      <NoteToolbar
        title="Trash"
        filters={trashFilters}
        searchValue={searchValue}
        onSearchChange={setSearch}
        onFiltersChange={(partial) => setFilters({ ...partial, preset: 'trash' })}
        trailing={
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => navigate(NOTES_ROUTES.list)}
          >
            Back to notes
          </Button>
        }
      />
      <div className="min-h-0 flex-1 overflow-auto">
        <NotesExplorer
          notes={filtered}
          view={filters.view}
          emptyVariant="trash"
          onOpen={(note) => navigate(noteDetailPath(note.id))}
          onRestore={(note) => {
            if (!workspaceId) {
              return;
            }
            void restoreNote(workspaceId, note.id)
              .then(() => toast.success('Note restored.'))
              .catch((err: unknown) => {
                toast.error(err instanceof Error ? err.message : 'Could not restore note.');
              });
          }}
        />
      </div>
    </div>
  );
};
