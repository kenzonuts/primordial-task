import type {
  CreateProjectInput,
  Project,
  ProjectActivityItem,
  ProjectDeadlineItem,
  ProjectMember,
  ProjectPreferences,
  ProjectStatistic,
  UpdateProjectInput,
} from '@features/project/types';

const STORAGE_KEY = 'primordial-projects-v1';
const PREFS_KEY = 'primordial-project-preferences-v1';

interface ProjectRepositoryState {
  readonly projects: Project[];
  readonly membersByProject: Record<string, ProjectMember[]>;
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
  return `proj-${Date.now()}`;
};

const defaultOwner = {
  id: 'user-local',
  fullName: 'Alex Rivera',
  email: 'alex@primordial.dev',
};

export const getProjectInitials = (name: string): string => {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('') || 'PR'
  );
};

const seedProjects = (workspaceId: string): ProjectRepositoryState => {
  const now = Date.now();
  const projects: Project[] = [
    {
      id: 'proj-core',
      workspaceId,
      name: 'Primordial Core',
      slug: 'primordial-core',
      description: 'Foundation, auth, shell, and shared infrastructure.',
      icon: 'Layers',
      color: '#E6E6E6',
      status: 'active',
      visibility: 'workspace',
      health: 'healthy',
      progress: 72,
      owner: defaultOwner,
      memberCount: 5,
      isFavorite: true,
      isPinned: true,
      dueLabel: 'Sep 30',
      lastActivityAt: now - 1000 * 60 * 40,
      createdAt: now - 1000 * 60 * 60 * 24 * 60,
      updatedAt: now - 1000 * 60 * 40,
      archivedAt: null,
    },
    {
      id: 'proj-workspace',
      workspaceId,
      name: 'Workspace Management',
      slug: 'workspace-management',
      description: 'Workspace switching, members, roles, and settings.',
      icon: 'Box',
      color: '#60A5FA',
      status: 'active',
      visibility: 'team',
      health: 'healthy',
      progress: 58,
      owner: defaultOwner,
      memberCount: 4,
      isFavorite: true,
      isPinned: false,
      dueLabel: 'Oct 12',
      lastActivityAt: now - 1000 * 60 * 60 * 3,
      createdAt: now - 1000 * 60 * 60 * 24 * 40,
      updatedAt: now - 1000 * 60 * 60 * 3,
      archivedAt: null,
    },
    {
      id: 'proj-design',
      workspaceId,
      name: 'Design System',
      slug: 'design-system',
      description: 'Tokens, primitives, and reusable UI patterns.',
      icon: 'Sparkles',
      color: '#FACC15',
      status: 'on_hold',
      visibility: 'workspace',
      health: 'at_risk',
      progress: 91,
      owner: {
        id: 'user-sam',
        fullName: 'Sam Chen',
        email: 'sam@primordial.dev',
      },
      memberCount: 3,
      isFavorite: false,
      isPinned: true,
      dueLabel: 'Aug 28',
      lastActivityAt: now - 1000 * 60 * 60 * 26,
      createdAt: now - 1000 * 60 * 60 * 24 * 90,
      updatedAt: now - 1000 * 60 * 60 * 26,
      archivedAt: null,
    },
    {
      id: 'proj-ai',
      workspaceId,
      name: 'AI Workspace',
      slug: 'ai-workspace',
      description: 'Contextual AI assistance and prompt orchestration.',
      icon: 'Rocket',
      color: '#4ADE80',
      status: 'planning',
      visibility: 'private',
      health: 'critical',
      progress: 24,
      owner: defaultOwner,
      memberCount: 2,
      isFavorite: true,
      isPinned: false,
      dueLabel: 'Nov 5',
      lastActivityAt: now - 1000 * 60 * 60 * 50,
      createdAt: now - 1000 * 60 * 60 * 24 * 20,
      updatedAt: now - 1000 * 60 * 60 * 50,
      archivedAt: null,
    },
    {
      id: 'proj-legacy',
      workspaceId,
      name: 'Legacy Import',
      slug: 'legacy-import',
      description: 'Archived migration project for historical imports.',
      icon: 'Code2',
      color: '#858585',
      status: 'archived',
      visibility: 'workspace',
      health: 'healthy',
      progress: 100,
      owner: defaultOwner,
      memberCount: 1,
      isFavorite: false,
      isPinned: false,
      lastActivityAt: now - 1000 * 60 * 60 * 24 * 120,
      createdAt: now - 1000 * 60 * 60 * 24 * 200,
      updatedAt: now - 1000 * 60 * 60 * 24 * 120,
      archivedAt: now - 1000 * 60 * 60 * 24 * 30,
    },
  ];

  return {
    projects,
    membersByProject: {
      'proj-core': [
        {
          id: 'pm-1',
          userId: defaultOwner.id,
          fullName: defaultOwner.fullName,
          email: defaultOwner.email,
          role: 'owner',
          status: 'active',
        },
        {
          id: 'pm-2',
          userId: 'user-sam',
          fullName: 'Sam Chen',
          email: 'sam@primordial.dev',
          role: 'admin',
          status: 'active',
        },
      ],
      'proj-workspace': [
        {
          id: 'pm-3',
          userId: defaultOwner.id,
          fullName: defaultOwner.fullName,
          email: defaultOwner.email,
          role: 'owner',
          status: 'active',
        },
      ],
      'proj-design': [
        {
          id: 'pm-4',
          userId: 'user-sam',
          fullName: 'Sam Chen',
          email: 'sam@primordial.dev',
          role: 'owner',
          status: 'active',
        },
      ],
      'proj-ai': [
        {
          id: 'pm-5',
          userId: defaultOwner.id,
          fullName: defaultOwner.fullName,
          email: defaultOwner.email,
          role: 'owner',
          status: 'active',
        },
      ],
      'proj-legacy': [
        {
          id: 'pm-6',
          userId: defaultOwner.id,
          fullName: defaultOwner.fullName,
          email: defaultOwner.email,
          role: 'owner',
          status: 'active',
        },
      ],
    },
  };
};

const readRepo = (workspaceId: string): ProjectRepositoryState => {
  try {
    const raw = window.localStorage.getItem(`${STORAGE_KEY}:${workspaceId}`);
    if (!raw) {
      const seeded = seedProjects(workspaceId);
      window.localStorage.setItem(`${STORAGE_KEY}:${workspaceId}`, JSON.stringify(seeded));
      return seeded;
    }
    return JSON.parse(raw) as ProjectRepositoryState;
  } catch {
    return seedProjects(workspaceId);
  }
};

const writeRepo = (workspaceId: string, state: ProjectRepositoryState): void => {
  window.localStorage.setItem(`${STORAGE_KEY}:${workspaceId}`, JSON.stringify(state));
};

const readPreferences = (): ProjectPreferences => {
  try {
    const raw = window.localStorage.getItem(PREFS_KEY);
    if (!raw) {
      return { defaultView: 'grid', showArchivedByDefault: false, denseList: false };
    }
    return JSON.parse(raw) as ProjectPreferences;
  } catch {
    return { defaultView: 'grid', showArchivedByDefault: false, denseList: false };
  }
};

const writePreferences = (prefs: ProjectPreferences): void => {
  window.localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
};

export const PLACEHOLDER_PROJECT_ACTIVITY: readonly ProjectActivityItem[] = [
  {
    id: 'pa-1',
    actor: 'Alex Rivera',
    action: 'updated',
    target: 'Project overview layout',
    timestampLabel: '25 min ago',
  },
  {
    id: 'pa-2',
    actor: 'Sam Chen',
    action: 'commented on',
    target: 'Status badge styles',
    timestampLabel: '2h ago',
  },
  {
    id: 'pa-3',
    actor: 'Jordan Lee',
    action: 'pinned',
    target: 'Primordial Core',
    timestampLabel: 'Yesterday',
  },
];

export const PLACEHOLDER_PROJECT_DEADLINES: readonly ProjectDeadlineItem[] = [
  { id: 'pd-1', title: 'Explorer accessibility pass', dueLabel: 'Tomorrow', priority: 'high' },
  { id: 'pd-2', title: 'Settings danger zone review', dueLabel: 'Thu', priority: 'medium' },
  { id: 'pd-3', title: 'Duplicate project flow polish', dueLabel: 'Next week', priority: 'low' },
];

export const PLACEHOLDER_PROJECT_STATS: readonly ProjectStatistic[] = [
  { id: 'ps-1', label: 'Open tasks', value: '18', hint: 'Placeholder count' },
  { id: 'ps-2', label: 'Completed', value: '42', hint: 'Placeholder count' },
  { id: 'ps-3', label: 'Members', value: '5', hint: 'Active collaborators' },
  { id: 'ps-4', label: 'Progress', value: '72%', hint: 'Derived placeholder' },
];

export interface ProjectService {
  listProjects(workspaceId: string): Promise<Project[]>;
  getProject(workspaceId: string, id: string): Promise<Project | null>;
  createProject(input: CreateProjectInput): Promise<Project>;
  updateProject(workspaceId: string, id: string, input: UpdateProjectInput): Promise<Project>;
  archiveProject(workspaceId: string, id: string): Promise<Project>;
  restoreProject(workspaceId: string, id: string): Promise<Project>;
  deleteProject(workspaceId: string, id: string): Promise<void>;
  duplicateProject(workspaceId: string, id: string): Promise<Project>;
  toggleFavorite(workspaceId: string, id: string): Promise<Project>;
  togglePinned(workspaceId: string, id: string): Promise<Project>;
  listMembers(workspaceId: string, projectId: string): Promise<ProjectMember[]>;
  getPreferences(): Promise<ProjectPreferences>;
  updatePreferences(prefs: Partial<ProjectPreferences>): Promise<ProjectPreferences>;
}

export class InMemoryProjectService implements ProjectService {
  async listProjects(workspaceId: string): Promise<Project[]> {
    await delay();
    return readRepo(workspaceId).projects.filter((project) => project.workspaceId === workspaceId);
  }

  async getProject(workspaceId: string, id: string): Promise<Project | null> {
    await delay();
    return (
      readRepo(workspaceId).projects.find(
        (project) => project.id === id && project.workspaceId === workspaceId,
      ) ?? null
    );
  }

  async createProject(input: CreateProjectInput): Promise<Project> {
    await delay(320);
    const repo = readRepo(input.workspaceId);
    const now = Date.now();
    const project: Project = {
      id: createId(),
      workspaceId: input.workspaceId,
      name: input.name.trim(),
      slug: input.slug.trim(),
      description: input.description?.trim() ?? '',
      icon: input.icon || 'FolderKanban',
      coverUrl: input.coverUrl || undefined,
      color: input.color,
      status: input.status === 'archived' ? 'planning' : input.status,
      visibility: input.visibility,
      health: 'healthy',
      progress: 0,
      owner: defaultOwner,
      memberCount: 1,
      isFavorite: false,
      isPinned: false,
      lastActivityAt: now,
      createdAt: now,
      updatedAt: now,
      archivedAt: null,
    };

    writeRepo(input.workspaceId, {
      projects: [project, ...repo.projects],
      membersByProject: {
        ...repo.membersByProject,
        [project.id]: [
          {
            id: createId(),
            userId: defaultOwner.id,
            fullName: defaultOwner.fullName,
            email: defaultOwner.email,
            role: 'owner',
            status: 'active',
          },
        ],
      },
    });

    return project;
  }

  async updateProject(
    workspaceId: string,
    id: string,
    input: UpdateProjectInput,
  ): Promise<Project> {
    await delay(260);
    const repo = readRepo(workspaceId);
    const index = repo.projects.findIndex((project) => project.id === id);
    if (index < 0) {
      throw new Error('Project not found.');
    }

    const current = repo.projects[index]!;
    const updated: Project = {
      ...current,
      name: input.name?.trim() ?? current.name,
      slug: input.slug?.trim() ?? current.slug,
      description: input.description?.trim() ?? current.description,
      icon: input.icon === '' ? undefined : (input.icon ?? current.icon),
      coverUrl: input.coverUrl === '' ? undefined : (input.coverUrl ?? current.coverUrl),
      color: input.color ?? current.color,
      status: input.status ?? current.status,
      visibility: input.visibility ?? current.visibility,
      updatedAt: Date.now(),
      lastActivityAt: Date.now(),
      archivedAt: input.status === 'archived' ? Date.now() : current.archivedAt,
    };

    const projects = [...repo.projects];
    projects[index] = updated;
    writeRepo(workspaceId, { ...repo, projects });
    return updated;
  }

  async archiveProject(workspaceId: string, id: string): Promise<Project> {
    await delay(220);
    const repo = readRepo(workspaceId);
    const projects = repo.projects.map((project) =>
      project.id === id
        ? {
            ...project,
            status: 'archived' as const,
            archivedAt: Date.now(),
            updatedAt: Date.now(),
            lastActivityAt: Date.now(),
          }
        : project,
    );
    writeRepo(workspaceId, { ...repo, projects });
    const archived = projects.find((project) => project.id === id);
    if (!archived) {
      throw new Error('Project not found.');
    }
    return archived;
  }

  async restoreProject(workspaceId: string, id: string): Promise<Project> {
    await delay(220);
    const repo = readRepo(workspaceId);
    const projects = repo.projects.map((project) =>
      project.id === id
        ? {
            ...project,
            status: 'active' as const,
            archivedAt: null,
            updatedAt: Date.now(),
            lastActivityAt: Date.now(),
          }
        : project,
    );
    writeRepo(workspaceId, { ...repo, projects });
    const restored = projects.find((project) => project.id === id);
    if (!restored) {
      throw new Error('Project not found.');
    }
    return restored;
  }

  async deleteProject(workspaceId: string, id: string): Promise<void> {
    await delay(280);
    const repo = readRepo(workspaceId);
    const membersByProject = Object.fromEntries(
      Object.entries(repo.membersByProject).filter(([projectId]) => projectId !== id),
    );
    writeRepo(workspaceId, {
      projects: repo.projects.filter((project) => project.id !== id),
      membersByProject,
    });
  }

  async duplicateProject(workspaceId: string, id: string): Promise<Project> {
    await delay(300);
    const repo = readRepo(workspaceId);
    const source = repo.projects.find((project) => project.id === id);
    if (!source) {
      throw new Error('Project not found.');
    }

    const now = Date.now();
    const duplicate: Project = {
      ...source,
      id: createId(),
      name: `${source.name} Copy`,
      slug: `${source.slug}-copy-${String(now).slice(-4)}`,
      isFavorite: false,
      isPinned: false,
      progress: 0,
      status: source.status === 'archived' ? 'planning' : source.status,
      archivedAt: null,
      createdAt: now,
      updatedAt: now,
      lastActivityAt: now,
    };

    writeRepo(workspaceId, {
      projects: [duplicate, ...repo.projects],
      membersByProject: {
        ...repo.membersByProject,
        [duplicate.id]: [
          {
            id: createId(),
            userId: defaultOwner.id,
            fullName: defaultOwner.fullName,
            email: defaultOwner.email,
            role: 'owner',
            status: 'active',
          },
        ],
      },
    });

    return duplicate;
  }

  async toggleFavorite(workspaceId: string, id: string): Promise<Project> {
    await delay(140);
    const repo = readRepo(workspaceId);
    const projects = repo.projects.map((project) =>
      project.id === id
        ? { ...project, isFavorite: !project.isFavorite, updatedAt: Date.now() }
        : project,
    );
    writeRepo(workspaceId, { ...repo, projects });
    const next = projects.find((project) => project.id === id);
    if (!next) {
      throw new Error('Project not found.');
    }
    return next;
  }

  async togglePinned(workspaceId: string, id: string): Promise<Project> {
    await delay(140);
    const repo = readRepo(workspaceId);
    const projects = repo.projects.map((project) =>
      project.id === id
        ? { ...project, isPinned: !project.isPinned, updatedAt: Date.now() }
        : project,
    );
    writeRepo(workspaceId, { ...repo, projects });
    const next = projects.find((project) => project.id === id);
    if (!next) {
      throw new Error('Project not found.');
    }
    return next;
  }

  async listMembers(workspaceId: string, projectId: string): Promise<ProjectMember[]> {
    await delay();
    return readRepo(workspaceId).membersByProject[projectId] ?? [];
  }

  async getPreferences(): Promise<ProjectPreferences> {
    await delay(40);
    return readPreferences();
  }

  async updatePreferences(prefs: Partial<ProjectPreferences>): Promise<ProjectPreferences> {
    await delay(100);
    const next = { ...readPreferences(), ...prefs };
    writePreferences(next);
    return next;
  }
}

export const createProjectService = (): ProjectService => new InMemoryProjectService();
