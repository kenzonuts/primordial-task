import { create } from 'zustand';

import type { AuthUser } from '@features/auth/types';

interface UserStoreState {
  readonly user: AuthUser | null;
  setUser(user: AuthUser | null): void;
  clear(): void;
}

/** Foundation-only user store for future profile modules. */
export const useUserStore = create<UserStoreState>((set) => ({
  user: null,
  setUser: (user) => {
    set({ user });
  },
  clear: () => {
    set({ user: null });
  },
}));
