import type { PersistenceAdapter } from '@features/kanban/types';

/**
 * Local placeholder persistence. Swap for SQLite / Supabase adapters later
 * without changing Kanban service call sites.
 */
export class LocalPersistenceAdapter implements PersistenceAdapter {
  readonly kind = 'local' as const;

  async getItem(key: string): Promise<string | null> {
    try {
      return globalThis.localStorage?.getItem(key) ?? null;
    } catch {
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      globalThis.localStorage?.setItem(key, value);
    } catch {
      // quota / private mode — swallow in placeholder layer
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      globalThis.localStorage?.removeItem(key);
    } catch {
      // ignore
    }
  }
}

export const createLocalPersistence = (): PersistenceAdapter => new LocalPersistenceAdapter();

/** Future adapter stubs — not implemented in Phase 10. */
export const createSqlitePersistenceStub = (): PersistenceAdapter => {
  throw new Error('SQLite persistence is not implemented yet.');
};

export const createSupabasePersistenceStub = (): PersistenceAdapter => {
  throw new Error('Supabase persistence is not implemented yet.');
};
