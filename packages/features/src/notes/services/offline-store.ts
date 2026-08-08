import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

import type { OfflineQueueItem } from '@features/notes/types';

interface NotesOfflineDb extends DBSchema {
  queue: {
    key: string;
    value: OfflineQueueItem;
    indexes: { 'by-note': string };
  };
  drafts: {
    key: string;
    value: {
      noteId: string;
      content: unknown;
      updatedAt: number;
    };
  };
}

const DB_NAME = 'primordial-notes-offline';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<NotesOfflineDb>> | null = null;

const getDb = async (): Promise<IDBPDatabase<NotesOfflineDb>> => {
  if (!dbPromise) {
    dbPromise = openDB<NotesOfflineDb>(DB_NAME, DB_VERSION, {
      upgrade(database) {
        const queue = database.createObjectStore('queue', { keyPath: 'id' });
        queue.createIndex('by-note', 'noteId');
        database.createObjectStore('drafts', { keyPath: 'noteId' });
      },
    });
  }
  return dbPromise;
};

/**
 * Local-first offline persistence (IndexedDB).
 * Sync engine is not implemented — queue is prepared for reconnect.
 */
export class NotesOfflineStore {
  async enqueue(item: OfflineQueueItem): Promise<void> {
    const database = await getDb();
    await database.put('queue', item);
  }

  async listQueue(): Promise<OfflineQueueItem[]> {
    const database = await getDb();
    return database.getAll('queue');
  }

  async removeQueueItem(id: string): Promise<void> {
    const database = await getDb();
    await database.delete('queue', id);
  }

  async saveDraft(noteId: string, content: unknown): Promise<void> {
    const database = await getDb();
    await database.put('drafts', { noteId, content, updatedAt: Date.now() });
  }

  async getDraft(noteId: string): Promise<unknown | null> {
    const database = await getDb();
    const draft = await database.get('drafts', noteId);
    return draft?.content ?? null;
  }

  async clearDraft(noteId: string): Promise<void> {
    const database = await getDb();
    await database.delete('drafts', noteId);
  }
}

export const createNotesOfflineStore = (): NotesOfflineStore => new NotesOfflineStore();
