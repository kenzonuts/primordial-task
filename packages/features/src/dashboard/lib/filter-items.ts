import type {
  DashboardFiltersState,
  DashboardPinnedItem,
  DashboardProjectPreview,
  DashboardTaskPreview,
} from '@features/dashboard/types';

const matchesQuery = (value: string, query: string): boolean => {
  if (!query) {
    return true;
  }
  return value.toLowerCase().includes(query);
};

export const normalizeFilterQuery = (query: string): string => query.trim().toLowerCase();

export const filterTasksByQuery = (
  tasks: readonly DashboardTaskPreview[],
  query: string,
): readonly DashboardTaskPreview[] => {
  const normalized = normalizeFilterQuery(query);
  if (!normalized) {
    return tasks;
  }
  return tasks.filter(
    (task) => matchesQuery(task.title, normalized) || matchesQuery(task.projectName, normalized),
  );
};

export const filterProjectsByQuery = (
  projects: readonly DashboardProjectPreview[],
  query: string,
): readonly DashboardProjectPreview[] => {
  const normalized = normalizeFilterQuery(query);
  if (!normalized) {
    return projects;
  }
  return projects.filter((project) => matchesQuery(project.name, normalized));
};

export const filterPinnedByQuery = (
  items: readonly DashboardPinnedItem[],
  query: string,
): readonly DashboardPinnedItem[] => {
  const normalized = normalizeFilterQuery(query);
  if (!normalized) {
    return items;
  }
  return items.filter((item) => matchesQuery(item.title, normalized));
};

export const filterProjectsByScope = (
  projects: readonly DashboardProjectPreview[],
  scope: DashboardFiltersState['scope'],
): readonly DashboardProjectPreview[] => {
  if (scope === 'favorites') {
    return projects.filter((project) => project.isFavorite);
  }
  if (scope === 'pinned') {
    return projects.filter((project) => project.isPinned);
  }
  if (scope === 'archived') {
    return [];
  }
  return projects;
};
