import { create } from 'zustand';

import { createKanbanService } from '@features/kanban/services/kanban-service';
import type {
  CreateBoardInput,
  KanbanBoard,
  KanbanBoardStatistics,
  KanbanCardPlacement,
  UpdateBoardInput,
} from '@features/kanban/types';
import type { Task } from '@features/task/types';

const service = createKanbanService();

interface BoardStoreState {
  readonly boards: KanbanBoard[];
  readonly currentBoard: KanbanBoard | null;
  readonly placements: KanbanCardPlacement[];
  readonly statistics: KanbanBoardStatistics | null;
  readonly status: 'idle' | 'loading' | 'ready' | 'error';
  readonly error: string | null;
  readonly workspaceId: string | null;
  clearError(): void;
  loadBoards(workspaceId: string): Promise<void>;
  loadBoard(workspaceId: string, boardId: string): Promise<KanbanBoard | null>;
  loadPlacements(workspaceId: string, boardId: string): Promise<void>;
  refreshStatistics(workspaceId: string, boardId: string, tasks: readonly Task[]): Promise<void>;
  createBoard(input: CreateBoardInput): Promise<KanbanBoard>;
  updateBoard(workspaceId: string, boardId: string, input: UpdateBoardInput): Promise<void>;
  archiveBoard(workspaceId: string, boardId: string): Promise<void>;
  restoreBoard(workspaceId: string, boardId: string): Promise<void>;
  deleteBoard(workspaceId: string, boardId: string): Promise<void>;
  toggleFavorite(workspaceId: string, boardId: string): Promise<void>;
  setPlacements(placements: KanbanCardPlacement[]): void;
}

export const useKanbanBoardStore = create<BoardStoreState>((set, get) => ({
  boards: [],
  currentBoard: null,
  placements: [],
  statistics: null,
  status: 'idle',
  error: null,
  workspaceId: null,

  clearError: () => set({ error: null }),

  loadBoards: async (workspaceId) => {
    set({ status: 'loading', error: null, workspaceId });
    try {
      const boards = await service.listBoards(workspaceId);
      set({ boards, status: 'ready' });
    } catch (error) {
      set({
        status: 'error',
        error: error instanceof Error ? error.message : 'Boards could not be loaded.',
      });
    }
  },

  loadBoard: async (workspaceId, boardId) => {
    set({ status: 'loading', error: null, workspaceId });
    try {
      const board = await service.getBoard(workspaceId, boardId);
      if (!board) {
        set({ currentBoard: null, status: 'error', error: 'Board not found.' });
        return null;
      }
      set({ currentBoard: board, status: 'ready' });
      await get().loadPlacements(workspaceId, boardId);
      return board;
    } catch (error) {
      set({
        status: 'error',
        error: error instanceof Error ? error.message : 'Board could not be loaded.',
      });
      return null;
    }
  },

  loadPlacements: async (workspaceId, boardId) => {
    const placements = await service.listPlacements(workspaceId, boardId);
    set({ placements });
  },

  refreshStatistics: async (workspaceId, boardId, tasks) => {
    const statistics = await service.getStatistics(workspaceId, boardId, tasks);
    set({ statistics });
  },

  createBoard: async (input) => {
    const board = await service.createBoard(input);
    set({ boards: [board, ...get().boards], currentBoard: board });
    return board;
  },

  updateBoard: async (workspaceId, boardId, input) => {
    const updated = await service.updateBoard(workspaceId, boardId, input);
    set({
      boards: get().boards.map((board) => (board.id === boardId ? updated : board)),
      currentBoard: get().currentBoard?.id === boardId ? updated : get().currentBoard,
    });
  },

  archiveBoard: async (workspaceId, boardId) => {
    const updated = await service.archiveBoard(workspaceId, boardId);
    set({
      boards: get().boards.map((board) => (board.id === boardId ? updated : board)),
      currentBoard: get().currentBoard?.id === boardId ? updated : get().currentBoard,
    });
  },

  restoreBoard: async (workspaceId, boardId) => {
    const updated = await service.restoreBoard(workspaceId, boardId);
    set({
      boards: get().boards.map((board) => (board.id === boardId ? updated : board)),
      currentBoard: get().currentBoard?.id === boardId ? updated : get().currentBoard,
    });
  },

  deleteBoard: async (workspaceId, boardId) => {
    await service.deleteBoard(workspaceId, boardId);
    set({
      boards: get().boards.filter((board) => board.id !== boardId),
      currentBoard: get().currentBoard?.id === boardId ? null : get().currentBoard,
    });
  },

  toggleFavorite: async (workspaceId, boardId) => {
    const updated = await service.toggleFavorite(workspaceId, boardId);
    set({
      boards: get().boards.map((board) => (board.id === boardId ? updated : board)),
      currentBoard: get().currentBoard?.id === boardId ? updated : get().currentBoard,
    });
  },

  setPlacements: (placements) => set({ placements }),
}));

export { service as kanbanService };
