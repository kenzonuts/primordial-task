import { beforeEach, describe, expect, it } from 'vitest';

import { __resetTaskStorageForTests } from '@features/task/services/task-service';
import { filterAndSortTasks, useTaskFilterStore } from '@features/task/store/task-filter-store';
import { useTaskStore } from '@features/task/store/task-store';

describe('task store smoke', () => {
  beforeEach(() => {
    window.localStorage.clear();
    __resetTaskStorageForTests();
    useTaskStore.setState({
      tasks: [],
      status: 'idle',
      error: null,
      workspaceId: null,
    });
    useTaskFilterStore.setState({
      filters: {
        query: '',
        sort: 'updated',
        preset: 'all',
        view: 'table',
        groupBy: 'none',
        statuses: [],
        priorities: [],
        projectIds: [],
        assigneeIds: [],
        labels: [],
        tags: [],
        dateFrom: null,
        dateTo: null,
        page: 1,
        pageSize: 25,
      },
    });
  });

  it('loads seeded tasks for a workspace', async () => {
    await useTaskStore.getState().loadTasks('ws-test');
    const state = useTaskStore.getState();

    expect(state.status).toBe('ready');
    expect(state.workspaceId).toBe('ws-test');
    expect(state.tasks.length).toBeGreaterThan(0);
  });

  it('creates a task in the active workspace', async () => {
    await useTaskStore.getState().loadTasks('ws-test');
    const task = await useTaskStore.getState().createTask({
      workspaceId: 'ws-test',
      projectId: 'proj-core',
      title: 'New engine task',
      description: 'Created from store smoke test',
      status: 'todo',
      priority: 'medium',
      type: 'task',
    });

    expect(task.title).toBe('New engine task');
    expect(task.projectId).toBe('proj-core');
    expect(useTaskStore.getState().tasks.some((item) => item.id === task.id)).toBe(true);
  });

  it('filters and sorts tasks by query and priority', async () => {
    await useTaskStore.getState().loadTasks('ws-test');
    const filtered = filterAndSortTasks(useTaskStore.getState().tasks, {
      ...useTaskFilterStore.getState().filters,
      query: 'auth',
      sort: 'priority',
    });

    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every((task) => !task.archivedAt)).toBe(true);
  });

  it('toggles favorite on a loaded task', async () => {
    await useTaskStore.getState().loadTasks('ws-test');
    const target = useTaskStore.getState().tasks[0];
    expect(target).toBeDefined();
    if (!target) {
      return;
    }

    const before = target.isFavorite;
    await useTaskStore.getState().toggleFavorite('ws-test', target.id);
    const updated = useTaskStore.getState().tasks.find((task) => task.id === target.id);

    expect(updated?.isFavorite).toBe(!before);
  });
});
