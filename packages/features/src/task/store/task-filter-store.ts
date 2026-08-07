import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { TASK_PRIORITY_RANK, TASK_STATUS_RANK } from '@features/task/constants';
import { useTaskStore } from '@features/task/store/task-store';
import type {
  Task,
  TaskFilterPreset,
  TaskFiltersState,
  TaskGroupBy,
  TaskSortKey,
  TaskViewMode,
} from '@features/task/types';

const defaultFilters = (): TaskFiltersState => ({
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
});

interface TaskFilterStoreState {
  readonly filters: TaskFiltersState;
  setFilters(partial: Partial<TaskFiltersState>): void;
  resetFilters(): void;
  setQuery(query: string): void;
  setView(view: TaskViewMode): void;
  setSort(sort: TaskSortKey): void;
  setPreset(preset: TaskFilterPreset): void;
  setGroupBy(groupBy: TaskGroupBy): void;
  setPage(page: number): void;
}

export const useTaskFilterStore = create<TaskFilterStoreState>()(
  persist(
    (set, get) => ({
      filters: defaultFilters(),

      setFilters: (partial) => {
        set({
          filters: {
            ...get().filters,
            ...partial,
            page:
              partial.page ??
              (partial.query !== undefined ||
              partial.preset !== undefined ||
              partial.statuses !== undefined ||
              partial.priorities !== undefined ||
              partial.projectIds !== undefined ||
              partial.assigneeIds !== undefined ||
              partial.labels !== undefined ||
              partial.tags !== undefined ||
              partial.dateFrom !== undefined ||
              partial.dateTo !== undefined
                ? 1
                : get().filters.page),
          },
        });
      },

      resetFilters: () => {
        set({ filters: defaultFilters() });
      },

      setQuery: (query) => {
        get().setFilters({ query });
      },

      setView: (view) => {
        get().setFilters({ view });
      },

      setSort: (sort) => {
        get().setFilters({ sort });
      },

      setPreset: (preset) => {
        get().setFilters({ preset });
      },

      setGroupBy: (groupBy) => {
        get().setFilters({ groupBy });
      },

      setPage: (page) => {
        get().setFilters({ page });
      },
    }),
    {
      name: 'primordial-task-filters',
      partialize: (state) => ({ filters: state.filters }),
    },
  ),
);

export const filterAndSortTasks = (
  tasks: readonly Task[],
  filters: TaskFiltersState,
  currentUserId = 'user-local',
): Task[] => {
  let items = [...tasks];

  if (filters.preset === 'favorites') {
    items = items.filter((task) => task.isFavorite && !task.archivedAt);
  } else if (filters.preset === 'pinned') {
    items = items.filter((task) => task.isPinned && !task.archivedAt);
  } else if (filters.preset === 'archived') {
    items = items.filter((task) => task.archivedAt !== null || task.status === 'archived');
  } else if (filters.preset === 'completed') {
    items = items.filter((task) => task.status === 'completed' && !task.archivedAt);
  } else if (filters.preset === 'mine') {
    items = items.filter((task) => task.assignee?.id === currentUserId && !task.archivedAt);
  } else {
    items = items.filter((task) => task.archivedAt === null && task.status !== 'archived');
  }

  if (filters.statuses.length > 0) {
    items = items.filter((task) => filters.statuses.includes(task.status));
  }
  if (filters.priorities.length > 0) {
    items = items.filter((task) => filters.priorities.includes(task.priority));
  }
  if (filters.projectIds.length > 0) {
    items = items.filter((task) => filters.projectIds.includes(task.projectId));
  }
  if (filters.assigneeIds.length > 0) {
    items = items.filter(
      (task) => task.assignee !== null && filters.assigneeIds.includes(task.assignee.id),
    );
  }
  if (filters.labels.length > 0) {
    items = items.filter((task) =>
      task.labels.some((label) => filters.labels.includes(label.name)),
    );
  }
  if (filters.tags.length > 0) {
    items = items.filter((task) => task.tags.some((tag) => filters.tags.includes(tag)));
  }
  if (filters.dateFrom != null) {
    items = items.filter((task) => task.dueDate != null && task.dueDate >= filters.dateFrom!);
  }
  if (filters.dateTo != null) {
    items = items.filter((task) => task.dueDate != null && task.dueDate <= filters.dateTo!);
  }

  const normalized = filters.query.trim().toLowerCase();
  if (normalized) {
    items = items.filter((task) => {
      return (
        task.title.toLowerCase().includes(normalized) ||
        task.description.toLowerCase().includes(normalized) ||
        task.id.toLowerCase().includes(normalized) ||
        task.tags.some((tag) => tag.toLowerCase().includes(normalized)) ||
        task.labels.some((label) => label.name.toLowerCase().includes(normalized)) ||
        task.projectName.toLowerCase().includes(normalized)
      );
    });
  }

  items.sort((left, right) => {
    if (filters.sort === 'title') {
      return left.title.localeCompare(right.title);
    }
    if (filters.sort === 'status') {
      return TASK_STATUS_RANK[left.status] - TASK_STATUS_RANK[right.status];
    }
    if (filters.sort === 'priority') {
      return TASK_PRIORITY_RANK[left.priority] - TASK_PRIORITY_RANK[right.priority];
    }
    if (filters.sort === 'due') {
      return (left.dueDate ?? Number.MAX_SAFE_INTEGER) - (right.dueDate ?? Number.MAX_SAFE_INTEGER);
    }
    if (filters.sort === 'favorites') {
      return Number(right.isFavorite) - Number(left.isFavorite) || right.updatedAt - left.updatedAt;
    }
    if (filters.sort === 'pinned') {
      return Number(right.isPinned) - Number(left.isPinned) || right.updatedAt - left.updatedAt;
    }
    return right.updatedAt - left.updatedAt;
  });

  return items;
};

export const paginateTasks = (
  tasks: readonly Task[],
  page: number,
  pageSize: number,
): { items: Task[]; total: number; page: number; pageSize: number; hasMore: boolean } => {
  const total = tasks.length;
  const safePage = Math.max(1, page);
  const start = (safePage - 1) * pageSize;
  const items = tasks.slice(start, start + pageSize);
  return {
    items,
    total,
    page: safePage,
    pageSize,
    hasMore: start + pageSize < total,
  };
};

export const selectFilteredTasks = (): Task[] => {
  const tasks = useTaskStore.getState().tasks;
  const filters = useTaskFilterStore.getState().filters;
  return filterAndSortTasks(tasks, filters);
};
