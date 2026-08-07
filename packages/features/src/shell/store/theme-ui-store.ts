import { create } from 'zustand';

type ShellThemeMode = 'dark' | 'light';

interface ThemeUiStoreState {
  readonly mode: ShellThemeMode;
  setMode(mode: ShellThemeMode): void;
}

/** Shell theme indicator state. Light remains reserved. */
export const useThemeUiStore = create<ThemeUiStoreState>((set) => ({
  mode: 'dark',
  setMode: (mode) => {
    set({ mode: mode === 'light' ? 'dark' : mode });
  },
}));
