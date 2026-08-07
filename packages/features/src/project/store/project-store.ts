import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { createProjectService } from '@features/project/services/project-service';
import type {
  CreateProjectInput,
  Project,
  ProjectFiltersState,
  ProjectMember,
  ProjectPreferences,
  UpdateProjectInput,
} from '@features/project/types';

const service = createProjectService();

interface ProjectStoreState {
  readonly projects: Project[];
  readonly currentProject: Project | null;
  readonly selectedProjectId: string | null;
  readonly members: ProjectMember[];
  readonly filters: ProjectFiltersState;
  readonly preferences: ProjectPreferences;
  readonly status: 'idle' | 'loading' | 'ready' | 'error';
  readonly membersStatus: 'idle' | 'loading' | 'ready' | 'error';
  readonly error: string | null;
  readonly workspaceId: string | null;
  setFilters(partial: Partial<ProjectFiltersState>): void;
  setSelectedProjectId(id: string | null): void;
  setCurrentProject(project: Project | null): void;
  loadProjects(workspaceId: string): Promise<void>;
  loadProject(workspaceId: string, id: string): Promise<Project | null>;
  createProject(input: CreateProjectInput): Promise<Project>;
  updateProject(workspaceId: string, id: string, input: UpdateProjectInput): Promise<Project>;
  archiveProject(workspaceId: string, id: string): Promise<void>;
  restoreProject(workspaceId: string, id: string): Promise<void>;
  deleteProject(workspaceId: string, id: string): Promise<void>;
  duplicateProject(workspaceId: string, id: string): Promise<Project>;
  toggleFavorite(workspaceId: string, id: string): Promise<void>;
  togglePinned(workspaceId: string, id: string): Promise<void>;
  loadMembers(workspaceId: string, projectId: string): Promise<void>;
  updatePreferences(prefs: Partial<ProjectPreferences>): Promise<void>;
  clearError(): void;
}

export const useProjectStore = create<ProjectStoreState>()(
  persist(
    (set, get) => ({
      projects: [],
      currentProject: null,
      selectedProjectId: null,
      members: [],
      filters: {
        query: '',
        sort: 'updated',
        filter: 'all',
        view: 'grid',
      },
      preferences: {
        defaultView: 'grid',
        showArchivedByDefault: false,
        denseList: false,
      },
      status: 'idle',
      membersStatus: 'idle',
      error: null,
      workspaceId: null,

      clearError: () => {
        set({ error: null });
      },

      setFilters: (partial) => {
        set({ filters: { ...get().filters, ...partial } });
      },

      setSelectedProjectId: (id) => {
        set({ selectedProjectId: id });
      },

      setCurrentProject: (project) => {
        set({ currentProject: project, selectedProjectId: project?.id ?? null });
      },

      loadProjects: async (workspaceId) => {
        set({ status: 'loading', error: null, workspaceId });
        try {
          const [projects, preferences] = await Promise.all([
            service.listProjects(workspaceId),
            service.getPreferences(),
          ]);
          set({
            projects,
            preferences,
            status: 'ready',
            filters: {
              ...get().filters,
              view: preferences.defaultView,
              filter: preferences.showArchivedByDefault ? 'archived' : get().filters.filter,
            },
          });
        } catch (error) {
          set({
            status: 'error',
            error: error instanceof Error ? error.message : 'Projects could not be loaded.',
          });
        }
      },

      loadProject: async (workspaceId, id) => {
        set({ status: 'loading', error: null });
        try {
          const project = await service.getProject(workspaceId, id);
          set({
            currentProject: project,
            selectedProjectId: project?.id ?? null,
            status: project ? 'ready' : 'error',
            error: project ? null : 'Project not found.',
          });
          return project;
        } catch (error) {
          set({
            status: 'error',
            error: error instanceof Error ? error.message : 'Project could not be loaded.',
          });
          return null;
        }
      },

      createProject: async (input) => {
        const project = await service.createProject(input);
        set({ projects: [project, ...get().projects], currentProject: project });
        return project;
      },

      updateProject: async (workspaceId, id, input) => {
        const updated = await service.updateProject(workspaceId, id, input);
        set({
          projects: get().projects.map((project) => (project.id === id ? updated : project)),
          currentProject: get().currentProject?.id === id ? updated : get().currentProject,
        });
        return updated;
      },

      archiveProject: async (workspaceId, id) => {
        const archived = await service.archiveProject(workspaceId, id);
        set({
          projects: get().projects.map((project) => (project.id === id ? archived : project)),
          currentProject: get().currentProject?.id === id ? archived : get().currentProject,
        });
      },

      restoreProject: async (workspaceId, id) => {
        const restored = await service.restoreProject(workspaceId, id);
        set({
          projects: get().projects.map((project) => (project.id === id ? restored : project)),
          currentProject: get().currentProject?.id === id ? restored : get().currentProject,
        });
      },

      deleteProject: async (workspaceId, id) => {
        await service.deleteProject(workspaceId, id);
        set({
          projects: get().projects.filter((project) => project.id !== id),
          currentProject: get().currentProject?.id === id ? null : get().currentProject,
          selectedProjectId: get().selectedProjectId === id ? null : get().selectedProjectId,
        });
      },

      duplicateProject: async (workspaceId, id) => {
        const duplicate = await service.duplicateProject(workspaceId, id);
        set({ projects: [duplicate, ...get().projects] });
        return duplicate;
      },

      toggleFavorite: async (workspaceId, id) => {
        const updated = await service.toggleFavorite(workspaceId, id);
        set({
          projects: get().projects.map((project) => (project.id === id ? updated : project)),
          currentProject: get().currentProject?.id === id ? updated : get().currentProject,
        });
      },

      togglePinned: async (workspaceId, id) => {
        const updated = await service.togglePinned(workspaceId, id);
        set({
          projects: get().projects.map((project) => (project.id === id ? updated : project)),
          currentProject: get().currentProject?.id === id ? updated : get().currentProject,
        });
      },

      loadMembers: async (workspaceId, projectId) => {
        set({ membersStatus: 'loading' });
        try {
          const members = await service.listMembers(workspaceId, projectId);
          set({ members, membersStatus: 'ready' });
        } catch (error) {
          set({
            membersStatus: 'error',
            error: error instanceof Error ? error.message : 'Members could not be loaded.',
          });
        }
      },

      updatePreferences: async (prefs) => {
        const preferences = await service.updatePreferences(prefs);
        set({
          preferences,
          filters: {
            ...get().filters,
            view: preferences.defaultView,
          },
        });
      },
    }),
    {
      name: 'primordial-project-ui',
      partialize: (state) => ({
        filters: state.filters,
        preferences: state.preferences,
        selectedProjectId: state.selectedProjectId,
      }),
    },
  ),
);

export const selectFilteredProjects = (state: ProjectStoreState): Project[] => {
  const { query, sort, filter } = state.filters;
  let items = [...state.projects];

  if (filter === 'favorites') {
    items = items.filter((project) => project.isFavorite && !project.archivedAt);
  } else if (filter === 'pinned') {
    items = items.filter((project) => project.isPinned && !project.archivedAt);
  } else if (filter === 'archived') {
    items = items.filter((project) => project.archivedAt !== null);
  } else if (filter === 'active') {
    items = items.filter((project) => !project.archivedAt && project.status === 'active');
  } else {
    items = items.filter((project) => project.archivedAt === null);
  }

  const normalized = query.trim().toLowerCase();
  if (normalized) {
    items = items.filter(
      (project) =>
        project.name.toLowerCase().includes(normalized) ||
        project.slug.toLowerCase().includes(normalized) ||
        project.description.toLowerCase().includes(normalized) ||
        project.status.includes(normalized) ||
        project.owner.fullName.toLowerCase().includes(normalized),
    );
  }

  items.sort((left, right) => {
    if (sort === 'name') {
      return left.name.localeCompare(right.name);
    }
    if (sort === 'status') {
      return left.status.localeCompare(right.status);
    }
    if (sort === 'progress') {
      return right.progress - left.progress;
    }
    if (sort === 'favorites') {
      return Number(right.isFavorite) - Number(left.isFavorite) || right.updatedAt - left.updatedAt;
    }
    if (sort === 'pinned') {
      return Number(right.isPinned) - Number(left.isPinned) || right.updatedAt - left.updatedAt;
    }
    return right.updatedAt - left.updatedAt;
  });

  return items;
};

export const selectRecentProjects = (state: ProjectStoreState): Project[] => {
  return [...state.projects]
    .filter((project) => !project.archivedAt)
    .sort((left, right) => right.lastActivityAt - left.lastActivityAt)
    .slice(0, 5);
};

export const selectFavoriteProjects = (state: ProjectStoreState): Project[] => {
  return state.projects.filter((project) => project.isFavorite && !project.archivedAt);
};

export const selectPinnedProjects = (state: ProjectStoreState): Project[] => {
  return state.projects.filter((project) => project.isPinned && !project.archivedAt);
};
