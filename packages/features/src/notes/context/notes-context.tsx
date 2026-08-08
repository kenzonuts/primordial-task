import type { PropsWithChildren, ReactElement } from 'react';
import { createContext, useContext, useEffect, useMemo } from 'react';

import { useFoldersStore } from '@features/notes/store/folders-store';
import { useNotesStore } from '@features/notes/store/notes-store';
import type { Note } from '@features/notes/types';
import { useWorkspaceContext } from '@features/workspace/context/workspace-context';

export interface NotesContextValue {
  readonly workspaceId: string | null;
  readonly notes: readonly Note[];
  readonly status: 'idle' | 'loading' | 'ready' | 'error';
  readonly loadNotes: () => Promise<void>;
}

const NotesContext = createContext<NotesContextValue | null>(null);

export const NotesProvider = ({ children }: PropsWithChildren): ReactElement => {
  const { currentWorkspace } = useWorkspaceContext();
  const workspaceId = currentWorkspace?.id ?? null;
  const notes = useNotesStore((state) => state.notes);
  const status = useNotesStore((state) => state.status);
  const loadNotes = useNotesStore((state) => state.loadNotes);
  const loadFolders = useFoldersStore((state) => state.loadFolders);

  useEffect(() => {
    if (!workspaceId) {
      return;
    }
    void loadNotes(workspaceId);
    void loadFolders(workspaceId);
  }, [workspaceId, loadNotes, loadFolders]);

  const value = useMemo<NotesContextValue>(
    () => ({
      workspaceId,
      notes,
      status,
      loadNotes: async () => {
        if (!workspaceId) {
          return;
        }
        await loadNotes(workspaceId);
      },
    }),
    [workspaceId, notes, status, loadNotes],
  );

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
};

export const useNotesContext = (): NotesContextValue => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotesContext must be used within NotesProvider');
  }
  return context;
};
