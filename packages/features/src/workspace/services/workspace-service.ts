import type {
  CreateWorkspaceInput,
  InviteMemberInput,
  UpdateWorkspaceInput,
  Workspace,
  WorkspaceMember,
  WorkspacePreferences,
  WorkspaceRole,
} from '@features/workspace/types';

const STORAGE_KEY = 'primordial-workspaces-v1';
const SELECTION_KEY = 'primordial-workspace-selection-v1';
const PREFS_KEY = 'primordial-workspace-preferences-v1';

interface WorkspaceSelectionState {
  readonly currentId: string | null;
  readonly previousId: string | null;
  readonly lastUsedId: string | null;
}

interface WorkspaceRepositoryState {
  readonly workspaces: Workspace[];
  readonly membersByWorkspace: Record<string, WorkspaceMember[]>;
}

const delay = async (ms = 220): Promise<void> => {
  await new Promise((resolve) => {
    globalThis.setTimeout(resolve, ms);
  });
};

const createId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `ws-${Date.now()}`;
};

const initialsFromName = (name: string): string => {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('') || 'WS'
  );
};

const defaultOwner = {
  id: 'user-local',
  fullName: 'Local User',
  email: 'dev@primordial.dev',
};

const seedWorkspaces = (): WorkspaceRepositoryState => {
  const now = Date.now();
  const personal: Workspace = {
    id: 'ws-personal',
    name: 'Personal Workspace',
    slug: 'personal-workspace',
    description: 'Your private workspace for focused work.',
    color: '#E6E6E6',
    owner: defaultOwner,
    role: 'owner',
    memberCount: 1,
    visibility: 'private',
    isFavorite: true,
    lastUsedAt: now - 1000 * 60 * 20,
    createdAt: now - 1000 * 60 * 60 * 24 * 30,
    updatedAt: now - 1000 * 60 * 20,
    archivedAt: null,
  };

  const studio: Workspace = {
    id: 'ws-studio',
    name: 'Primordial Studio',
    slug: 'primordial-studio',
    description: 'Shared workspace for product and engineering.',
    color: '#60A5FA',
    owner: defaultOwner,
    role: 'administrator',
    memberCount: 12,
    visibility: 'team',
    isFavorite: false,
    lastUsedAt: now - 1000 * 60 * 60 * 5,
    createdAt: now - 1000 * 60 * 60 * 24 * 90,
    updatedAt: now - 1000 * 60 * 60 * 5,
    archivedAt: null,
  };

  return {
    workspaces: [personal, studio],
    membersByWorkspace: {
      [personal.id]: [
        {
          id: 'mem-1',
          userId: defaultOwner.id,
          fullName: defaultOwner.fullName,
          email: defaultOwner.email,
          role: 'owner',
          status: 'active',
          lastActiveAt: now,
          presence: 'online',
        },
      ],
      [studio.id]: [
        {
          id: 'mem-2',
          userId: defaultOwner.id,
          fullName: defaultOwner.fullName,
          email: defaultOwner.email,
          role: 'administrator',
          status: 'active',
          lastActiveAt: now,
          presence: 'online',
        },
        {
          id: 'mem-3',
          userId: 'user-alex',
          fullName: 'Alex Rivera',
          email: 'alex@primordial.dev',
          role: 'member',
          status: 'active',
          lastActiveAt: now - 1000 * 60 * 40,
          presence: 'away',
        },
        {
          id: 'mem-4',
          userId: 'user-sam',
          fullName: 'Sam Chen',
          email: 'sam@primordial.dev',
          role: 'viewer',
          status: 'invited',
          lastActiveAt: null,
          presence: 'offline',
        },
      ],
    },
  };
};

const readRepo = (): WorkspaceRepositoryState => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded = seedWorkspaces();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    return JSON.parse(raw) as WorkspaceRepositoryState;
  } catch {
    return seedWorkspaces();
  }
};

const writeRepo = (state: WorkspaceRepositoryState): void => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const readSelection = (): WorkspaceSelectionState => {
  try {
    const raw = window.localStorage.getItem(SELECTION_KEY);
    if (!raw) {
      return { currentId: null, previousId: null, lastUsedId: null };
    }
    return JSON.parse(raw) as WorkspaceSelectionState;
  } catch {
    return { currentId: null, previousId: null, lastUsedId: null };
  }
};

const writeSelection = (state: WorkspaceSelectionState): void => {
  window.localStorage.setItem(SELECTION_KEY, JSON.stringify(state));
};

const readPreferences = (): WorkspacePreferences => {
  try {
    const raw = window.localStorage.getItem(PREFS_KEY);
    if (!raw) {
      return {
        defaultView: 'dashboard',
        density: 'comfortable',
        showArchivedInSwitcher: false,
      };
    }
    return JSON.parse(raw) as WorkspacePreferences;
  } catch {
    return {
      defaultView: 'dashboard',
      density: 'comfortable',
      showArchivedInSwitcher: false,
    };
  }
};

const writePreferences = (prefs: WorkspacePreferences): void => {
  window.localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
};

export interface WorkspaceService {
  listWorkspaces(): Promise<Workspace[]>;
  getWorkspace(id: string): Promise<Workspace | null>;
  createWorkspace(input: CreateWorkspaceInput): Promise<Workspace>;
  updateWorkspace(id: string, input: UpdateWorkspaceInput): Promise<Workspace>;
  archiveWorkspace(id: string): Promise<Workspace>;
  restoreWorkspace(id: string): Promise<Workspace>;
  deleteWorkspace(id: string): Promise<void>;
  toggleFavorite(id: string): Promise<Workspace>;
  switchWorkspace(id: string): Promise<Workspace>;
  getSelection(): Promise<WorkspaceSelectionState>;
  listMembers(workspaceId: string): Promise<WorkspaceMember[]>;
  inviteMember(workspaceId: string, input: InviteMemberInput): Promise<WorkspaceMember>;
  removeMember(workspaceId: string, memberId: string): Promise<void>;
  updateMemberRole(
    workspaceId: string,
    memberId: string,
    role: Exclude<WorkspaceRole, 'owner'>,
  ): Promise<WorkspaceMember>;
  getPreferences(): Promise<WorkspacePreferences>;
  updatePreferences(prefs: Partial<WorkspacePreferences>): Promise<WorkspacePreferences>;
}

export class InMemoryWorkspaceService implements WorkspaceService {
  async listWorkspaces(): Promise<Workspace[]> {
    await delay();
    return readRepo().workspaces;
  }

  async getWorkspace(id: string): Promise<Workspace | null> {
    await delay();
    return readRepo().workspaces.find((workspace) => workspace.id === id) ?? null;
  }

  async createWorkspace(input: CreateWorkspaceInput): Promise<Workspace> {
    await delay(350);
    const repo = readRepo();
    const now = Date.now();
    const workspace: Workspace = {
      id: createId(),
      name: input.name.trim(),
      slug: input.slug.trim(),
      description: input.description?.trim() ?? '',
      logoUrl: input.logoUrl || undefined,
      color: input.color,
      owner: defaultOwner,
      role: 'owner',
      memberCount: 1,
      visibility: input.visibility,
      isFavorite: false,
      lastUsedAt: now,
      createdAt: now,
      updatedAt: now,
      archivedAt: null,
    };

    const members: WorkspaceMember[] = [
      {
        id: createId(),
        userId: defaultOwner.id,
        fullName: defaultOwner.fullName,
        email: defaultOwner.email,
        role: 'owner',
        status: 'active',
        lastActiveAt: now,
        presence: 'online',
      },
    ];

    writeRepo({
      workspaces: [workspace, ...repo.workspaces],
      membersByWorkspace: {
        ...repo.membersByWorkspace,
        [workspace.id]: members,
      },
    });

    return workspace;
  }

  async updateWorkspace(id: string, input: UpdateWorkspaceInput): Promise<Workspace> {
    await delay(280);
    const repo = readRepo();
    const index = repo.workspaces.findIndex((workspace) => workspace.id === id);
    if (index < 0) {
      throw new Error('Workspace not found.');
    }

    const current = repo.workspaces[index]!;
    const updated: Workspace = {
      ...current,
      name: input.name?.trim() ?? current.name,
      slug: input.slug?.trim() ?? current.slug,
      description: input.description?.trim() ?? current.description,
      color: input.color ?? current.color,
      logoUrl: input.logoUrl === '' ? undefined : (input.logoUrl ?? current.logoUrl),
      visibility: input.visibility ?? current.visibility,
      updatedAt: Date.now(),
    };

    const workspaces = [...repo.workspaces];
    workspaces[index] = updated;
    writeRepo({ ...repo, workspaces });
    return updated;
  }

  async archiveWorkspace(id: string): Promise<Workspace> {
    await delay(250);
    const repo = readRepo();
    const workspaces = repo.workspaces.map((workspace) =>
      workspace.id === id
        ? { ...workspace, archivedAt: Date.now(), updatedAt: Date.now() }
        : workspace,
    );
    writeRepo({ ...repo, workspaces });
    const archived = workspaces.find((workspace) => workspace.id === id);
    if (!archived) {
      throw new Error('Workspace not found.');
    }
    return archived;
  }

  async restoreWorkspace(id: string): Promise<Workspace> {
    await delay(250);
    const repo = readRepo();
    const workspaces = repo.workspaces.map((workspace) =>
      workspace.id === id ? { ...workspace, archivedAt: null, updatedAt: Date.now() } : workspace,
    );
    writeRepo({ ...repo, workspaces });
    const restored = workspaces.find((workspace) => workspace.id === id);
    if (!restored) {
      throw new Error('Workspace not found.');
    }
    return restored;
  }

  async deleteWorkspace(id: string): Promise<void> {
    await delay(300);
    const repo = readRepo();
    const membersByWorkspace = { ...repo.membersByWorkspace };
    delete membersByWorkspace[id];
    writeRepo({
      workspaces: repo.workspaces.filter((workspace) => workspace.id !== id),
      membersByWorkspace,
    });

    const selection = readSelection();
    if (selection.currentId === id) {
      writeSelection({
        currentId: selection.previousId,
        previousId: null,
        lastUsedId: selection.lastUsedId === id ? selection.previousId : selection.lastUsedId,
      });
    }
  }

  async toggleFavorite(id: string): Promise<Workspace> {
    await delay(150);
    const repo = readRepo();
    const workspaces = repo.workspaces.map((workspace) =>
      workspace.id === id
        ? { ...workspace, isFavorite: !workspace.isFavorite, updatedAt: Date.now() }
        : workspace,
    );
    writeRepo({ ...repo, workspaces });
    const next = workspaces.find((workspace) => workspace.id === id);
    if (!next) {
      throw new Error('Workspace not found.');
    }
    return next;
  }

  async switchWorkspace(id: string): Promise<Workspace> {
    await delay(180);
    const repo = readRepo();
    const workspace = repo.workspaces.find((item) => item.id === id);
    if (!workspace) {
      throw new Error('Workspace not found.');
    }
    if (workspace.archivedAt) {
      throw new Error('This workspace is archived.');
    }

    const now = Date.now();
    const workspaces = repo.workspaces.map((item) =>
      item.id === id ? { ...item, lastUsedAt: now, updatedAt: now } : item,
    );
    writeRepo({ ...repo, workspaces });

    const selection = readSelection();
    writeSelection({
      currentId: id,
      previousId:
        selection.currentId && selection.currentId !== id
          ? selection.currentId
          : selection.previousId,
      lastUsedId: id,
    });

    return workspaces.find((item) => item.id === id)!;
  }

  async getSelection(): Promise<WorkspaceSelectionState> {
    await delay(50);
    return readSelection();
  }

  async listMembers(workspaceId: string): Promise<WorkspaceMember[]> {
    await delay();
    return readRepo().membersByWorkspace[workspaceId] ?? [];
  }

  async inviteMember(workspaceId: string, input: InviteMemberInput): Promise<WorkspaceMember> {
    await delay(280);
    const repo = readRepo();
    const members = [...(repo.membersByWorkspace[workspaceId] ?? [])];
    const member: WorkspaceMember = {
      id: createId(),
      userId: createId(),
      fullName: input.email.split('@')[0] ?? 'Invited User',
      email: input.email.trim().toLowerCase(),
      role: input.role,
      status: 'invited',
      lastActiveAt: null,
      presence: 'offline',
    };
    members.push(member);

    const workspaces = repo.workspaces.map((workspace) =>
      workspace.id === workspaceId
        ? { ...workspace, memberCount: members.length, updatedAt: Date.now() }
        : workspace,
    );

    writeRepo({
      workspaces,
      membersByWorkspace: {
        ...repo.membersByWorkspace,
        [workspaceId]: members,
      },
    });

    return member;
  }

  async removeMember(workspaceId: string, memberId: string): Promise<void> {
    await delay(220);
    const repo = readRepo();
    const members = (repo.membersByWorkspace[workspaceId] ?? []).filter(
      (member) => member.id !== memberId,
    );
    const workspaces = repo.workspaces.map((workspace) =>
      workspace.id === workspaceId
        ? { ...workspace, memberCount: members.length, updatedAt: Date.now() }
        : workspace,
    );
    writeRepo({
      workspaces,
      membersByWorkspace: {
        ...repo.membersByWorkspace,
        [workspaceId]: members,
      },
    });
  }

  async updateMemberRole(
    workspaceId: string,
    memberId: string,
    role: Exclude<WorkspaceRole, 'owner'>,
  ): Promise<WorkspaceMember> {
    await delay(220);
    const repo = readRepo();
    const members = (repo.membersByWorkspace[workspaceId] ?? []).map((member) =>
      member.id === memberId ? { ...member, role } : member,
    );
    writeRepo({
      ...repo,
      membersByWorkspace: {
        ...repo.membersByWorkspace,
        [workspaceId]: members,
      },
    });
    const updated = members.find((member) => member.id === memberId);
    if (!updated) {
      throw new Error('Member not found.');
    }
    return updated;
  }

  async getPreferences(): Promise<WorkspacePreferences> {
    await delay(40);
    return readPreferences();
  }

  async updatePreferences(prefs: Partial<WorkspacePreferences>): Promise<WorkspacePreferences> {
    await delay(120);
    const next = { ...readPreferences(), ...prefs };
    writePreferences(next);
    return next;
  }
}

export const createWorkspaceService = (): WorkspaceService => new InMemoryWorkspaceService();

export const getWorkspaceInitials = (name: string): string => initialsFromName(name);
