import { beforeEach, describe, expect, it } from 'vitest';

import {
  __resetCalendarStorageForTests,
  emptyCalendarFilters,
} from '@features/calendar/services/calendar-service';
import { selectVisibleEvents, useCalendarStore } from '@features/calendar/store/calendar-store';
import { __resetTaskStorageForTests } from '@features/task/services/task-service';
import { useTaskStore } from '@features/task/store/task-store';

describe('calendar store smoke', () => {
  beforeEach(() => {
    window.localStorage.clear();
    __resetTaskStorageForTests();
    __resetCalendarStorageForTests();
    useTaskStore.setState({
      tasks: [],
      status: 'idle',
      error: null,
      workspaceId: null,
    });
    useCalendarStore.setState({
      events: [],
      milestones: [],
      status: 'idle',
      error: null,
      workspaceId: null,
    });
  });

  it('loads calendar events projected from seeded tasks', async () => {
    await useCalendarStore.getState().loadEvents('ws-test');
    const state = useCalendarStore.getState();

    expect(state.status).toBe('ready');
    expect(state.workspaceId).toBe('ws-test');
    expect(state.events.length).toBeGreaterThan(0);
    expect(state.events.every((event) => event.taskId.length > 0)).toBe(true);
  });

  it('reschedules an event through the Task Engine', async () => {
    await useCalendarStore.getState().loadEvents('ws-test');
    const target = useCalendarStore.getState().events[0];
    expect(target).toBeDefined();
    if (!target) {
      return;
    }

    const nextStart = target.startAt + 24 * 60 * 60 * 1000;
    const duration = Math.max(target.endAt - target.startAt, 15 * 60 * 1000);
    const nextEnd = nextStart + duration;

    await useCalendarStore.getState().reschedule('ws-test', target.taskId, nextStart, nextEnd);

    const updated = useCalendarStore
      .getState()
      .events.find((event) => event.taskId === target.taskId);
    expect(updated).toBeDefined();
    expect(updated?.startAt).toBeGreaterThanOrEqual(nextStart);

    const task = useTaskStore.getState().tasks.find((item) => item.id === target.taskId);
    expect(task?.startDate ?? task?.dueDate).toBeTruthy();
  });

  it('filters visible events for the current view range', async () => {
    await useCalendarStore.getState().loadEvents('ws-test');
    const events = useCalendarStore.getState().events;
    const visible = selectVisibleEvents(events, 'month', Date.now(), 1, emptyCalendarFilters());

    expect(Array.isArray(visible)).toBe(true);
    expect(visible.length).toBeLessThanOrEqual(events.length);
  });
});
