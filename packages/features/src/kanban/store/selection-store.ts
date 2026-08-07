import { create } from 'zustand';

interface SelectionStoreState {
  readonly selectedIds: ReadonlySet<string>;
  readonly lastSelectedId: string | null;
  select(id: string): void;
  deselect(id: string): void;
  toggle(id: string, additive?: boolean): void;
  selectRange(orderedIds: readonly string[], toId: string): void;
  selectAll(ids: readonly string[]): void;
  clear(): void;
  isSelected(id: string): boolean;
}

export const useKanbanSelectionStore = create<SelectionStoreState>((set, get) => ({
  selectedIds: new Set(),
  lastSelectedId: null,

  select: (id) => {
    set({ selectedIds: new Set([id]), lastSelectedId: id });
  },

  deselect: (id) => {
    const next = new Set(get().selectedIds);
    next.delete(id);
    set({ selectedIds: next });
  },

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
    set({ selectedIds: next, lastSelectedId: id });
  },

  selectRange: (orderedIds, toId) => {
    const fromId = get().lastSelectedId ?? toId;
    const from = orderedIds.indexOf(fromId);
    const to = orderedIds.indexOf(toId);
    if (from < 0 || to < 0) {
      get().toggle(toId);
      return;
    }
    const [start, end] = from < to ? [from, to] : [to, from];
    const next = new Set(get().selectedIds);
    for (let index = start; index <= end; index += 1) {
      next.add(orderedIds[index]!);
    }
    set({ selectedIds: next, lastSelectedId: toId });
  },

  selectAll: (ids) =>
    set({ selectedIds: new Set(ids), lastSelectedId: ids[ids.length - 1] ?? null }),

  clear: () => set({ selectedIds: new Set(), lastSelectedId: null }),

  isSelected: (id) => get().selectedIds.has(id),
}));
