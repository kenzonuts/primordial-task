import { create } from 'zustand';

import type { AuthSession } from '@features/auth/types';

interface SessionStoreState {
  readonly session: AuthSession | null;
  readonly isExpired: boolean;
  setSession(session: AuthSession | null): void;
  markExpired(): void;
  clear(): void;
}

export const useSessionStore = create<SessionStoreState>((set) => ({
  session: null,
  isExpired: false,
  setSession: (session) => {
    set({ session, isExpired: false });
  },
  markExpired: () => {
    set({ isExpired: true, session: null });
  },
  clear: () => {
    set({ session: null, isExpired: false });
  },
}));
