import { create } from 'zustand';

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
