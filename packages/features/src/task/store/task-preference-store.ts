import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { createTaskService } from '@features/task/services/task-service';
import { useTaskFilterStore } from '@features/task/store/task-filter-store';
import type { TaskPreferences, TaskViewMode, TaskGroupBy } from '@features/task/types';

const service = createTaskService();

interface TaskPreferenceStoreState {
  readonly preferences: TaskPreferences;
  readonly status: 'idle' | 'loading' | 'ready';
  loadPreferences(): Promise<void>;
  updatePreferences(prefs: Partial<TaskPreferences>): Promise<void>;
}

export const useTaskPreferenceStore = create<TaskPreferenceStoreState>()(
  persist(
    (set, get) => ({
      preferences: {
        defaultView: 'table',
        defaultGroupBy: 'none',
        showCompleted: true,
        showArchivedByDefault: false,
        denseList: false,
        pageSize: 25,
      },
      status: 'idle',

      loadPreferences: async () => {
        set({ status: 'loading' });
        const preferences = await service.getPreferences();
        set({ preferences, status: 'ready' });
        useTaskFilterStore.getState().setFilters({
          view: preferences.defaultView,
          groupBy: preferences.defaultGroupBy,
          pageSize: preferences.pageSize,
          preset: preferences.showArchivedByDefault
            ? 'archived'
            : useTaskFilterStore.getState().filters.preset,
        });
      },

      updatePreferences: async (prefs) => {
        const preferences = await service.updatePreferences(prefs);
        set({ preferences });
        const patch: Partial<{
          view: TaskViewMode;
          groupBy: TaskGroupBy;
          pageSize: number;
        }> = {};
        if (prefs.defaultView) {
          patch.view = preferences.defaultView;
        }
        if (prefs.defaultGroupBy) {
          patch.groupBy = preferences.defaultGroupBy;
        }
        if (prefs.pageSize) {
          patch.pageSize = preferences.pageSize;
        }
        if (Object.keys(patch).length > 0) {
          useTaskFilterStore.getState().setFilters(patch);
        }
        void get;
      },
    }),
    {
      name: 'primordial-task-preferences-ui',
      partialize: (state) => ({ preferences: state.preferences }),
    },
  ),
);
