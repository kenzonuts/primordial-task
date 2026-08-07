import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { DEFAULT_KANBAN_PREFERENCES } from '@features/kanban/constants';
import { kanbanService } from '@features/kanban/store/board-store';
import type { KanbanLayoutState, KanbanPreferences } from '@features/kanban/types';

interface PreferencesStoreState {
  readonly preferences: KanbanPreferences;
  readonly status: 'idle' | 'loading' | 'ready';
  loadPreferences(): Promise<void>;
  updatePreferences(prefs: Partial<KanbanPreferences>): Promise<void>;
}

export const useKanbanPreferencesStore = create<PreferencesStoreState>()(
  persist(
    (set) => ({
      preferences: { ...DEFAULT_KANBAN_PREFERENCES },
      status: 'idle',
      loadPreferences: async () => {
        set({ status: 'loading' });
        const preferences = await kanbanService.getPreferences();
        set({ preferences, status: 'ready' });
      },
      updatePreferences: async (prefs) => {
        const preferences = await kanbanService.updatePreferences(prefs);
        set({ preferences });
      },
    }),
    {
      name: 'primordial-kanban-preferences-ui',
      partialize: (state) => ({ preferences: state.preferences }),
    },
  ),
);

interface LayoutStoreState extends KanbanLayoutState {
  setFocusedTask(taskId: string | null): void;
  setFocusedColumn(columnId: string | null): void;
  openDetail(taskId: string): void;
  closeDetail(): void;
  setBoardScrollLeft(value: number): void;
}

export const useKanbanLayoutStore = create<LayoutStoreState>((set) => ({
  focusedTaskId: null,
  focusedColumnId: null,
  detailTaskId: null,
  showDetailPanel: false,
  boardScrollLeft: 0,

  setFocusedTask: (taskId) => set({ focusedTaskId: taskId }),
  setFocusedColumn: (columnId) => set({ focusedColumnId: columnId }),
  openDetail: (taskId) =>
    set({ detailTaskId: taskId, showDetailPanel: true, focusedTaskId: taskId }),
  closeDetail: () => set({ showDetailPanel: false, detailTaskId: null }),
  setBoardScrollLeft: (boardScrollLeft) => set({ boardScrollLeft }),
}));
