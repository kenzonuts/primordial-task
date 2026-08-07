import { create } from 'zustand';

import { createTaskService } from '@features/task/services/task-service';
import type { TaskComment } from '@features/task/types';

const service = createTaskService();

interface TaskCommentStoreState {
  readonly comments: TaskComment[];
  readonly status: 'idle' | 'loading' | 'ready' | 'error';
  readonly error: string | null;
  loadComments(workspaceId: string, taskId: string): Promise<void>;
  addComment(
    workspaceId: string,
    taskId: string,
    body: string,
    parentId?: string | null,
  ): Promise<void>;
  updateComment(
    workspaceId: string,
    taskId: string,
    commentId: string,
    body: string,
  ): Promise<void>;
  deleteComment(workspaceId: string, taskId: string, commentId: string): Promise<void>;
  clear(): void;
}

export const useTaskCommentStore = create<TaskCommentStoreState>((set, get) => ({
  comments: [],
  status: 'idle',
  error: null,

  loadComments: async (workspaceId, taskId) => {
    set({ status: 'loading', error: null });
    try {
      const comments = await service.listComments(workspaceId, taskId);
      set({ comments, status: 'ready' });
    } catch (error) {
      set({
        status: 'error',
        error: error instanceof Error ? error.message : 'Comments could not be loaded.',
      });
    }
  },

  addComment: async (workspaceId, taskId, body, parentId = null) => {
    const comment = await service.addComment(workspaceId, taskId, body, parentId);
    set({ comments: [...get().comments, comment] });
  },

  updateComment: async (workspaceId, taskId, commentId, body) => {
    const updated = await service.updateComment(workspaceId, taskId, commentId, body);
    set({
      comments: get().comments.map((comment) => (comment.id === commentId ? updated : comment)),
    });
  },

  deleteComment: async (workspaceId, taskId, commentId) => {
    await service.deleteComment(workspaceId, taskId, commentId);
    set({
      comments: get().comments.filter(
        (comment) => comment.id !== commentId && comment.parentId !== commentId,
      ),
    });
  },

  clear: () => {
    set({ comments: [], status: 'idle', error: null });
  },
}));
