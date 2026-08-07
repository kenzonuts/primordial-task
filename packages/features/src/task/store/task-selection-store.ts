import { create } from 'zustand';

interface TaskSelectionStoreState {
  readonly selectedIds: ReadonlySet<string>;
  readonly lastSelectedId: string | null;
  select(id: string): void;
  deselect(id: string): void;
  toggle(id: string): void;
  selectMany(ids: readonly string[]): void;
  selectRange(ids: readonly string[], fromId: string, toId: string): void;
  clear(): void;
  isSelected(id: string): boolean;
}

export const useTaskSelectionStore = create<TaskSelectionStoreState>((set, get) => ({
  selectedIds: new Set(),
  lastSelectedId: null,

  select: (id) => {
    const next = new Set(get().selectedIds);
    next.add(id);
    set({ selectedIds: next, lastSelectedId: id });
  },

  deselect: (id) => {
    const next = new Set(get().selectedIds);
    next.delete(id);
    set({ selectedIds: next });
  },

  toggle: (id) => {
    const next = new Set(get().selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    set({ selectedIds: next, lastSelectedId: id });
  },

  selectMany: (ids) => {
    set({ selectedIds: new Set(ids), lastSelectedId: ids[ids.length - 1] ?? null });
  },

  selectRange: (ids, fromId, toId) => {
    const from = ids.indexOf(fromId);
    const to = ids.indexOf(toId);
    if (from < 0 || to < 0) {
      get().toggle(toId);
      return;
    }
    const [start, end] = from < to ? [from, to] : [to, from];
    const next = new Set(get().selectedIds);
    for (let index = start; index <= end; index += 1) {
      next.add(ids[index]!);
    }
    set({ selectedIds: next, lastSelectedId: toId });
  },

  clear: () => {
    set({ selectedIds: new Set(), lastSelectedId: null });
  },

  isSelected: (id) => get().selectedIds.has(id),
}));
