import { create } from 'zustand';

/**
 * Store conventions (Phase 2 foundation):
 * - One Zustand store per concern (e.g. root, ui, feature).
 * - Feature stores live under `packages/features/<feature>/store`.
 * - Root store holds only cross-cutting app lifecycle state.
 * - Prefer immutable updates via `set` partials; avoid nested mutable objects.
 * - Do not put server/remote entities in Zustand — use TanStack Query.
 * - Name hooks `useXxxStore` and state fields in camelCase.
 */
export interface RootStoreState {
  readonly appReady: boolean;
  readonly bootstrapError: string | null;
  setAppReady(value: boolean): void;
  setBootstrapError(error: string | null): void;
}

export const useRootStore = create<RootStoreState>((set) => ({
  appReady: false,
  bootstrapError: null,
  setAppReady: (value: boolean): void => {
    set({ appReady: value });
  },
  setBootstrapError: (error: string | null): void => {
    set({ bootstrapError: error });
  },
}));
