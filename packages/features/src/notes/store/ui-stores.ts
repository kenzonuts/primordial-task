import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { DEFAULT_NOTES_PREFERENCES } from '@features/notes/constants';
import { createLocalCollaborationAdapter } from '@features/notes/services/collaboration';
import { notesRepository } from '@features/notes/store/notes-store';
import type {
  NoteComment,
  NoteFilterPreset,
  NotesFiltersState,
  NotesPreferences,
  NoteSortKey,
  NoteVersion,
  NoteViewMode,
  PresenceUser,
} from '@features/notes/types';

interface FilterStoreState {
  readonly filters: NotesFiltersState;
  setFilters(partial: Partial<NotesFiltersState>): void;
  resetFilters(): void;
}

export const useNotesFilterStore = create<FilterStoreState>()(
  persist(
    (set, get) => ({
      filters: {
        query: '',
        sort: 'updated',
        preset: 'all',
        view: 'list',
        folderId: null,
        tags: [],
        noteTypes: [],
        projectId: null,
      },
      setFilters: (partial) => set({ filters: { ...get().filters, ...partial } }),
      resetFilters: () =>
        set({
          filters: {
            query: '',
            sort: 'updated' as NoteSortKey,
            preset: 'all' as NoteFilterPreset,
            view: 'list' as NoteViewMode,
            folderId: null,
            tags: [],
            noteTypes: [],
            projectId: null,
          },
        }),
    }),
    { name: 'primordial-notes-filters', partialize: (state) => ({ filters: state.filters }) },
  ),
);

interface SearchStoreState {
  readonly query: string;
  setQuery(query: string): void;
  clear(): void;
}

export const useNotesSearchStore = create<SearchStoreState>((set) => ({
  query: '',
  setQuery: (query) => {
    set({ query });
    useNotesFilterStore.getState().setFilters({ query });
  },
  clear: () => {
    set({ query: '' });
    useNotesFilterStore.getState().setFilters({ query: '' });
  },
}));

interface HistoryStoreState {
  readonly versions: NoteVersion[];
  readonly selectedVersionId: string | null;
  readonly status: 'idle' | 'loading' | 'ready' | 'error';
  loadHistory(workspaceId: string, noteId: string): Promise<void>;
  createSnapshot(workspaceId: string, noteId: string, label?: string): Promise<void>;
  restoreVersion(workspaceId: string, noteId: string, versionId: string): Promise<void>;
  selectVersion(id: string | null): void;
  clear(): void;
}

export const useHistoryStore = create<HistoryStoreState>((set) => ({
  versions: [],
  selectedVersionId: null,
  status: 'idle',
  loadHistory: async (workspaceId, noteId) => {
    set({ status: 'loading' });
    const versions = await notesRepository.listVersions(workspaceId, noteId);
    set({ versions, status: 'ready' });
  },
  createSnapshot: async (workspaceId, noteId, label) => {
    const version = await notesRepository.createVersion(workspaceId, noteId, label ?? null);
    set((state) => ({ versions: [version, ...state.versions] }));
  },
  restoreVersion: async (workspaceId, noteId, versionId) => {
    await notesRepository.restoreVersion(workspaceId, noteId, versionId);
    const versions = await notesRepository.listVersions(workspaceId, noteId);
    set({ versions });
  },
  selectVersion: (selectedVersionId) => set({ selectedVersionId }),
  clear: () => set({ versions: [], selectedVersionId: null, status: 'idle' }),
}));

interface CommentsStoreState {
  readonly comments: NoteComment[];
  readonly status: 'idle' | 'loading' | 'ready' | 'error';
  loadComments(workspaceId: string, noteId: string): Promise<void>;
  addComment(
    workspaceId: string,
    noteId: string,
    body: string,
    parentId?: string | null,
  ): Promise<void>;
  updateComment(
    workspaceId: string,
    noteId: string,
    commentId: string,
    body: string,
  ): Promise<void>;
  deleteComment(workspaceId: string, noteId: string, commentId: string): Promise<void>;
  resolveComment(
    workspaceId: string,
    noteId: string,
    commentId: string,
    resolved: boolean,
  ): Promise<void>;
  clear(): void;
}

export const useCommentsStore = create<CommentsStoreState>((set, get) => ({
  comments: [],
  status: 'idle',
  loadComments: async (workspaceId, noteId) => {
    set({ status: 'loading' });
    const comments = await notesRepository.listComments(workspaceId, noteId);
    set({ comments, status: 'ready' });
  },
  addComment: async (workspaceId, noteId, body, parentId = null) => {
    const comment = await notesRepository.addComment(workspaceId, noteId, body, parentId);
    set({ comments: [...get().comments, comment] });
  },
  updateComment: async (workspaceId, noteId, commentId, body) => {
    const updated = await notesRepository.updateComment(workspaceId, noteId, commentId, body);
    set({
      comments: get().comments.map((comment) => (comment.id === commentId ? updated : comment)),
    });
  },
  deleteComment: async (workspaceId, noteId, commentId) => {
    await notesRepository.deleteComment(workspaceId, noteId, commentId);
    set({
      comments: get().comments.filter(
        (comment) => comment.id !== commentId && comment.parentId !== commentId,
      ),
    });
  },
  resolveComment: async (workspaceId, noteId, commentId, resolved) => {
    const updated = await notesRepository.resolveComment(workspaceId, noteId, commentId, resolved);
    set({
      comments: get().comments.map((comment) => (comment.id === commentId ? updated : comment)),
    });
  },
  clear: () => set({ comments: [], status: 'idle' }),
}));

interface PreferenceStoreState {
  readonly preferences: NotesPreferences;
  updatePreferences(prefs: Partial<NotesPreferences>): void;
}

export const useNotesPreferenceStore = create<PreferenceStoreState>()(
  persist(
    (set, get) => ({
      preferences: { ...DEFAULT_NOTES_PREFERENCES },
      updatePreferences: (prefs) => {
        const preferences = { ...get().preferences, ...prefs };
        set({ preferences });
        if (prefs.defaultView) {
          useNotesFilterStore.getState().setFilters({ view: prefs.defaultView });
        }
      },
    }),
    {
      name: 'primordial-notes-preferences',
      partialize: (state) => ({ preferences: state.preferences }),
    },
  ),
);

const collab = createLocalCollaborationAdapter();

interface PresenceStoreState {
  readonly users: readonly PresenceUser[];
  readonly status: 'idle' | 'connected' | 'disconnected';
  connect(noteId: string): Promise<void>;
  disconnect(noteId: string): Promise<void>;
}

export const usePresenceStore = create<PresenceStoreState>((set) => ({
  users: [],
  status: 'idle',
  connect: async (noteId) => {
    await collab.connect(noteId);
    const users = await collab.getPresence(noteId);
    set({ users, status: 'connected' });
  },
  disconnect: async (noteId) => {
    await collab.disconnect(noteId);
    set({ users: [], status: 'disconnected' });
  },
}));

/** Documentation hierarchy helpers live beside notes — same entity, isDocumentation flag. */
interface DocumentStoreState {
  readonly activeDocId: string | null;
  setActiveDocId(id: string | null): void;
  reorder(
    workspaceId: string,
    orderedIds: readonly string[],
    parentDocId: string | null,
  ): Promise<void>;
}

export const useDocumentStore = create<DocumentStoreState>((set) => ({
  activeDocId: null,
  setActiveDocId: (activeDocId) => set({ activeDocId }),
  reorder: async (workspaceId, orderedIds, parentDocId) => {
    await notesRepository.reorderDocs(workspaceId, orderedIds, parentDocId);
  },
}));
