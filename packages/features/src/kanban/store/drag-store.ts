import { create } from 'zustand';

import { kanbanService } from '@features/kanban/store/board-store';
import { useKanbanBoardStore } from '@features/kanban/store/board-store';
import type {
  KanbanCardPlacement,
  KanbanDragState,
  KanbanMovePayload,
} from '@features/kanban/types';
import { useTaskStore } from '@features/task/store/task-store';

const initialDrag = (): KanbanDragState => ({
  activeTaskIds: [],
  activeColumnId: null,
  overColumnId: null,
  overIndex: null,
  overSwimlaneId: null,
  mode: null,
  isDragging: false,
  announcement: null,
});

interface DragStoreState {
  readonly drag: KanbanDragState;
  readonly rollbackPlacements: KanbanCardPlacement[] | null;
  startDrag(taskIds: readonly string[], columnId: string, mode: 'pointer' | 'keyboard'): void;
  setOver(columnId: string | null, index: number | null, swimlaneId?: string | null): void;
  setAnnouncement(message: string | null): void;
  cancelDrag(): void;
  /**
   * Optimistic move with rollback foundation.
   * Updates local placements immediately, then persists via Kanban + Task Engine.
   */
  commitMove(workspaceId: string, payload: KanbanMovePayload): Promise<void>;
}

export const useKanbanDragStore = create<DragStoreState>((set, get) => ({
  drag: initialDrag(),
  rollbackPlacements: null,

  startDrag: (taskIds, columnId, mode) => {
    set({
      drag: {
        activeTaskIds: [...taskIds],
        activeColumnId: columnId,
        overColumnId: columnId,
        overIndex: null,
        overSwimlaneId: null,
        mode,
        isDragging: true,
        announcement: `Picked up ${taskIds.length} task${taskIds.length > 1 ? 's' : ''}.`,
      },
    });
  },

  setOver: (columnId, index, swimlaneId = null) => {
    set({
      drag: {
        ...get().drag,
        overColumnId: columnId,
        overIndex: index,
        overSwimlaneId: swimlaneId,
      },
    });
  },

  setAnnouncement: (announcement) => {
    set({ drag: { ...get().drag, announcement } });
  },

  cancelDrag: () => {
    set({
      drag: {
        ...initialDrag(),
        announcement: 'Move cancelled.',
      },
      rollbackPlacements: null,
    });
  },

  commitMove: async (workspaceId, payload) => {
    const boardStore = useKanbanBoardStore.getState();
    const previousPlacements = boardStore.placements.map((placement) => ({ ...placement }));

    // Optimistic local reorder
    const moving = previousPlacements.filter((placement) =>
      payload.taskIds.includes(placement.taskId),
    );
    const remaining = previousPlacements.filter(
      (placement) => !payload.taskIds.includes(placement.taskId),
    );
    const dest = remaining
      .filter((placement) => placement.columnId === payload.destinationColumnId)
      .sort((a, b) => a.orderIndex - b.orderIndex);
    const before = dest.slice(0, payload.destinationIndex);
    const after = dest.slice(payload.destinationIndex);
    const moved = moving.map((placement, offset) => ({
      ...placement,
      columnId: payload.destinationColumnId,
      swimlaneId: payload.destinationSwimlaneId,
      orderIndex: payload.destinationIndex + offset,
    }));
    const reindexedDest = [...before, ...moved, ...after].map((placement, orderIndex) => ({
      ...placement,
      orderIndex,
    }));
    const source = remaining
      .filter((placement) => placement.columnId === payload.sourceColumnId)
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map((placement, orderIndex) => ({ ...placement, orderIndex }));
    const rest = remaining.filter(
      (placement) =>
        placement.columnId !== payload.sourceColumnId &&
        placement.columnId !== payload.destinationColumnId,
    );
    boardStore.setPlacements([...rest, ...source, ...reindexedDest]);
    set({
      rollbackPlacements: previousPlacements.filter((p) => payload.taskIds.includes(p.taskId)),
    });

    try {
      const result = await kanbanService.moveCards(workspaceId, payload);
      boardStore.setPlacements(
        result.placements.length > 0
          ? result.placements
          : useKanbanBoardStore.getState().placements,
      );
      await useTaskStore.getState().loadTasks(workspaceId);
      set({
        drag: {
          ...initialDrag(),
          announcement: `Moved ${payload.taskIds.length} task${payload.taskIds.length > 1 ? 's' : ''}.`,
        },
        rollbackPlacements: null,
      });
    } catch (error) {
      const rollback = get().rollbackPlacements;
      if (rollback) {
        await kanbanService.rollbackPlacements(workspaceId, rollback);
        await boardStore.loadPlacements(
          workspaceId,
          boardStore.currentBoard?.id ?? payload.destinationColumnId,
        );
        await useTaskStore.getState().loadTasks(workspaceId);
      }
      set({
        drag: {
          ...initialDrag(),
          announcement: error instanceof Error ? `Move failed: ${error.message}` : 'Move failed.',
        },
        rollbackPlacements: null,
      });
      throw error;
    }
  },
}));
