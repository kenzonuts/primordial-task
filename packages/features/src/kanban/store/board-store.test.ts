import { beforeEach, describe, expect, it } from 'vitest';

import { __resetKanbanStorageForTests } from '@features/kanban/services/kanban-service';
import { useKanbanBoardStore } from '@features/kanban/store/board-store';

describe('kanban board store smoke', () => {
  beforeEach(async () => {
    window.localStorage.clear();
    await __resetKanbanStorageForTests();
    useKanbanBoardStore.setState({
      boards: [],
      currentBoard: null,
      placements: [],
      statistics: null,
      status: 'idle',
      error: null,
      workspaceId: null,
    });
  });

  it('loads seeded boards for a workspace', async () => {
    await useKanbanBoardStore.getState().loadBoards('ws-test');
    const state = useKanbanBoardStore.getState();

    expect(state.status).toBe('ready');
    expect(state.workspaceId).toBe('ws-test');
    expect(state.boards.length).toBeGreaterThan(0);
  });

  it('creates a board in the active workspace', async () => {
    await useKanbanBoardStore.getState().loadBoards('ws-test');
    const board = await useKanbanBoardStore.getState().createBoard({
      workspaceId: 'ws-test',
      projectId: 'proj-core',
      name: 'New Delivery Board',
      description: 'Fresh board',
      templateId: 'blank',
    });

    expect(board.name).toBe('New Delivery Board');
    expect(useKanbanBoardStore.getState().boards.some((item) => item.id === board.id)).toBe(true);
  });

  it('loads a board and its placements', async () => {
    await useKanbanBoardStore.getState().loadBoards('ws-test');
    const first = useKanbanBoardStore.getState().boards[0];
    expect(first).toBeTruthy();

    const loaded = await useKanbanBoardStore.getState().loadBoard('ws-test', first!.id);
    expect(loaded?.id).toBe(first!.id);
    expect(useKanbanBoardStore.getState().currentBoard?.id).toBe(first!.id);
    expect(Array.isArray(useKanbanBoardStore.getState().placements)).toBe(true);
  });
});
