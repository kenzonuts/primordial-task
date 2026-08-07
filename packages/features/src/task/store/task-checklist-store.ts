import { create } from 'zustand';

import { createTaskService } from '@features/task/services/task-service';
import type { TaskChecklistItem } from '@features/task/types';

const service = createTaskService();

interface TaskChecklistStoreState {
  readonly items: TaskChecklistItem[];
  readonly status: 'idle' | 'loading' | 'ready' | 'error';
  readonly error: string | null;
  loadChecklist(workspaceId: string, taskId: string): Promise<void>;
  addItem(workspaceId: string, taskId: string, title: string): Promise<void>;
  updateItem(
    workspaceId: string,
    taskId: string,
    itemId: string,
    patch: Partial<Pick<TaskChecklistItem, 'title' | 'completed' | 'orderIndex'>>,
  ): Promise<void>;
  deleteItem(workspaceId: string, taskId: string, itemId: string): Promise<void>;
  reorder(workspaceId: string, taskId: string, orderedIds: readonly string[]): Promise<void>;
  clear(): void;
}

export const useTaskChecklistStore = create<TaskChecklistStoreState>((set, get) => ({
  items: [],
  status: 'idle',
  error: null,

  loadChecklist: async (workspaceId, taskId) => {
    set({ status: 'loading', error: null });
    try {
      const items = await service.listChecklist(workspaceId, taskId);
      set({ items, status: 'ready' });
    } catch (error) {
      set({
        status: 'error',
        error: error instanceof Error ? error.message : 'Checklist could not be loaded.',
      });
    }
  },

  addItem: async (workspaceId, taskId, title) => {
    const item = await service.addChecklistItem(workspaceId, taskId, title);
    set({ items: [...get().items, item] });
  },

  updateItem: async (workspaceId, taskId, itemId, patch) => {
    const updated = await service.updateChecklistItem(workspaceId, taskId, itemId, patch);
    set({
      items: get().items.map((item) => (item.id === itemId ? updated : item)),
    });
  },

  deleteItem: async (workspaceId, taskId, itemId) => {
    await service.deleteChecklistItem(workspaceId, taskId, itemId);
    set({
      items: get()
        .items.filter((item) => item.id !== itemId)
        .map((item, orderIndex) => ({ ...item, orderIndex })),
    });
  },

  reorder: async (workspaceId, taskId, orderedIds) => {
    const items = await service.reorderChecklist(workspaceId, taskId, orderedIds);
    set({ items });
  },

  clear: () => {
    set({ items: [], status: 'idle', error: null });
  },
}));

export const selectChecklistProgress = (
  items: readonly TaskChecklistItem[],
): { completed: number; total: number; percent: number } => {
  const total = items.length;
  const completed = items.filter((item) => item.completed).length;
  return {
    completed,
    total,
    percent: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
};
