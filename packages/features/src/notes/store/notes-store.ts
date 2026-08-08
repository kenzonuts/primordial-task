import { create } from 'zustand';

import { createNotesRepository } from '@features/notes/services/notes-repository';
import type {
  CreateNoteInput,
  Note,
  NoteSortKey,
  NoteFilterPreset,
  NotesFiltersState,
  UpdateNoteInput,
} from '@features/notes/types';

const repo = createNotesRepository();

interface NotesStoreState {
  readonly notes: Note[];
  readonly status: 'idle' | 'loading' | 'ready' | 'error';
  readonly error: string | null;
  readonly workspaceId: string | null;
  loadNotes(workspaceId: string): Promise<void>;
  createNote(input: CreateNoteInput): Promise<Note>;
  updateNote(workspaceId: string, id: string, input: UpdateNoteInput): Promise<Note>;
  moveNote(workspaceId: string, id: string, folderId: string | null): Promise<void>;
  archiveNote(workspaceId: string, id: string): Promise<void>;
  restoreNote(workspaceId: string, id: string): Promise<void>;
  softDeleteNote(workspaceId: string, id: string): Promise<void>;
  duplicateNote(workspaceId: string, id: string): Promise<Note>;
  toggleFavorite(workspaceId: string, id: string): Promise<void>;
  togglePinned(workspaceId: string, id: string): Promise<void>;
  clearError(): void;
}

export const useNotesStore = create<NotesStoreState>((set, get) => ({
  notes: [],
  status: 'idle',
  error: null,
  workspaceId: null,

  clearError: () => set({ error: null }),

  loadNotes: async (workspaceId) => {
    set({ status: 'loading', error: null, workspaceId });
    try {
      const notes = await repo.listNotes(workspaceId);
      set({ notes, status: 'ready' });
    } catch (error) {
      set({
        status: 'error',
        error: error instanceof Error ? error.message : 'Notes could not be loaded.',
      });
    }
  },

  createNote: async (input) => {
    const note = await repo.createNote(input);
    set({ notes: [note, ...get().notes] });
    return note;
  },

  updateNote: async (workspaceId, id, input) => {
    const updated = await repo.updateNote(workspaceId, id, input);
    set({ notes: get().notes.map((note) => (note.id === id ? updated : note)) });
    return updated;
  },

  moveNote: async (workspaceId, id, folderId) => {
    const updated = await repo.moveNote(workspaceId, id, folderId);
    set({ notes: get().notes.map((note) => (note.id === id ? updated : note)) });
  },

  archiveNote: async (workspaceId, id) => {
    const updated = await repo.archiveNote(workspaceId, id);
    set({ notes: get().notes.map((note) => (note.id === id ? updated : note)) });
  },

  restoreNote: async (workspaceId, id) => {
    const updated = await repo.restoreNote(workspaceId, id);
    set({ notes: get().notes.map((note) => (note.id === id ? updated : note)) });
  },

  softDeleteNote: async (workspaceId, id) => {
    await repo.softDeleteNote(workspaceId, id);
    set({
      notes: get().notes.map((note) =>
        note.id === id ? { ...note, deletedAt: Date.now() } : note,
      ),
    });
  },

  duplicateNote: async (workspaceId, id) => {
    const duplicate = await repo.duplicateNote(workspaceId, id);
    set({ notes: [duplicate, ...get().notes] });
    return duplicate;
  },

  toggleFavorite: async (workspaceId, id) => {
    const note = get().notes.find((item) => item.id === id);
    if (!note) {
      return;
    }
    await get().updateNote(workspaceId, id, { isFavorite: !note.isFavorite });
  },

  togglePinned: async (workspaceId, id) => {
    const note = get().notes.find((item) => item.id === id);
    if (!note) {
      return;
    }
    await get().updateNote(workspaceId, id, { isPinned: !note.isPinned });
  },
}));

export { repo as notesRepository };

export const filterNotes = (notes: readonly Note[], filters: NotesFiltersState): Note[] => {
  let items = [...notes];

  if (filters.preset === 'trash') {
    items = items.filter((note) => note.deletedAt !== null);
  } else {
    items = items.filter((note) => note.deletedAt === null);
    if (filters.preset === 'archived') {
      items = items.filter((note) => note.archivedAt !== null);
    } else {
      items = items.filter((note) => note.archivedAt === null);
    }
  }

  if (filters.preset === 'favorites') {
    items = items.filter((note) => note.isFavorite);
  } else if (filters.preset === 'pinned') {
    items = items.filter((note) => note.isPinned);
  } else if (filters.preset === 'recent') {
    items = items
      .filter((note) => note.lastViewedAt != null)
      .sort((a, b) => (b.lastViewedAt ?? 0) - (a.lastViewedAt ?? 0));
  } else if (filters.preset === 'documentation') {
    items = items.filter((note) => note.isDocumentation);
  } else if (filters.preset === 'all') {
    items = items.filter((note) => !note.isDocumentation);
  }

  if (filters.folderId) {
    items = items.filter((note) => note.folderId === filters.folderId);
  }
  if (filters.projectId) {
    items = items.filter((note) => note.projectId === filters.projectId);
  }
  if (filters.tags.length > 0) {
    items = items.filter((note) => note.tags.some((tag) => filters.tags.includes(tag.name)));
  }
  if (filters.noteTypes.length > 0) {
    items = items.filter((note) => filters.noteTypes.includes(note.noteType));
  }

  const query = filters.query.trim().toLowerCase();
  if (query) {
    items = items.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.excerpt.toLowerCase().includes(query) ||
        note.markdownCache.toLowerCase().includes(query) ||
        note.author.fullName.toLowerCase().includes(query) ||
        note.tags.some((tag) => tag.name.toLowerCase().includes(query)),
    );
  }

  if (filters.preset !== 'recent') {
    items.sort((left, right) => {
      if (filters.sort === 'title') {
        return left.title.localeCompare(right.title);
      }
      if (filters.sort === 'created') {
        return right.createdAt - left.createdAt;
      }
      if (filters.sort === 'favorites') {
        return Number(right.isFavorite) - Number(left.isFavorite);
      }
      if (filters.sort === 'pinned') {
        return Number(right.isPinned) - Number(left.isPinned);
      }
      return right.updatedAt - left.updatedAt;
    });
  }

  return items;
};

export type { NoteSortKey, NoteFilterPreset };
