import { create } from 'zustand';

import {
  createCalendarService,
  eventsInRange,
  filterCalendarEvents,
} from '@features/calendar/services/calendar-service';
import type { CalendarEvent, CalendarMilestone } from '@features/calendar/types';
import { visibleRangeForView } from '@features/calendar/utils/date-utils';
import { useTaskStore } from '@features/task/store/task-store';

const service = createCalendarService();

interface CalendarStoreState {
  readonly events: CalendarEvent[];
  readonly milestones: CalendarMilestone[];
  readonly status: 'idle' | 'loading' | 'ready' | 'error';
  readonly error: string | null;
  readonly workspaceId: string | null;
  clearError(): void;
  loadEvents(workspaceId: string): Promise<void>;
  reschedule(workspaceId: string, taskId: string, startAt: number, endAt: number): Promise<void>;
  moveByDays(workspaceId: string, taskId: string, dayDelta: number): Promise<void>;
  resize(workspaceId: string, taskId: string, edge: 'start' | 'end', nextMs: number): Promise<void>;
  setEvents(events: CalendarEvent[]): void;
}

export const useCalendarStore = create<CalendarStoreState>((set, get) => ({
  events: [],
  milestones: [],
  status: 'idle',
  error: null,
  workspaceId: null,

  clearError: () => set({ error: null }),

  loadEvents: async (workspaceId) => {
    set({ status: 'loading', error: null, workspaceId });
    try {
      // Ensure Task Engine is loaded first
      if (useTaskStore.getState().workspaceId !== workspaceId) {
        await useTaskStore.getState().loadTasks(workspaceId);
      }
      const [events, milestones] = await Promise.all([
        service.listEvents(workspaceId),
        service.listMilestones(workspaceId),
      ]);
      set({ events, milestones, status: 'ready' });
    } catch (error) {
      set({
        status: 'error',
        error: error instanceof Error ? error.message : 'Calendar could not be loaded.',
      });
    }
  },

  reschedule: async (workspaceId, taskId, startAt, endAt) => {
    const previous = get().events;
    // Optimistic
    set({
      events: previous.map((event) =>
        event.taskId === taskId ? { ...event, startAt, endAt } : event,
      ),
    });
    try {
      await service.rescheduleTask(workspaceId, taskId, startAt, endAt);
      await useTaskStore.getState().loadTasks(workspaceId);
      const events = await service.listEvents(workspaceId);
      set({ events });
    } catch (error) {
      set({ events: previous });
      throw error;
    }
  },

  moveByDays: async (workspaceId, taskId, dayDelta) => {
    const event = get().events.find((item) => item.taskId === taskId);
    if (!event) {
      return;
    }
    const ms = dayDelta * 24 * 60 * 60 * 1000;
    await get().reschedule(workspaceId, taskId, event.startAt + ms, event.endAt + ms);
  },

  resize: async (workspaceId, taskId, edge, nextMs) => {
    const previous = get().events;
    const event = previous.find((item) => item.taskId === taskId);
    if (!event) {
      return;
    }
    const startAt = edge === 'start' ? nextMs : event.startAt;
    const endAt = edge === 'end' ? nextMs : event.endAt;
    set({
      events: previous.map((item) => (item.taskId === taskId ? { ...item, startAt, endAt } : item)),
    });
    try {
      await service.resizeTask(workspaceId, taskId, edge, nextMs);
      await useTaskStore.getState().loadTasks(workspaceId);
      set({ events: await service.listEvents(workspaceId) });
    } catch (error) {
      set({ events: previous });
      throw error;
    }
  },

  setEvents: (events) => set({ events }),
}));

export { service as calendarService };

export const selectVisibleEvents = (
  events: readonly CalendarEvent[],
  view: string,
  anchor: number,
  weekStartsOn: 0 | 1,
  filters: Parameters<typeof filterCalendarEvents>[1],
): CalendarEvent[] => {
  const range = visibleRangeForView(view, anchor, weekStartsOn);
  return filterCalendarEvents(eventsInRange(events, range.start, range.end), filters);
};
