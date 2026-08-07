import { create } from 'zustand';

import { createTaskService } from '@features/task/services/task-service';
import type { TaskDependency } from '@features/task/types';

const service = createTaskService();

interface TaskDependencyStoreState {
  readonly dependencies: TaskDependency[];
  readonly status: 'idle' | 'loading' | 'ready' | 'error';
  readonly error: string | null;
  loadDependencies(workspaceId: string, taskId: string): Promise<void>;
  clear(): void;
}

export const useTaskDependencyStore = create<TaskDependencyStoreState>((set) => ({
  dependencies: [],
  status: 'idle',
  error: null,

  loadDependencies: async (workspaceId, taskId) => {
    set({ status: 'loading', error: null });
    try {
      const dependencies = await service.listDependencies(workspaceId, taskId);
      set({ dependencies, status: 'ready' });
    } catch (error) {
      set({
        status: 'error',
        error: error instanceof Error ? error.message : 'Dependencies could not be loaded.',
      });
    }
  },

  clear: () => {
    set({ dependencies: [], status: 'idle', error: null });
  },
}));
