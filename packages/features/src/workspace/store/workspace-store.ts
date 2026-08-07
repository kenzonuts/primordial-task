import { create } from 'zustand';

import { createWorkspaceService } from '@features/workspace/services/workspace-service';
import type {
  CreateWorkspaceInput,
  InviteMemberInput,
  UpdateWorkspaceInput,
  Workspace,
  WorkspaceFiltersState,
  WorkspaceMember,
  WorkspacePreferences,
  WorkspaceRole,
} from '@features/workspace/types';

const service = createWorkspaceService();

interface WorkspaceStoreState {
  readonly workspaces: Workspace[];
  readonly currentWorkspace: Workspace | null;
  readonly previousWorkspaceId: string | null;
  readonly lastUsedWorkspaceId: string | null;
  readonly members: WorkspaceMember[];
  readonly preferences: WorkspacePreferences;
  readonly filters: WorkspaceFiltersState;
  readonly status: 'idle' | 'loading' | 'ready' | 'error';
  readonly membersStatus: 'idle' | 'loading' | 'ready' | 'error';
  readonly error: string | null;
  readonly initialized: boolean;
  setFilters(partial: Partial<WorkspaceFiltersState>): void;
  initialize(): Promise<void>;
  refresh(): Promise<void>;
  createWorkspace(input: CreateWorkspaceInput): Promise<Workspace>;
  updateWorkspace(id: string, input: UpdateWorkspaceInput): Promise<Workspace>;
  archiveWorkspace(id: string): Promise<void>;
  restoreWorkspace(id: string): Promise<void>;
  deleteWorkspace(id: string): Promise<void>;
  toggleFavorite(id: string): Promise<void>;
  switchWorkspace(id: string): Promise<Workspace>;
  loadMembers(workspaceId: string): Promise<void>;
  inviteMember(workspaceId: string, input: InviteMemberInput): Promise<void>;
  removeMember(workspaceId: string, memberId: string): Promise<void>;
  updateMemberRole(
    workspaceId: string,
    memberId: string,
    role: Exclude<WorkspaceRole, 'owner'>,
  ): Promise<void>;
  updatePreferences(prefs: Partial<WorkspacePreferences>): Promise<void>;
  clearError(): void;
}

const defaultPreferences: WorkspacePreferences = {
  defaultView: 'dashboard',
  density: 'comfortable',
  showArchivedInSwitcher: false,
};

export const useWorkspaceStore = create<WorkspaceStoreState>((set, get) => ({
  workspaces: [],
  currentWorkspace: null,
  previousWorkspaceId: null,
  lastUsedWorkspaceId: null,
  members: [],
  preferences: defaultPreferences,
  filters: {
    query: '',
    sort: 'recent',
    filter: 'all',
  },
  status: 'idle',
  membersStatus: 'idle',
  error: null,
  initialized: false,

  setFilters: (partial) => {
    set({ filters: { ...get().filters, ...partial } });
  },

  clearError: () => {
    set({ error: null });
  },

  initialize: async () => {
    if (get().initialized && get().status === 'ready') {
      return;
    }
    set({ status: 'loading', error: null });
    try {
      const [workspaces, selection, preferences] = await Promise.all([
        service.listWorkspaces(),
        service.getSelection(),
        service.getPreferences(),
      ]);

      const current =
        workspaces.find((workspace) => workspace.id === selection.currentId) ??
        workspaces.find((workspace) => workspace.id === selection.lastUsedId) ??
        workspaces.find((workspace) => !workspace.archivedAt) ??
        null;

      set({
        workspaces,
        currentWorkspace: current,
        previousWorkspaceId: selection.previousId,
        lastUsedWorkspaceId: selection.lastUsedId,
        preferences,
        status: 'ready',
        initialized: true,
      });
    } catch (error) {
      set({
        status: 'error',
        error: error instanceof Error ? error.message : 'Workspaces could not be loaded.',
      });
    }
  },

  refresh: async () => {
    set({ status: 'loading', error: null });
    try {
      const workspaces = await service.listWorkspaces();
      const currentId = get().currentWorkspace?.id;
      set({
        workspaces,
        currentWorkspace: workspaces.find((workspace) => workspace.id === currentId) ?? null,
        status: 'ready',
      });
    } catch (error) {
      set({
        status: 'error',
        error: error instanceof Error ? error.message : 'Workspaces could not be loaded.',
      });
    }
  },

  createWorkspace: async (input) => {
    const workspace = await service.createWorkspace(input);
    set({ workspaces: [workspace, ...get().workspaces] });
    await get().switchWorkspace(workspace.id);
    return workspace;
  },

  updateWorkspace: async (id, input) => {
    const updated = await service.updateWorkspace(id, input);
    set({
      workspaces: get().workspaces.map((workspace) => (workspace.id === id ? updated : workspace)),
      currentWorkspace: get().currentWorkspace?.id === id ? updated : get().currentWorkspace,
    });
    return updated;
  },

  archiveWorkspace: async (id) => {
    const archived = await service.archiveWorkspace(id);
    set({
      workspaces: get().workspaces.map((workspace) => (workspace.id === id ? archived : workspace)),
      currentWorkspace: get().currentWorkspace?.id === id ? archived : get().currentWorkspace,
    });
  },

  restoreWorkspace: async (id) => {
    const restored = await service.restoreWorkspace(id);
    set({
      workspaces: get().workspaces.map((workspace) => (workspace.id === id ? restored : workspace)),
      currentWorkspace: get().currentWorkspace?.id === id ? restored : get().currentWorkspace,
    });
  },

  deleteWorkspace: async (id) => {
    await service.deleteWorkspace(id);
    const workspaces = get().workspaces.filter((workspace) => workspace.id !== id);
    const wasCurrent = get().currentWorkspace?.id === id;
    set({
      workspaces,
      currentWorkspace: wasCurrent ? null : get().currentWorkspace,
    });
    if (wasCurrent) {
      const next = workspaces.find((workspace) => !workspace.archivedAt);
      if (next) {
        await get().switchWorkspace(next.id);
      }
    }
  },

  toggleFavorite: async (id) => {
    const updated = await service.toggleFavorite(id);
    set({
      workspaces: get().workspaces.map((workspace) => (workspace.id === id ? updated : workspace)),
      currentWorkspace: get().currentWorkspace?.id === id ? updated : get().currentWorkspace,
    });
  },

  switchWorkspace: async (id) => {
    const previousId = get().currentWorkspace?.id ?? null;
    const workspace = await service.switchWorkspace(id);
    const workspaces = get().workspaces.map((item) => (item.id === id ? workspace : item));
    set({
      workspaces,
      currentWorkspace: workspace,
      previousWorkspaceId: previousId && previousId !== id ? previousId : get().previousWorkspaceId,
      lastUsedWorkspaceId: id,
    });
    return workspace;
  },

  loadMembers: async (workspaceId) => {
    set({ membersStatus: 'loading' });
    try {
      const members = await service.listMembers(workspaceId);
      set({ members, membersStatus: 'ready' });
    } catch (error) {
      set({
        membersStatus: 'error',
        error: error instanceof Error ? error.message : 'Members could not be loaded.',
      });
    }
  },

  inviteMember: async (workspaceId, input) => {
    await service.inviteMember(workspaceId, input);
    await get().loadMembers(workspaceId);
    await get().refresh();
  },

  removeMember: async (workspaceId, memberId) => {
    await service.removeMember(workspaceId, memberId);
    await get().loadMembers(workspaceId);
    await get().refresh();
  },

  updateMemberRole: async (workspaceId, memberId, role) => {
    await service.updateMemberRole(workspaceId, memberId, role);
    await get().loadMembers(workspaceId);
  },

  updatePreferences: async (prefs) => {
    const preferences = await service.updatePreferences(prefs);
    set({ preferences });
  },
}));

export const selectFilteredWorkspaces = (state: WorkspaceStoreState): Workspace[] => {
  const { query, sort, filter } = state.filters;
  let items = [...state.workspaces];

  if (filter === 'favorites') {
    items = items.filter((workspace) => workspace.isFavorite && !workspace.archivedAt);
  } else if (filter === 'archived') {
    items = items.filter((workspace) => workspace.archivedAt !== null);
  } else if (filter === 'owned') {
    items = items.filter((workspace) => workspace.role === 'owner' && !workspace.archivedAt);
  } else {
    items = items.filter((workspace) => workspace.archivedAt === null);
  }

  const normalized = query.trim().toLowerCase();
  if (normalized) {
    items = items.filter(
      (workspace) =>
        workspace.name.toLowerCase().includes(normalized) ||
        workspace.slug.toLowerCase().includes(normalized),
    );
  }

  items.sort((left, right) => {
    if (sort === 'name') {
      return left.name.localeCompare(right.name);
    }
    if (sort === 'created') {
      return right.createdAt - left.createdAt;
    }
    if (sort === 'favorites') {
      return (
        Number(right.isFavorite) - Number(left.isFavorite) || right.lastUsedAt - left.lastUsedAt
      );
    }
    return right.lastUsedAt - left.lastUsedAt;
  });

  return items;
};
