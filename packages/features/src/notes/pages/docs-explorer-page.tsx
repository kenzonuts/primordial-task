import { Plus } from 'lucide-react';
import type { ReactElement } from 'react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { DocumentExplorer, NoteErrorState, NoteSkeleton } from '@features/notes/components';
import { useNotesContext } from '@features/notes/context/notes-context';
import { useDocumentStore, useNotesStore } from '@features/notes/store';
import { docDetailPath, NOTES_ROUTES } from '@features/notes/types';
import { toast } from '@shared/ui/feedback/toast';
import { Button } from '@shared/ui/primitives/button';
import { Text } from '@shared/ui/typography/text';

export const DocsExplorerPage = (): ReactElement => {
  const navigate = useNavigate();
  const { workspaceId, status, loadNotes } = useNotesContext();
  const notes = useNotesStore((state) => state.notes);
  const error = useNotesStore((state) => state.error);
  const clearError = useNotesStore((state) => state.clearError);
  const createNote = useNotesStore((state) => state.createNote);
  const activeDocId = useDocumentStore((state) => state.activeDocId);
  const setActiveDocId = useDocumentStore((state) => state.setActiveDocId);

  const docs = useMemo(
    () =>
      notes.filter(
        (note) => note.isDocumentation && note.deletedAt == null && note.archivedAt == null,
      ),
    [notes],
  );

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
    return <NoteSkeleton />;
  }

  const createDoc = (): void => {
    if (!workspaceId) {
      toast.error('Select a workspace first.');
      return;
    }
    void createNote({
      workspaceId,
      title: 'Untitled doc',
      isDocumentation: true,
      noteType: 'documentation',
    })
      .then((note) => {
        setActiveDocId(note.id);
        navigate(docDetailPath(note.id));
      })
      .catch((err: unknown) => {
        toast.error(err instanceof Error ? err.message : 'Could not create documentation.');
      });
  };

  return (
    <div className="flex h-full min-h-0 flex-col" data-testid="docs-explorer-page">
      <div className="flex items-center gap-2 border-b border-border-default px-4 py-2">
        <Text as="h1" variant="h3" className="mr-auto">
          Documentation
        </Text>
        <Button type="button" variant="ghost" size="sm" onClick={() => navigate(NOTES_ROUTES.list)}>
          Notes
        </Button>
        <Button type="button" variant="primary" size="md" onClick={createDoc}>
          <Plus aria-hidden />
          New page
        </Button>
      </div>
      <DocumentExplorer
        docs={docs}
        activeDocId={activeDocId}
        emptyAction={
          <Button type="button" variant="primary" size="md" onClick={createDoc}>
            <Plus aria-hidden />
            Create documentation
          </Button>
        }
      >
        <div className="flex h-full items-center justify-center p-8">
          <Text variant="body-sm" muted>
            Select a page from the rail, or create a new documentation page.
          </Text>
        </div>
      </DocumentExplorer>
    </div>
  );
};
