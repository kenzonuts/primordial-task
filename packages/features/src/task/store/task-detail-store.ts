import { create } from 'zustand';

import { createTaskService } from '@features/task/services/task-service';
import { useTaskStore } from '@features/task/store/task-store';
import type { Task, TaskActivityItem, TaskAttachment, TaskHistoryItem } from '@features/task/types';

const service = createTaskService();

interface TaskDetailStoreState {
  readonly currentTask: Task | null;
  readonly subtasks: Task[];
  readonly attachments: TaskAttachment[];
  readonly activity: TaskActivityItem[];
  readonly history: TaskHistoryItem[];
  readonly expandedIds: ReadonlySet<string>;
  readonly status: 'idle' | 'loading' | 'ready' | 'error';
  readonly error: string | null;
  loadTask(workspaceId: string, id: string): Promise<Task | null>;
  setCurrentTask(task: Task | null): void;
  loadSubtasks(workspaceId: string, parentId: string): Promise<void>;
  loadAttachments(workspaceId: string, taskId: string): Promise<void>;
  loadActivity(workspaceId: string, taskId: string): Promise<void>;
  loadHistory(workspaceId: string, taskId: string): Promise<void>;
  deleteAttachment(workspaceId: string, taskId: string, attachmentId: string): Promise<void>;
  toggleExpanded(id: string): void;
  expandAll(ids: readonly string[]): void;
  collapseAll(): void;
  clear(): void;
}

export const useTaskDetailStore = create<TaskDetailStoreState>((set, get) => ({
  currentTask: null,
  subtasks: [],
  attachments: [],
  activity: [],
  history: [],
  expandedIds: new Set(),
  status: 'idle',
  error: null,

  loadTask: async (workspaceId, id) => {
    set({ status: 'loading', error: null });
    try {
      const task = await service.getTask(workspaceId, id);
      if (!task) {
        set({ currentTask: null, status: 'error', error: 'Task not found.' });
        return null;
      }
      set({ currentTask: task, status: 'ready' });
      useTaskStore.getState().upsertLocal(task);
      await Promise.all([
        get().loadSubtasks(workspaceId, id),
        get().loadAttachments(workspaceId, id),
        get().loadActivity(workspaceId, id),
        get().loadHistory(workspaceId, id),
      ]);
      return task;
    } catch (error) {
      set({
        status: 'error',
        error: error instanceof Error ? error.message : 'Task could not be loaded.',
      });
      return null;
    }
  },

  setCurrentTask: (task) => {
    set({ currentTask: task });
  },

  loadSubtasks: async (workspaceId, parentId) => {
    const subtasks = await service.listSubtasks(workspaceId, parentId);
    set({ subtasks });
  },

  loadAttachments: async (workspaceId, taskId) => {
    const attachments = await service.listAttachments(workspaceId, taskId);
    set({ attachments });
  },

  loadActivity: async (workspaceId, taskId) => {
    const activity = await service.listActivity(workspaceId, taskId);
    set({ activity });
  },

  loadHistory: async (workspaceId, taskId) => {
    const history = await service.listHistory(workspaceId, taskId);
    set({ history });
  },

  deleteAttachment: async (workspaceId, taskId, attachmentId) => {
    await service.deleteAttachmentPlaceholder(workspaceId, taskId, attachmentId);
    set({
      attachments: get().attachments.filter((item) => item.id !== attachmentId),
    });
  },

  toggleExpanded: (id) => {
    const next = new Set(get().expandedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    set({ expandedIds: next });
  },

  expandAll: (ids) => {
    set({ expandedIds: new Set(ids) });
  },

  collapseAll: () => {
    set({ expandedIds: new Set() });
  },

  clear: () => {
    set({
      currentTask: null,
      subtasks: [],
      attachments: [],
      activity: [],
      history: [],
      status: 'idle',
      error: null,
    });
  },
}));
