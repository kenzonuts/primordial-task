import { create } from 'zustand';

interface DragStoreState {
  readonly activeEventIds: readonly string[];
  readonly mode: 'move' | 'resize-start' | 'resize-end' | null;
  readonly previewStart: number | null;
  readonly previewEnd: number | null;
  readonly announcement: string | null;
  readonly isDragging: boolean;
  readonly rollback: { taskId: string; startAt: number; endAt: number }[] | null;
  startMove(eventIds: readonly string[]): void;
  startResize(eventId: string, edge: 'start' | 'end'): void;
  setPreview(start: number | null, end: number | null): void;
  setAnnouncement(message: string | null): void;
  cancel(): void;
  commitMove(
    workspaceId: string,
    updates: readonly { taskId: string; startAt: number; endAt: number }[],
  ): Promise<void>;
}

export const useCalendarDragStore = create<DragStoreState>((set) => ({
  activeEventIds: [],
  mode: null,
  previewStart: null,
  previewEnd: null,
  announcement: null,
  isDragging: false,
  rollback: null,

  startMove: (eventIds) =>
    set({
      activeEventIds: [...eventIds],
      mode: 'move',
      isDragging: true,
      announcement: `Picked up ${eventIds.length} event${eventIds.length > 1 ? 's' : ''}.`,
    }),

  startResize: (eventId, edge) =>
    set({
      activeEventIds: [eventId],
      mode: edge === 'start' ? 'resize-start' : 'resize-end',
      isDragging: true,
      announcement: 'Resizing event.',
    }),

  setPreview: (previewStart, previewEnd) => set({ previewStart, previewEnd }),

  setAnnouncement: (announcement) => set({ announcement }),

  cancel: () =>
    set({
      activeEventIds: [],
      mode: null,
      previewStart: null,
      previewEnd: null,
      isDragging: false,
      announcement: 'Cancelled.',
      rollback: null,
    }),

  commitMove: async (workspaceId, updates) => {
    const { useCalendarStore } = await import('@features/calendar/store/calendar-store');
    const calendar = useCalendarStore.getState();
    const rollback = updates.map((update) => {
      const event = calendar.events.find((item) => item.taskId === update.taskId);
      return {
        taskId: update.taskId,
        startAt: event?.startAt ?? update.startAt,
        endAt: event?.endAt ?? update.endAt,
      };
    });
    set({ rollback });
    try {
      for (const update of updates) {
        await calendar.reschedule(workspaceId, update.taskId, update.startAt, update.endAt);
      }
      set({
        activeEventIds: [],
        mode: null,
        isDragging: false,
        previewStart: null,
        previewEnd: null,
        announcement: `Moved ${updates.length} event${updates.length > 1 ? 's' : ''}.`,
        rollback: null,
      });
    } catch (error) {
      for (const prior of rollback) {
        await calendar.reschedule(workspaceId, prior.taskId, prior.startAt, prior.endAt);
      }
      set({
        activeEventIds: [],
        mode: null,
        isDragging: false,
        announcement: error instanceof Error ? `Move failed: ${error.message}` : 'Move failed.',
        rollback: null,
      });
      throw error;
    }
  },
}));
