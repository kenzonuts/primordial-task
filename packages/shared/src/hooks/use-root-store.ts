import { create } from 'zustand';

interface RootStoreState {
  appReady: boolean;
  setAppReady: (value: boolean) => void;
}

export const useRootStore = create<RootStoreState>((set) => ({
  appReady: false,
  setAppReady: (value: boolean) => {
    set({ appReady: value });
  },
}));
