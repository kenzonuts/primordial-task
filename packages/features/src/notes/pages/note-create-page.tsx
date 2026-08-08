import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  CreateNoteDialog,
  type CreateNoteSubmitValues,
  NoteErrorState,
} from '@features/notes/components';
import { useNotesContext } from '@features/notes/context/notes-context';
import { useFoldersStore, useNotesStore, notesRepository } from '@features/notes/store';
import type { NoteTemplate } from '@features/notes/types';
import { noteDetailPath, NOTES_ROUTES } from '@features/notes/types';
import { toast } from '@shared/ui/feedback/toast';

/**
 * Dedicated create route — opens the create dialog and redirects after success.
 */
export const NoteCreatePage = (): ReactElement => {
  const navigate = useNavigate();
  const { workspaceId } = useNotesContext();
  const folders = useFoldersStore((state) => state.folders);
  const createNote = useNotesStore((state) => state.createNote);
  const [templates, setTemplates] = useState<NoteTemplate[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!workspaceId) {
      return;
    }
    void notesRepository
      .listTemplates(workspaceId)
      .then(setTemplates)
      .catch(() => {
        setTemplates([]);
      });
  }, [workspaceId]);

  if (!workspaceId) {
    return <NoteErrorState title="No workspace" message="Select a workspace to create notes." />;
  }

  const handleSubmit = async (values: CreateNoteSubmitValues): Promise<void> => {
    setBusy(true);
    try {
      const note = await createNote({
        workspaceId,
        title: values.title,
        folderId: values.folderId,
        templateId: values.templateId,
      });
      navigate(noteDetailPath(note.id), { replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not create note.');
      setBusy(false);
    }
  };

  return (
    <CreateNoteDialog
      open
      onOpenChange={(open) => {
        if (!open) {
          navigate(NOTES_ROUTES.list, { replace: true });
        }
      }}
      folders={folders}
      templates={templates}
      loading={busy}
      onSubmit={handleSubmit}
    />
  );
};
