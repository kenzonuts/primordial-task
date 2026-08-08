import type { CollaborationAdapter, PresenceUser } from '@features/notes/types';

/**
 * Local collaboration adapter — no fake realtime timers.
 * Ready to swap for Yjs/Automerge adapters when backend exists.
 */
export class LocalCollaborationAdapter implements CollaborationAdapter {
  readonly kind = 'local' as const;
  private readonly presence = new Map<string, PresenceUser[]>();

  async connect(noteId: string): Promise<void> {
    if (!this.presence.has(noteId)) {
      this.presence.set(noteId, [
        {
          userId: 'user-local',
          fullName: 'Alex Rivera',
          color: '#E6E6E6',
          lastActiveAt: Date.now(),
        },
      ]);
    }
  }

  async disconnect(noteId: string): Promise<void> {
    this.presence.delete(noteId);
  }

  async getPresence(noteId: string): Promise<readonly PresenceUser[]> {
    return this.presence.get(noteId) ?? [];
  }

  async applyUpdate(_noteId: string, _update: Uint8Array | string): Promise<void> {
    void _noteId;
    void _update;
    // Local adapter applies updates through the notes repository, not CRDT wire protocol.
  }
}

/** Stub interfaces for future CRDT backends — throw until implemented. */
export const createYjsCollaborationStub = (): CollaborationAdapter => ({
  kind: 'yjs',
  connect: async () => {
    throw new Error('Yjs collaboration is not implemented yet.');
  },
  disconnect: async () => {
    throw new Error('Yjs collaboration is not implemented yet.');
  },
  getPresence: async () => {
    throw new Error('Yjs collaboration is not implemented yet.');
  },
  applyUpdate: async () => {
    throw new Error('Yjs collaboration is not implemented yet.');
  },
});

export const createAutomergeCollaborationStub = (): CollaborationAdapter => ({
  kind: 'automerge',
  connect: async () => {
    throw new Error('Automerge collaboration is not implemented yet.');
  },
  disconnect: async () => {
    throw new Error('Automerge collaboration is not implemented yet.');
  },
  getPresence: async () => {
    throw new Error('Automerge collaboration is not implemented yet.');
  },
  applyUpdate: async () => {
    throw new Error('Automerge collaboration is not implemented yet.');
  },
});

export const createLocalCollaborationAdapter = (): CollaborationAdapter =>
  new LocalCollaborationAdapter();
