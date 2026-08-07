import { create } from 'zustand';

import { createTaskService } from '@features/task/services/task-service';
import type {
  BulkTaskUpdateInput,
  CreateTaskInput,
  MoveTaskInput,
  Task,
  UpdateTaskInput,
} from '@features/task/types';

const service = createTaskService();

interface TaskStoreState {
  readonly tasks: Task[];
  readonly status: 'idle' | 'loading' | 'ready' | 'error';
  readonly error: string | null;
  readonly workspaceId: string | null;
  clearError(): void;
  loadTasks(workspaceId: string): Promise<void>;
  createTask(input: CreateTaskInput): Promise<Task>;
  updateTask(workspaceId: string, id: string, input: UpdateTaskInput): Promise<Task>;
  archiveTask(workspaceId: string, id: string): Promise<void>;
  restoreTask(workspaceId: string, id: string): Promise<void>;
  deleteTask(workspaceId: string, id: string): Promise<void>;
  duplicateTask(workspaceId: string, id: string): Promise<Task>;
  copyTask(workspaceId: string, id: string, projectId?: string): Promise<Task>;
  moveTask(workspaceId: string, id: string, input: MoveTaskInput): Promise<Task>;
  toggleFavorite(workspaceId: string, id: string): Promise<void>;
  togglePinned(workspaceId: string, id: string): Promise<void>;
  bulkUpdate(
    workspaceId: string,
    ids: readonly string[],
    input: BulkTaskUpdateInput,
  ): Promise<void>;
  upsertLocal(task: Task): void;
  removeLocal(id: string): void;
}

export const useTaskStore = create<TaskStoreState>((set, get) => ({
  tasks: [],
  status: 'idle',
  error: null,
  workspaceId: null,

  clearError: () => {
    set({ error: null });
  },

  loadTasks: async (workspaceId) => {
    set({ status: 'loading', error: null, workspaceId });
    try {
      const tasks = await service.listTasks(workspaceId);
      set({ tasks, status: 'ready' });
    } catch (error) {
      set({
        status: 'error',
        error: error instanceof Error ? error.message : 'Tasks could not be loaded.',
      });
    }
  },

  createTask: async (input) => {
    const task = await service.createTask(input);
    set({ tasks: [task, ...get().tasks] });
    return task;
  },

  updateTask: async (workspaceId, id, input) => {
    const updated = await service.updateTask(workspaceId, id, input);
    set({
      tasks: get().tasks.map((task) => (task.id === id ? updated : task)),
    });
    return updated;
  },

  archiveTask: async (workspaceId, id) => {
    const archived = await service.archiveTask(workspaceId, id);
    set({
      tasks: get().tasks.map((task) => (task.id === id ? archived : task)),
    });
  },

  restoreTask: async (workspaceId, id) => {
    const restored = await service.restoreTask(workspaceId, id);
    set({
      tasks: get().tasks.map((task) => (task.id === id ? restored : task)),
    });
  },

  deleteTask: async (workspaceId, id) => {
    await service.deleteTask(workspaceId, id);
    set({
      tasks: get().tasks.filter((task) => task.id !== id && task.parentTaskId !== id),
    });
  },

  duplicateTask: async (workspaceId, id) => {
    const duplicate = await service.duplicateTask(workspaceId, id);
    set({ tasks: [duplicate, ...get().tasks] });
    return duplicate;
  },

  copyTask: async (workspaceId, id, projectId) => {
    const copy = await service.copyTask(workspaceId, id, projectId);
    set({ tasks: [copy, ...get().tasks] });
    return copy;
  },

  moveTask: async (workspaceId, id, input) => {
    const moved = await service.moveTask(workspaceId, id, input);
    set({
      tasks: get().tasks.map((task) => (task.id === id ? moved : task)),
    });
    return moved;
  },

  toggleFavorite: async (workspaceId, id) => {
    const updated = await service.toggleFavorite(workspaceId, id);
    set({
      tasks: get().tasks.map((task) => (task.id === id ? updated : task)),
    });
  },

  togglePinned: async (workspaceId, id) => {
    const updated = await service.togglePinned(workspaceId, id);
    set({
      tasks: get().tasks.map((task) => (task.id === id ? updated : task)),
    });
  },

  bulkUpdate: async (workspaceId, ids, input) => {
    await service.bulkUpdate(workspaceId, ids, input);
    await get().loadTasks(workspaceId);
  },

  upsertLocal: (task) => {
    const exists = get().tasks.some((item) => item.id === task.id);
    set({
      tasks: exists
        ? get().tasks.map((item) => (item.id === task.id ? task : item))
        : [task, ...get().tasks],
    });
  },

  removeLocal: (id) => {
    set({ tasks: get().tasks.filter((task) => task.id !== id) });
  },
}));

export { service as taskService };
