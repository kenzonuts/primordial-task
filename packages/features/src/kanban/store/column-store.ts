import { create } from 'zustand';

import { kanbanService } from '@features/kanban/store/board-store';
import type { CreateColumnInput, KanbanColumn, UpdateColumnInput } from '@features/kanban/types';

interface ColumnStoreState {
  readonly columns: KanbanColumn[];
  readonly status: 'idle' | 'loading' | 'ready' | 'error';
  readonly error: string | null;
  loadColumns(workspaceId: string, boardId: string): Promise<void>;
  createColumn(workspaceId: string, input: CreateColumnInput): Promise<KanbanColumn>;
  updateColumn(workspaceId: string, columnId: string, input: UpdateColumnInput): Promise<void>;
  archiveColumn(workspaceId: string, columnId: string): Promise<void>;
  deleteColumn(workspaceId: string, columnId: string, destinationColumnId?: string): Promise<void>;
  reorderColumns(
    workspaceId: string,
    boardId: string,
    orderedIds: readonly string[],
  ): Promise<void>;
  toggleCollapsed(workspaceId: string, columnId: string): Promise<void>;
  setColumns(columns: KanbanColumn[]): void;
}

export const useKanbanColumnStore = create<ColumnStoreState>((set, get) => ({
  columns: [],
  status: 'idle',
  error: null,

  loadColumns: async (workspaceId, boardId) => {
    set({ status: 'loading', error: null });
    try {
      const columns = await kanbanService.listColumns(workspaceId, boardId);
      set({ columns, status: 'ready' });
    } catch (error) {
      set({
        status: 'error',
        error: error instanceof Error ? error.message : 'Columns could not be loaded.',
      });
    }
  },

  createColumn: async (workspaceId, input) => {
    const column = await kanbanService.createColumn(workspaceId, input);
    set({ columns: [...get().columns, column] });
    return column;
  },

  updateColumn: async (workspaceId, columnId, input) => {
    const updated = await kanbanService.updateColumn(workspaceId, columnId, input);
    set({
      columns: get().columns.map((column) => (column.id === columnId ? updated : column)),
    });
  },

  archiveColumn: async (workspaceId, columnId) => {
    await kanbanService.archiveColumn(workspaceId, columnId);
    set({ columns: get().columns.filter((column) => column.id !== columnId) });
  },

  deleteColumn: async (workspaceId, columnId, destinationColumnId) => {
    await kanbanService.deleteColumn(workspaceId, columnId, destinationColumnId);
    set({ columns: get().columns.filter((column) => column.id !== columnId) });
  },

  reorderColumns: async (workspaceId, boardId, orderedIds) => {
    const columns = await kanbanService.reorderColumns(workspaceId, boardId, orderedIds);
    set({ columns });
  },

  toggleCollapsed: async (workspaceId, columnId) => {
    const column = get().columns.find((item) => item.id === columnId);
    if (!column) {
      return;
    }
    await get().updateColumn(workspaceId, columnId, { collapsed: !column.collapsed });
  },

  setColumns: (columns) => set({ columns }),
}));
