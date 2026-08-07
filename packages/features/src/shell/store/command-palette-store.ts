import { create } from 'zustand';

interface CommandPaletteStoreState {
  readonly open: boolean;
  readonly query: string;
  setOpen(open: boolean): void;
  toggle(): void;
  setQuery(query: string): void;
}

export const useCommandPaletteStore = create<CommandPaletteStoreState>((set) => ({
  open: false,
  query: '',
  setOpen: (open) => {
    set({ open, query: open ? '' : '' });
  },
  toggle: () => {
    set((state) => ({ open: !state.open, query: '' }));
  },
  setQuery: (query) => {
    set({ query });
  },
}));
