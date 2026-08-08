import { beforeEach, describe, expect, it } from 'vitest';

import { __resetNotesStorageForTests } from '@features/notes/services/notes-repository';
import { useFoldersStore } from '@features/notes/store/folders-store';
import { filterNotes, useNotesStore } from '@features/notes/store/notes-store';

describe('notes store smoke', () => {
  beforeEach(() => {
    window.localStorage.clear();
    __resetNotesStorageForTests();
    useNotesStore.setState({
      notes: [],
      status: 'idle',
      error: null,
      workspaceId: null,
    });
    useFoldersStore.setState({
      folders: [],
      expandedIds: new Set(),
      status: 'idle',
      error: null,
    });
  });

  it('loads seeded notes for a workspace', async () => {
    await useNotesStore.getState().loadNotes('ws-test');
    const state = useNotesStore.getState();

    expect(state.status).toBe('ready');
    expect(state.workspaceId).toBe('ws-test');
    expect(state.notes.length).toBeGreaterThan(0);
  });

  it('creates a note and prepends it to the store', async () => {
    await useNotesStore.getState().loadNotes('ws-test');
    const before = useNotesStore.getState().notes.length;

    const note = await useNotesStore.getState().createNote({
      workspaceId: 'ws-test',
      title: 'Phase 12 smoke note',
    });

    expect(note.title).toBe('Phase 12 smoke note');
    expect(useNotesStore.getState().notes[0]?.id).toBe(note.id);
    expect(useNotesStore.getState().notes.length).toBe(before + 1);
  });

  it('filters favorites and trash presets', async () => {
    await useNotesStore.getState().loadNotes('ws-test');
    let all = useNotesStore.getState().notes;
    let favorite = all.find((note) => note.isFavorite && note.deletedAt == null);
    if (!favorite && all[0]) {
      await useNotesStore.getState().toggleFavorite('ws-test', all[0].id);
      all = useNotesStore.getState().notes;
      favorite = all.find((note) => note.isFavorite && note.deletedAt == null);
    }
    expect(favorite).toBeDefined();

    const favorites = filterNotes(all, {
      query: '',
      sort: 'updated',
      preset: 'favorites',
      view: 'list',
      folderId: null,
      tags: [],
      noteTypes: [],
      projectId: null,
    });
    expect(favorites.every((note) => note.isFavorite)).toBe(true);
    expect(favorites.length).toBeGreaterThan(0);

    if (all[0] && all[0].deletedAt == null) {
      await useNotesStore.getState().softDeleteNote('ws-test', all[0].id);
      all = useNotesStore.getState().notes;
    }

    const trash = filterNotes(all, {
      query: '',
      sort: 'updated',
      preset: 'trash',
      view: 'list',
      folderId: null,
      tags: [],
      noteTypes: [],
      projectId: null,
    });
    expect(trash.every((note) => note.deletedAt != null)).toBe(true);
    expect(trash.length).toBeGreaterThan(0);
  });

  it('loads folders for a workspace', async () => {
    await useFoldersStore.getState().loadFolders('ws-test');
    const state = useFoldersStore.getState();
    expect(state.status).toBe('ready');
    expect(state.folders.length).toBeGreaterThan(0);
  });
});
