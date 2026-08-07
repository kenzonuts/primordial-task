import { create } from 'zustand';

import { kanbanService } from '@features/kanban/store/board-store';
import type { KanbanFiltersState } from '@features/kanban/types';
import type { Task, TaskPriority, TaskStatus } from '@features/task/types';

const empty = (): KanbanFiltersState => kanbanService.emptyFilters();

interface FilterStoreState {
  readonly filters: KanbanFiltersState;
  setFilters(partial: Partial<KanbanFiltersState>): void;
  resetFilters(): void;
}

export const useKanbanFilterStore = create<FilterStoreState>((set, get) => ({
  filters: empty(),
  setFilters: (partial) => set({ filters: { ...get().filters, ...partial } }),
  resetFilters: () => set({ filters: empty() }),
}));

interface SearchStoreState {
  readonly query: string;
  readonly debouncedQuery: string;
  setQuery(query: string): void;
  setDebouncedQuery(query: string): void;
  clear(): void;
}

export const useKanbanSearchStore = create<SearchStoreState>((set) => ({
  query: '',
  debouncedQuery: '',
  setQuery: (query) => set({ query }),
  setDebouncedQuery: (debouncedQuery) => set({ debouncedQuery }),
  clear: () => set({ query: '', debouncedQuery: '' }),
}));

export const filterBoardTasks = (
  tasks: readonly Task[],
  filters: KanbanFiltersState,
  searchQuery: string,
): Task[] => {
  let items = [...tasks];
  const query = searchQuery.trim().toLowerCase();

  if (filters.archivedOnly) {
    items = items.filter((task) => task.archivedAt !== null || task.status === 'archived');
  } else {
    items = items.filter((task) => task.archivedAt === null && task.status !== 'archived');
  }

  if (filters.favoritesOnly) {
    items = items.filter((task) => task.isFavorite);
  }
  if (filters.pinnedOnly) {
    items = items.filter((task) => task.isPinned);
  }
  if (filters.completedOnly) {
    items = items.filter((task) => task.status === 'completed');
  }
  if (filters.blockedOnly) {
    items = items.filter((task) => task.status === 'blocked');
  }
  if (filters.statuses.length > 0) {
    items = items.filter((task) => filters.statuses.includes(task.status as TaskStatus));
  }
  if (filters.priorities.length > 0) {
    items = items.filter((task) => filters.priorities.includes(task.priority as TaskPriority));
  }
  if (filters.assigneeIds.length > 0) {
    items = items.filter(
      (task) => task.assignee !== null && filters.assigneeIds.includes(task.assignee.id),
    );
  }
  if (filters.projectIds.length > 0) {
    items = items.filter((task) => filters.projectIds.includes(task.projectId));
  }
  if (filters.labels.length > 0) {
    items = items.filter((task) =>
      task.labels.some((label) => filters.labels.includes(label.name)),
    );
  }
  if (filters.tags.length > 0) {
    items = items.filter((task) => task.tags.some((tag) => filters.tags.includes(tag)));
  }
  if (filters.dueFrom != null) {
    items = items.filter((task) => task.dueDate != null && task.dueDate >= filters.dueFrom!);
  }
  if (filters.dueTo != null) {
    items = items.filter((task) => task.dueDate != null && task.dueDate <= filters.dueTo!);
  }

  if (query) {
    items = items.filter(
      (task) =>
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.id.toLowerCase().includes(query) ||
        task.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        task.labels.some((label) => label.name.toLowerCase().includes(query)) ||
        task.assignee?.fullName.toLowerCase().includes(query),
    );
  }

  return items;
};
