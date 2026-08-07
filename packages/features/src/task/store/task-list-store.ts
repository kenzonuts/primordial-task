import { create } from 'zustand';

import {
  filterAndSortTasks,
  paginateTasks,
  useTaskFilterStore,
} from '@features/task/store/task-filter-store';
import { useTaskStore } from '@features/task/store/task-store';
import type { Task, TaskGroupBy } from '@features/task/types';

export interface TaskGroup {
  readonly key: string;
  readonly label: string;
  readonly tasks: readonly Task[];
}

interface TaskListStoreState {
  readonly collapsedGroups: ReadonlySet<string>;
  toggleGroup(key: string): void;
  expandAllGroups(): void;
  collapseAllGroups(keys: readonly string[]): void;
}

export const useTaskListStore = create<TaskListStoreState>((set, get) => ({
  collapsedGroups: new Set(),

  toggleGroup: (key) => {
    const next = new Set(get().collapsedGroups);
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    set({ collapsedGroups: next });
  },

  expandAllGroups: () => {
    set({ collapsedGroups: new Set() });
  },

  collapseAllGroups: (keys) => {
    set({ collapsedGroups: new Set(keys) });
  },
}));

const groupLabel = (groupBy: TaskGroupBy, task: Task): { key: string; label: string } => {
  if (groupBy === 'status') {
    return { key: task.status, label: task.status };
  }
  if (groupBy === 'priority') {
    return { key: task.priority, label: task.priority };
  }
  if (groupBy === 'project') {
    return { key: task.projectId, label: task.projectName };
  }
  if (groupBy === 'assignee') {
    return {
      key: task.assignee?.id ?? 'unassigned',
      label: task.assignee?.fullName ?? 'Unassigned',
    };
  }
  return { key: 'all', label: 'All tasks' };
};

export const buildTaskGroups = (tasks: readonly Task[], groupBy: TaskGroupBy): TaskGroup[] => {
  if (groupBy === 'none') {
    return [{ key: 'all', label: 'All tasks', tasks }];
  }
  const map = new Map<string, TaskGroup>();
  for (const task of tasks) {
    const { key, label } = groupLabel(groupBy, task);
    const existing = map.get(key);
    if (existing) {
      map.set(key, { ...existing, tasks: [...existing.tasks, task] });
    } else {
      map.set(key, { key, label, tasks: [task] });
    }
  }
  return [...map.values()];
};

/** Derived list view model from task + filter stores. */
export const getTaskListViewModel = (): {
  filtered: Task[];
  pageItems: Task[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  groups: TaskGroup[];
} => {
  const tasks = useTaskStore.getState().tasks;
  const filters = useTaskFilterStore.getState().filters;
  const filtered = filterAndSortTasks(tasks, filters);
  const page = paginateTasks(filtered, filters.page, filters.pageSize);
  const groups = buildTaskGroups(page.items, filters.groupBy);
  return {
    filtered,
    pageItems: page.items,
    total: page.total,
    page: page.page,
    pageSize: page.pageSize,
    hasMore: page.hasMore,
    groups,
  };
};
