import { create } from 'zustand';

interface SelectionStoreState {
  readonly selectedIds: ReadonlySet<string>;
  readonly focusedEventId: string | null;
  readonly focusedDate: number | null;
  select(id: string): void;
  toggle(id: string, additive?: boolean): void;
  selectMany(ids: readonly string[]): void;
  clear(): void;
  setFocusedEvent(id: string | null): void;
  setFocusedDate(ms: number | null): void;
}

export const useCalendarSelectionStore = create<SelectionStoreState>((set, get) => ({
  selectedIds: new Set(),
  focusedEventId: null,
  focusedDate: null,
  select: (id) => set({ selectedIds: new Set([id]), focusedEventId: id }),
  toggle: (id, additive = true) => {
    if (!additive) {
      get().select(id);
      return;
    }
    const next = new Set(get().selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    set({ selectedIds: next, focusedEventId: id });
  },
  selectMany: (ids) =>
    set({ selectedIds: new Set(ids), focusedEventId: ids[ids.length - 1] ?? null }),
  clear: () => set({ selectedIds: new Set(), focusedEventId: null }),
  setFocusedEvent: (focusedEventId) => set({ focusedEventId }),
  setFocusedDate: (focusedDate) => set({ focusedDate }),
}));
