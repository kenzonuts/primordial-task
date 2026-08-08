import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { notesRepository } from '@features/notes/store/notes-store';
import type { CreateFolderInput, NoteFolder } from '@features/notes/types';

interface FoldersStoreState {
  readonly folders: NoteFolder[];
  readonly expandedIds: ReadonlySet<string>;
  readonly status: 'idle' | 'loading' | 'ready' | 'error';
  readonly error: string | null;
  loadFolders(workspaceId: string): Promise<void>;
  createFolder(input: CreateFolderInput): Promise<NoteFolder>;
  renameFolder(workspaceId: string, id: string, name: string): Promise<void>;
  moveFolder(workspaceId: string, id: string, parentId: string | null): Promise<void>;
  deleteFolder(workspaceId: string, id: string): Promise<void>;
  toggleExpanded(id: string): void;
  expandAll(ids: readonly string[]): void;
}

export const useFoldersStore = create<FoldersStoreState>()(
  persist(
    (set, get) => ({
      folders: [],
      expandedIds: new Set(),
      status: 'idle',
      error: null,

      loadFolders: async (workspaceId) => {
        set({ status: 'loading', error: null });
        try {
          const folders = await notesRepository.listFolders(workspaceId);
          set({ folders, status: 'ready' });
        } catch (error) {
          set({
            status: 'error',
            error: error instanceof Error ? error.message : 'Folders could not be loaded.',
          });
        }
      },

      createFolder: async (input) => {
        const folder = await notesRepository.createFolder(input);
        set({ folders: [...get().folders, folder] });
        return folder;
      },

      renameFolder: async (workspaceId, id, name) => {
        const updated = await notesRepository.renameFolder(workspaceId, id, name);
        set({
          folders: get().folders.map((folder) => (folder.id === id ? updated : folder)),
        });
      },

      moveFolder: async (workspaceId, id, parentId) => {
        const updated = await notesRepository.moveFolder(workspaceId, id, parentId);
        set({
          folders: get().folders.map((folder) => (folder.id === id ? updated : folder)),
        });
      },

      deleteFolder: async (workspaceId, id) => {
        await notesRepository.deleteFolder(workspaceId, id);
        set({ folders: get().folders.filter((folder) => folder.id !== id) });
      },

      toggleExpanded: (id) => {
        const next = new Set(get().expandedIds);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        set({ expandedIds: next });
      },

      expandAll: (ids) => set({ expandedIds: new Set(ids) }),
    }),
    {
      name: 'primordial-notes-folders-ui',
      partialize: (state) => ({
        expandedIds: [...state.expandedIds],
      }),
      merge: (persisted, current) => {
        const data = persisted as { expandedIds?: string[] } | undefined;
        return {
          ...current,
          ...(data ?? {}),
          expandedIds: new Set(data?.expandedIds ?? []),
        };
      },
    },
  ),
);
