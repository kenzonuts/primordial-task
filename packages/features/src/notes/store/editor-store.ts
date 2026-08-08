import { create } from 'zustand';

import { createNotesOfflineStore } from '@features/notes/services/offline-store';
import { notesRepository, useNotesStore } from '@features/notes/store/notes-store';
import type { EditorSaveState, Note, NoteDocumentJson } from '@features/notes/types';
import { docToMarkdown } from '@features/notes/utils/content-utils';

const offline = createNotesOfflineStore();

interface EditorStoreState {
  readonly activeNote: Note | null;
  readonly saveState: EditorSaveState;
  readonly dirty: boolean;
  readonly lastSavedAt: number | null;
  readonly error: string | null;
  loadNote(workspaceId: string, id: string): Promise<Note | null>;
  setActiveNote(note: Note | null): void;
  setLocalContent(content: NoteDocumentJson): void;
  markDirty(): void;
  save(workspaceId: string, options?: { force?: boolean }): Promise<void>;
  clear(): void;
}

let saveTimer: ReturnType<typeof globalThis.setTimeout> | null = null;
let pendingContent: NoteDocumentJson | null = null;

export const useEditorStore = create<EditorStoreState>((set, get) => ({
  activeNote: null,
  saveState: 'idle',
  dirty: false,
  lastSavedAt: null,
  error: null,

  loadNote: async (workspaceId, id) => {
    set({ saveState: 'syncing', error: null });
    try {
      const note = await notesRepository.getNote(workspaceId, id);
      if (!note) {
        set({ activeNote: null, saveState: 'error', error: 'Note not found.' });
        return null;
      }
      const draft = (await offline.getDraft(id)) as NoteDocumentJson | null;
      const active = draft ? { ...note, content: draft } : note;
      set({
        activeNote: active,
        saveState: draft ? 'dirty' : 'saved',
        dirty: Boolean(draft),
        lastSavedAt: note.updatedAt,
      });
      return active;
    } catch (error) {
      set({
        saveState: 'error',
        error: error instanceof Error ? error.message : 'Note could not be loaded.',
      });
      return null;
    }
  },

  setActiveNote: (note) => set({ activeNote: note }),

  setLocalContent: (content) => {
    const active = get().activeNote;
    if (!active) {
      return;
    }
    pendingContent = content;
    set({
      activeNote: {
        ...active,
        content,
        markdownCache: docToMarkdown(content),
      },
      dirty: true,
      saveState: navigator.onLine ? 'dirty' : 'offline',
    });
    void offline.saveDraft(active.id, content);
  },

  markDirty: () => set({ dirty: true, saveState: navigator.onLine ? 'dirty' : 'offline' }),

  save: async (workspaceId, options = {}) => {
    const active = get().activeNote;
    if (!active) {
      return;
    }
    const content = pendingContent ?? active.content;
    const run = async (): Promise<void> => {
      set({ saveState: navigator.onLine ? 'saving' : 'offline' });
      try {
        if (!navigator.onLine) {
          await offline.enqueue({
            id: `q-${Date.now()}`,
            noteId: active.id,
            kind: 'update',
            payload: { content },
            createdAt: Date.now(),
            attempts: 0,
          });
          set({ saveState: 'offline', dirty: true });
          return;
        }
        set({ saveState: 'syncing' });
        const updated = await notesRepository.updateNote(workspaceId, active.id, {
          content,
          markdownCache: docToMarkdown(content),
          title: active.title,
        });
        await offline.clearDraft(active.id);
        pendingContent = null;
        useNotesStore.setState({
          notes: useNotesStore
            .getState()
            .notes.map((note) => (note.id === updated.id ? updated : note)),
        });
        set({
          activeNote: updated,
          dirty: false,
          saveState: 'saved',
          lastSavedAt: Date.now(),
          error: null,
        });
      } catch (error) {
        set({
          saveState: 'error',
          error: error instanceof Error ? error.message : 'Save failed.',
        });
      }
    };

    if (options.force) {
      if (saveTimer) {
        globalThis.clearTimeout(saveTimer);
        saveTimer = null;
      }
      await run();
      return;
    }

    if (saveTimer) {
      globalThis.clearTimeout(saveTimer);
    }
    saveTimer = globalThis.setTimeout(() => {
      void run();
    }, 1000);
  },

  clear: () => {
    if (saveTimer) {
      globalThis.clearTimeout(saveTimer);
      saveTimer = null;
    }
    pendingContent = null;
    set({
      activeNote: null,
      saveState: 'idle',
      dirty: false,
      lastSavedAt: null,
      error: null,
    });
  },
}));
