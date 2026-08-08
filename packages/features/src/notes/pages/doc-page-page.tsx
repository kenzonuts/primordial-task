import { ArrowLeft, Pencil } from 'lucide-react';
import type { ReactElement } from 'react';
import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  DocBreadcrumb,
  DocPage,
  DocumentExplorer,
  NoteEditor,
  NoteErrorState,
  NoteSkeleton,
} from '@features/notes/components';
import { useNotesContext } from '@features/notes/context/notes-context';
import { useDocumentStore, useEditorStore, useNotesStore } from '@features/notes/store';
import { noteDetailPath, NOTES_ROUTES } from '@features/notes/types';
import { Button } from '@shared/ui/primitives/button';
import { Text } from '@shared/ui/typography/text';

export const DocPagePage = (): ReactElement => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { workspaceId, status } = useNotesContext();

  const notes = useNotesStore((state) => state.notes);
  const loadNote = useEditorStore((state) => state.loadNote);
  const activeNote = useEditorStore((state) => state.activeNote);
  const saveState = useEditorStore((state) => state.saveState);
  const clearEditor = useEditorStore((state) => state.clear);
  const setActiveDocId = useDocumentStore((state) => state.setActiveDocId);

  const docs = useMemo(
    () =>
      notes.filter(
        (note) => note.isDocumentation && note.deletedAt == null && note.archivedAt == null,
      ),
    [notes],
  );

  const breadcrumbs = useMemo(() => {
    const byId = new Map(docs.map((doc) => [doc.id, doc]));
    const chain: { id: string; title: string }[] = [];
    let cursor: string | null = id;
    const seen = new Set<string>();
    while (cursor && !seen.has(cursor)) {
      seen.add(cursor);
      const doc = byId.get(cursor);
      if (!doc) {
        break;
      }
      chain.unshift({ id: doc.id, title: doc.title || 'Untitled' });
      cursor = doc.parentDocId;
    }
    return chain;
  }, [docs, id]);

  useEffect(() => {
    setActiveDocId(id);
    if (workspaceId && id) {
      void loadNote(workspaceId, id);
    }
    return () => {
      clearEditor();
    };
  }, [workspaceId, id, loadNote, clearEditor, setActiveDocId]);

  if (!workspaceId) {
    return <NoteErrorState title="No workspace" message="Select a workspace to view docs." />;
  }

  if (status === 'idle' || status === 'loading' || (saveState === 'syncing' && !activeNote)) {
    return <NoteSkeleton />;
  }

  if (!activeNote || !activeNote.isDocumentation) {
    return (
      <NoteErrorState
        title="Page not found"
        message="This documentation page could not be loaded."
        action={
          <Button type="button" variant="ghost" onClick={() => navigate(NOTES_ROUTES.docs)}>
            Back to docs
          </Button>
        }
      />
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col" data-testid="doc-page-page">
      <div className="flex items-center gap-2 border-b border-border-default px-4 py-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label="Back to docs"
          onClick={() => navigate(NOTES_ROUTES.docs)}
        >
          <ArrowLeft className="size-4" aria-hidden />
        </Button>
        <Text as="span" variant="body-sm" className="mr-auto truncate font-medium">
          {activeNote.title}
        </Text>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => navigate(noteDetailPath(id))}
        >
          <Pencil className="size-3.5" aria-hidden />
          Edit
        </Button>
      </div>
      <DocumentExplorer docs={docs} activeDocId={id}>
        <DocPage header={<DocBreadcrumb items={breadcrumbs} />}>
          <NoteEditor workspaceId={workspaceId} noteId={id} />
        </DocPage>
      </DocumentExplorer>
    </div>
  );
};
