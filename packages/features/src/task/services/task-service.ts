import type {
  BulkTaskUpdateInput,
  CreateTaskInput,
  MoveTaskInput,
  Task,
  TaskActivityItem,
  TaskAttachment,
  TaskChecklistItem,
  TaskComment,
  TaskDependency,
  TaskHistoryItem,
  TaskLabel,
  TaskPerson,
  TaskPreferences,
  UpdateTaskInput,
} from '@features/task/types';

const STORAGE_KEY = 'primordial-tasks-v1';
const PREFS_KEY = 'primordial-task-preferences-v1';

interface TaskRepositoryState {
  tasks: Task[];
  checklists: Record<string, TaskChecklistItem[]>;
  comments: Record<string, TaskComment[]>;
  attachments: Record<string, TaskAttachment[]>;
  dependencies: Record<string, TaskDependency[]>;
  activity: Record<string, TaskActivityItem[]>;
  history: Record<string, TaskHistoryItem[]>;
}

const delay = async (ms = 180): Promise<void> => {
  await new Promise((resolve) => {
    globalThis.setTimeout(resolve, ms);
  });
};

const createId = (prefix = 'task'): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

export const DEFAULT_TASK_PERSON: TaskPerson = {
  id: 'user-local',
  fullName: 'Alex Rivera',
  email: 'alex@primordial.dev',
};

const PEOPLE: readonly TaskPerson[] = [
  DEFAULT_TASK_PERSON,
  {
    id: 'user-sam',
    fullName: 'Sam Chen',
    email: 'sam@primordial.dev',
  },
  {
    id: 'user-jordan',
    fullName: 'Jordan Lee',
    email: 'jordan@primordial.dev',
  },
];

const LABELS: readonly TaskLabel[] = [
  { id: 'label-core', name: 'Core', color: '#E6E6E6' },
  { id: 'label-ux', name: 'UX', color: '#60A5FA' },
  { id: 'label-bug', name: 'Bugfix', color: '#F87171' },
  { id: 'label-docs', name: 'Docs', color: '#4ADE80' },
];

const PROJECTS = [
  { id: 'proj-core', name: 'Primordial Core' },
  { id: 'proj-workspace', name: 'Workspace Management' },
  { id: 'proj-design', name: 'Design System' },
  { id: 'proj-ai', name: 'AI Workspace' },
] as const;

const resolvePerson = (id: string | null | undefined): TaskPerson | null => {
  if (!id) {
    return null;
  }
  return PEOPLE.find((person) => person.id === id) ?? null;
};

const resolveProjectName = (projectId: string): string => {
  return PROJECTS.find((project) => project.id === projectId)?.name ?? 'Unknown Project';
};

const formatRelative = (timestamp: number): string => {
  const delta = Date.now() - timestamp;
  const minutes = Math.round(delta / 60_000);
  if (minutes < 60) {
    return `${Math.max(1, minutes)}m ago`;
  }
  const hours = Math.round(minutes / 60);
  if (hours < 48) {
    return `${hours}h ago`;
  }
  return `${Math.round(hours / 24)}d ago`;
};

const defaultPreferences = (): TaskPreferences => ({
  defaultView: 'table',
  defaultGroupBy: 'none',
  showCompleted: true,
  showArchivedByDefault: false,
  denseList: false,
  pageSize: 25,
});

const readPreferences = (): TaskPreferences => {
  try {
    const raw = globalThis.localStorage?.getItem(PREFS_KEY);
    if (!raw) {
      return defaultPreferences();
    }
    return { ...defaultPreferences(), ...(JSON.parse(raw) as Partial<TaskPreferences>) };
  } catch {
    return defaultPreferences();
  }
};

const writePreferences = (prefs: TaskPreferences): void => {
  try {
    globalThis.localStorage?.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {
    // ignore quota errors in mock layer
  }
};

const emptyRepo = (): TaskRepositoryState => ({
  tasks: [],
  checklists: {},
  comments: {},
  attachments: {},
  dependencies: {},
  activity: {},
  history: {},
});

const seedTasks = (workspaceId: string): TaskRepositoryState => {
  const now = Date.now();
  const day = 1000 * 60 * 60 * 24;

  const parentId = 'task-auth-flow';
  const epicId = 'task-shell-epic';

  const tasks: Task[] = [
    {
      id: epicId,
      workspaceId,
      projectId: 'proj-core',
      projectName: 'Primordial Core',
      parentTaskId: null,
      title: 'Ship Application Shell epic',
      description: 'Coordinate shell navigation, command palette, and layout polish.',
      status: 'in_progress',
      priority: 'high',
      type: 'epic',
      assignee: DEFAULT_TASK_PERSON,
      reporter: DEFAULT_TASK_PERSON,
      startDate: now - day * 14,
      dueDate: now + day * 10,
      completedDate: null,
      estimatedMinutes: 2400,
      actualMinutes: 960,
      position: 0,
      orderIndex: 0,
      labels: [LABELS[0]!],
      tags: ['shell', 'milestone'],
      attachmentCount: 1,
      commentCount: 2,
      checklistTotal: 3,
      checklistCompleted: 1,
      dependencyCount: 1,
      watcherIds: ['user-local', 'user-sam'],
      subtaskCount: 2,
      subtaskCompleted: 0,
      isFavorite: true,
      isPinned: true,
      depth: 0,
      createdAt: now - day * 20,
      updatedAt: now - 1000 * 60 * 35,
      archivedAt: null,
    },
    {
      id: parentId,
      workspaceId,
      projectId: 'proj-core',
      projectName: 'Primordial Core',
      parentTaskId: epicId,
      title: 'Finalize authentication flow',
      description: 'Cover login, register, session expiry, and protected routes.',
      status: 'in_review',
      priority: 'critical',
      type: 'feature',
      assignee: PEOPLE[1]!,
      reporter: DEFAULT_TASK_PERSON,
      startDate: now - day * 7,
      dueDate: now + day * 2,
      completedDate: null,
      estimatedMinutes: 480,
      actualMinutes: 360,
      position: 1,
      orderIndex: 1,
      labels: [LABELS[0]!, LABELS[1]!],
      tags: ['auth'],
      attachmentCount: 2,
      commentCount: 3,
      checklistTotal: 4,
      checklistCompleted: 3,
      dependencyCount: 2,
      watcherIds: ['user-local'],
      subtaskCount: 2,
      subtaskCompleted: 1,
      isFavorite: true,
      isPinned: false,
      depth: 1,
      createdAt: now - day * 12,
      updatedAt: now - 1000 * 60 * 90,
      archivedAt: null,
    },
    {
      id: 'task-auth-tests',
      workspaceId,
      projectId: 'proj-core',
      projectName: 'Primordial Core',
      parentTaskId: parentId,
      title: 'Add auth route smoke tests',
      description: 'Ensure guest and protected route guards behave correctly.',
      status: 'completed',
      priority: 'medium',
      type: 'task',
      assignee: PEOPLE[2]!,
      reporter: PEOPLE[1]!,
      startDate: now - day * 5,
      dueDate: now - day,
      completedDate: now - day,
      estimatedMinutes: 120,
      actualMinutes: 140,
      position: 0,
      orderIndex: 0,
      labels: [LABELS[0]!],
      tags: ['testing'],
      attachmentCount: 0,
      commentCount: 1,
      checklistTotal: 2,
      checklistCompleted: 2,
      dependencyCount: 0,
      watcherIds: [],
      subtaskCount: 0,
      subtaskCompleted: 0,
      isFavorite: false,
      isPinned: false,
      depth: 2,
      createdAt: now - day * 6,
      updatedAt: now - day,
      archivedAt: null,
    },
    {
      id: 'task-session-banner',
      workspaceId,
      projectId: 'proj-core',
      projectName: 'Primordial Core',
      parentTaskId: parentId,
      title: 'Polish session expiry banner',
      description: 'Improve copy and focus management on session expired screen.',
      status: 'todo',
      priority: 'low',
      type: 'improvement',
      assignee: null,
      reporter: DEFAULT_TASK_PERSON,
      startDate: null,
      dueDate: now + day * 5,
      completedDate: null,
      estimatedMinutes: 90,
      actualMinutes: null,
      position: 1,
      orderIndex: 1,
      labels: [LABELS[1]!],
      tags: ['ux'],
      attachmentCount: 0,
      commentCount: 0,
      checklistTotal: 0,
      checklistCompleted: 0,
      dependencyCount: 1,
      watcherIds: ['user-sam'],
      subtaskCount: 0,
      subtaskCompleted: 0,
      isFavorite: false,
      isPinned: false,
      depth: 2,
      createdAt: now - day * 4,
      updatedAt: now - 1000 * 60 * 200,
      archivedAt: null,
    },
    {
      id: 'task-workspace-switcher',
      workspaceId,
      projectId: 'proj-workspace',
      projectName: 'Workspace Management',
      parentTaskId: null,
      title: 'Improve workspace switcher latency',
      description: 'Cache workspace options and avoid flicker on route changes.',
      status: 'in_progress',
      priority: 'high',
      type: 'bug',
      assignee: DEFAULT_TASK_PERSON,
      reporter: PEOPLE[2]!,
      startDate: now - day * 3,
      dueDate: now + day,
      completedDate: null,
      estimatedMinutes: 180,
      actualMinutes: 60,
      position: 0,
      orderIndex: 2,
      labels: [LABELS[2]!],
      tags: ['performance'],
      attachmentCount: 1,
      commentCount: 1,
      checklistTotal: 2,
      checklistCompleted: 0,
      dependencyCount: 0,
      watcherIds: ['user-local'],
      subtaskCount: 0,
      subtaskCompleted: 0,
      isFavorite: false,
      isPinned: true,
      depth: 0,
      createdAt: now - day * 8,
      updatedAt: now - 1000 * 60 * 15,
      archivedAt: null,
    },
    {
      id: 'task-tokens-audit',
      workspaceId,
      projectId: 'proj-design',
      projectName: 'Design System',
      parentTaskId: null,
      title: 'Audit contrast tokens for WCAG AA',
      description: 'Validate text and border contrast across surfaces.',
      status: 'blocked',
      priority: 'medium',
      type: 'research',
      assignee: PEOPLE[1]!,
      reporter: DEFAULT_TASK_PERSON,
      startDate: now - day * 2,
      dueDate: now + day * 7,
      completedDate: null,
      estimatedMinutes: 240,
      actualMinutes: 30,
      position: 0,
      orderIndex: 3,
      labels: [LABELS[1]!, LABELS[3]!],
      tags: ['a11y', 'design'],
      attachmentCount: 0,
      commentCount: 0,
      checklistTotal: 1,
      checklistCompleted: 0,
      dependencyCount: 1,
      watcherIds: [],
      subtaskCount: 0,
      subtaskCompleted: 0,
      isFavorite: true,
      isPinned: false,
      depth: 0,
      createdAt: now - day * 9,
      updatedAt: now - 1000 * 60 * 400,
      archivedAt: null,
    },
    {
      id: 'task-ai-prompt-kit',
      workspaceId,
      projectId: 'proj-ai',
      projectName: 'AI Workspace',
      parentTaskId: null,
      title: 'Draft prompt kit scaffolding',
      description: 'Placeholder structure for contextual AI prompt packs.',
      status: 'backlog',
      priority: 'none',
      type: 'documentation',
      assignee: null,
      reporter: DEFAULT_TASK_PERSON,
      startDate: null,
      dueDate: null,
      completedDate: null,
      estimatedMinutes: 300,
      actualMinutes: null,
      position: 0,
      orderIndex: 4,
      labels: [LABELS[3]!],
      tags: ['ai'],
      attachmentCount: 0,
      commentCount: 0,
      checklistTotal: 0,
      checklistCompleted: 0,
      dependencyCount: 0,
      watcherIds: [],
      subtaskCount: 0,
      subtaskCompleted: 0,
      isFavorite: false,
      isPinned: false,
      depth: 0,
      createdAt: now - day * 2,
      updatedAt: now - day * 2,
      archivedAt: null,
    },
    {
      id: 'task-legacy-import',
      workspaceId,
      projectId: 'proj-core',
      projectName: 'Primordial Core',
      parentTaskId: null,
      title: 'Archive legacy import checklist',
      description: 'Historical migration checklist retained for reference.',
      status: 'archived',
      priority: 'low',
      type: 'chore',
      assignee: PEOPLE[2]!,
      reporter: DEFAULT_TASK_PERSON,
      startDate: now - day * 60,
      dueDate: now - day * 40,
      completedDate: now - day * 40,
      estimatedMinutes: 60,
      actualMinutes: 75,
      position: 0,
      orderIndex: 99,
      labels: [],
      tags: ['legacy'],
      attachmentCount: 0,
      commentCount: 0,
      checklistTotal: 0,
      checklistCompleted: 0,
      dependencyCount: 0,
      watcherIds: [],
      subtaskCount: 0,
      subtaskCompleted: 0,
      isFavorite: false,
      isPinned: false,
      depth: 0,
      createdAt: now - day * 70,
      updatedAt: now - day * 40,
      archivedAt: now - day * 39,
    },
  ];

  return {
    tasks,
    checklists: {
      [epicId]: [
        { id: 'chk-1', title: 'Sidebar polish', completed: true, orderIndex: 0 },
        { id: 'chk-2', title: 'Command palette shortcuts', completed: false, orderIndex: 1 },
        { id: 'chk-3', title: 'Utility panel states', completed: false, orderIndex: 2 },
      ],
      [parentId]: [
        { id: 'chk-a', title: 'Login screen', completed: true, orderIndex: 0 },
        { id: 'chk-b', title: 'Register screen', completed: true, orderIndex: 1 },
        { id: 'chk-c', title: 'Protected routes', completed: true, orderIndex: 2 },
        { id: 'chk-d', title: 'Session expiry', completed: false, orderIndex: 3 },
      ],
      'task-auth-tests': [
        { id: 'chk-t1', title: 'Guest route cases', completed: true, orderIndex: 0 },
        { id: 'chk-t2', title: 'Protected route cases', completed: true, orderIndex: 1 },
      ],
      'task-workspace-switcher': [
        { id: 'chk-w1', title: 'Measure switch cost', completed: false, orderIndex: 0 },
        { id: 'chk-w2', title: 'Memoize options map', completed: false, orderIndex: 1 },
      ],
      'task-tokens-audit': [
        { id: 'chk-d1', title: 'Collect failing pairs', completed: false, orderIndex: 0 },
      ],
    },
    comments: {
      [epicId]: [
        {
          id: 'cmt-1',
          taskId: epicId,
          author: DEFAULT_TASK_PERSON,
          body: 'Focus on density and keyboard paths this sprint.',
          parentId: null,
          createdAt: now - 1000 * 60 * 200,
          updatedAt: now - 1000 * 60 * 200,
          reactionsPlaceholder: ['👍'],
        },
        {
          id: 'cmt-2',
          taskId: epicId,
          author: PEOPLE[1]!,
          body: 'Utility panel should stay optional outside dashboard.',
          parentId: null,
          createdAt: now - 1000 * 60 * 80,
          updatedAt: now - 1000 * 60 * 80,
          reactionsPlaceholder: [],
        },
      ],
      [parentId]: [
        {
          id: 'cmt-3',
          taskId: parentId,
          author: PEOPLE[1]!,
          body: 'Ready for review after session banner polish.',
          parentId: null,
          createdAt: now - 1000 * 60 * 50,
          updatedAt: now - 1000 * 60 * 50,
          reactionsPlaceholder: ['👀'],
        },
        {
          id: 'cmt-4',
          taskId: parentId,
          author: DEFAULT_TASK_PERSON,
          body: '@sam can you verify focus trap on expiry?',
          parentId: 'cmt-3',
          createdAt: now - 1000 * 60 * 40,
          updatedAt: now - 1000 * 60 * 40,
          reactionsPlaceholder: [],
        },
        {
          id: 'cmt-5',
          taskId: parentId,
          author: PEOPLE[2]!,
          body: 'Smoke tests are green on desktop.',
          parentId: null,
          createdAt: now - 1000 * 60 * 30,
          updatedAt: now - 1000 * 60 * 30,
          reactionsPlaceholder: [],
        },
      ],
      'task-auth-tests': [
        {
          id: 'cmt-6',
          taskId: 'task-auth-tests',
          author: PEOPLE[2]!,
          body: 'Coverage looks sufficient for Phase 9 handoff.',
          parentId: null,
          createdAt: now - day,
          updatedAt: now - day,
          reactionsPlaceholder: [],
        },
      ],
      'task-workspace-switcher': [
        {
          id: 'cmt-7',
          taskId: 'task-workspace-switcher',
          author: DEFAULT_TASK_PERSON,
          body: 'Seeing flicker when switching from projects to dashboard.',
          parentId: null,
          createdAt: now - 1000 * 60 * 20,
          updatedAt: now - 1000 * 60 * 20,
          reactionsPlaceholder: [],
        },
      ],
    },
    attachments: {
      [epicId]: [
        {
          id: 'att-1',
          taskId: epicId,
          name: 'shell-wireframe.png',
          mimeType: 'image/png',
          sizeLabel: '240 KB',
          kind: 'image',
          previewPlaceholder: true,
          createdAt: now - day * 3,
        },
      ],
      [parentId]: [
        {
          id: 'att-2',
          taskId: parentId,
          name: 'auth-flow.md',
          mimeType: 'text/markdown',
          sizeLabel: '12 KB',
          kind: 'file',
          previewPlaceholder: true,
          createdAt: now - day * 2,
        },
        {
          id: 'att-3',
          taskId: parentId,
          name: 'session-notes.pdf',
          mimeType: 'application/pdf',
          sizeLabel: '88 KB',
          kind: 'file',
          previewPlaceholder: true,
          createdAt: now - day,
        },
      ],
      'task-workspace-switcher': [
        {
          id: 'att-4',
          taskId: 'task-workspace-switcher',
          name: 'perf-trace.json',
          mimeType: 'application/json',
          sizeLabel: '34 KB',
          kind: 'file',
          previewPlaceholder: true,
          createdAt: now - 1000 * 60 * 60,
        },
      ],
    },
    dependencies: {
      [epicId]: [
        {
          id: 'dep-1',
          taskId: epicId,
          relatedTaskId: parentId,
          relatedTitle: 'Finalize authentication flow',
          type: 'child',
        },
      ],
      [parentId]: [
        {
          id: 'dep-2',
          taskId: parentId,
          relatedTaskId: epicId,
          relatedTitle: 'Ship Application Shell epic',
          type: 'parent',
        },
        {
          id: 'dep-3',
          taskId: parentId,
          relatedTaskId: 'task-session-banner',
          relatedTitle: 'Polish session expiry banner',
          type: 'blocked_by',
        },
      ],
      'task-session-banner': [
        {
          id: 'dep-4',
          taskId: 'task-session-banner',
          relatedTaskId: parentId,
          relatedTitle: 'Finalize authentication flow',
          type: 'blocks',
        },
      ],
      'task-tokens-audit': [
        {
          id: 'dep-5',
          taskId: 'task-tokens-audit',
          relatedTaskId: epicId,
          relatedTitle: 'Ship Application Shell epic',
          type: 'related',
        },
      ],
    },
    activity: {
      [parentId]: [
        {
          id: 'act-1',
          taskId: parentId,
          actor: 'Sam Chen',
          action: 'moved status to',
          target: 'In Review',
          timestamp: now - 1000 * 60 * 90,
          timestampLabel: formatRelative(now - 1000 * 60 * 90),
        },
        {
          id: 'act-2',
          taskId: parentId,
          actor: 'Alex Rivera',
          action: 'commented on',
          target: 'task',
          timestamp: now - 1000 * 60 * 40,
          timestampLabel: formatRelative(now - 1000 * 60 * 40),
        },
      ],
      [epicId]: [
        {
          id: 'act-3',
          taskId: epicId,
          actor: 'Alex Rivera',
          action: 'pinned',
          target: 'task',
          timestamp: now - 1000 * 60 * 35,
          timestampLabel: formatRelative(now - 1000 * 60 * 35),
        },
      ],
    },
    history: {
      [parentId]: [
        {
          id: 'hist-1',
          taskId: parentId,
          field: 'status',
          fromValue: 'In Progress',
          toValue: 'In Review',
          actor: 'Sam Chen',
          timestamp: now - 1000 * 60 * 90,
          timestampLabel: formatRelative(now - 1000 * 60 * 90),
        },
        {
          id: 'hist-2',
          taskId: parentId,
          field: 'priority',
          fromValue: 'High',
          toValue: 'Critical',
          actor: 'Alex Rivera',
          timestamp: now - day * 2,
          timestampLabel: formatRelative(now - day * 2),
        },
      ],
    },
  };
};

const readRepo = (workspaceId: string): TaskRepositoryState => {
  try {
    const raw = globalThis.localStorage?.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded = seedTasks(workspaceId);
      writeRepo(workspaceId, seeded);
      return seeded;
    }
    const parsed = JSON.parse(raw) as Record<string, TaskRepositoryState>;
    const existing = parsed[workspaceId];
    if (existing) {
      return existing;
    }
    const seeded = seedTasks(workspaceId);
    parsed[workspaceId] = seeded;
    globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(parsed));
    return seeded;
  } catch {
    return seedTasks(workspaceId);
  }
};

const writeRepo = (workspaceId: string, state: TaskRepositoryState): void => {
  try {
    const raw = globalThis.localStorage?.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as Record<string, TaskRepositoryState>) : {};
    parsed[workspaceId] = state;
    globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(parsed));
  } catch {
    // ignore
  }
};

const syncChecklistCounts = (task: Task, items: readonly TaskChecklistItem[]): Task => {
  const total = items.length;
  const completed = items.filter((item) => item.completed).length;
  return { ...task, checklistTotal: total, checklistCompleted: completed };
};

const syncSubtaskCounts = (repo: TaskRepositoryState, parentId: string): void => {
  const children = repo.tasks.filter((task) => task.parentTaskId === parentId);
  const completed = children.filter(
    (task) => task.status === 'completed' || task.status === 'archived',
  ).length;
  const index = repo.tasks.findIndex((task) => task.id === parentId);
  if (index >= 0) {
    const parent = repo.tasks[index]!;
    repo.tasks[index] = {
      ...parent,
      subtaskCount: children.length,
      subtaskCompleted: completed,
    };
  }
};

export interface TaskService {
  listTasks(workspaceId: string): Promise<Task[]>;
  getTask(workspaceId: string, id: string): Promise<Task | null>;
  createTask(input: CreateTaskInput): Promise<Task>;
  updateTask(workspaceId: string, id: string, input: UpdateTaskInput): Promise<Task>;
  archiveTask(workspaceId: string, id: string): Promise<Task>;
  restoreTask(workspaceId: string, id: string): Promise<Task>;
  deleteTask(workspaceId: string, id: string): Promise<void>;
  duplicateTask(workspaceId: string, id: string): Promise<Task>;
  copyTask(workspaceId: string, id: string, projectId?: string): Promise<Task>;
  moveTask(workspaceId: string, id: string, input: MoveTaskInput): Promise<Task>;
  toggleFavorite(workspaceId: string, id: string): Promise<Task>;
  togglePinned(workspaceId: string, id: string): Promise<Task>;
  bulkUpdate(
    workspaceId: string,
    ids: readonly string[],
    input: BulkTaskUpdateInput,
  ): Promise<Task[]>;
  listSubtasks(workspaceId: string, parentId: string): Promise<Task[]>;
  listChecklist(workspaceId: string, taskId: string): Promise<TaskChecklistItem[]>;
  addChecklistItem(workspaceId: string, taskId: string, title: string): Promise<TaskChecklistItem>;
  updateChecklistItem(
    workspaceId: string,
    taskId: string,
    itemId: string,
    patch: Partial<Pick<TaskChecklistItem, 'title' | 'completed' | 'orderIndex'>>,
  ): Promise<TaskChecklistItem>;
  deleteChecklistItem(workspaceId: string, taskId: string, itemId: string): Promise<void>;
  reorderChecklist(
    workspaceId: string,
    taskId: string,
    orderedIds: readonly string[],
  ): Promise<TaskChecklistItem[]>;
  listComments(workspaceId: string, taskId: string): Promise<TaskComment[]>;
  addComment(
    workspaceId: string,
    taskId: string,
    body: string,
    parentId?: string | null,
  ): Promise<TaskComment>;
  updateComment(
    workspaceId: string,
    taskId: string,
    commentId: string,
    body: string,
  ): Promise<TaskComment>;
  deleteComment(workspaceId: string, taskId: string, commentId: string): Promise<void>;
  listAttachments(workspaceId: string, taskId: string): Promise<TaskAttachment[]>;
  deleteAttachmentPlaceholder(
    workspaceId: string,
    taskId: string,
    attachmentId: string,
  ): Promise<void>;
  listDependencies(workspaceId: string, taskId: string): Promise<TaskDependency[]>;
  listActivity(workspaceId: string, taskId: string): Promise<TaskActivityItem[]>;
  listHistory(workspaceId: string, taskId: string): Promise<TaskHistoryItem[]>;
  getPreferences(): Promise<TaskPreferences>;
  updatePreferences(prefs: Partial<TaskPreferences>): Promise<TaskPreferences>;
  listPeople(): Promise<readonly TaskPerson[]>;
  listProjects(): Promise<readonly { id: string; name: string }[]>;
  listLabelCatalog(): Promise<readonly TaskLabel[]>;
}

export class InMemoryTaskService implements TaskService {
  async listTasks(workspaceId: string): Promise<Task[]> {
    await delay();
    return [...readRepo(workspaceId).tasks].sort((a, b) => a.orderIndex - b.orderIndex);
  }

  async getTask(workspaceId: string, id: string): Promise<Task | null> {
    await delay(120);
    return readRepo(workspaceId).tasks.find((task) => task.id === id) ?? null;
  }

  async createTask(input: CreateTaskInput): Promise<Task> {
    await delay();
    const repo = readRepo(input.workspaceId);
    const now = Date.now();
    const parent = input.parentTaskId
      ? repo.tasks.find((task) => task.id === input.parentTaskId)
      : null;
    const task: Task = {
      id: createId('task'),
      workspaceId: input.workspaceId,
      projectId: input.projectId,
      projectName: resolveProjectName(input.projectId),
      parentTaskId: input.parentTaskId ?? null,
      title: input.title.trim(),
      description: input.description?.trim() ?? '',
      status: input.status ?? 'todo',
      priority: input.priority ?? 'medium',
      type: input.type ?? 'task',
      assignee: resolvePerson(input.assigneeId),
      reporter: DEFAULT_TASK_PERSON,
      startDate: input.startDate ?? null,
      dueDate: input.dueDate ?? null,
      completedDate: null,
      estimatedMinutes: input.estimatedMinutes ?? null,
      actualMinutes: null,
      position: repo.tasks.length,
      orderIndex: repo.tasks.length,
      labels: input.labels ? [...input.labels] : [],
      tags: input.tags ? [...input.tags] : [],
      attachmentCount: 0,
      commentCount: 0,
      checklistTotal: 0,
      checklistCompleted: 0,
      dependencyCount: 0,
      watcherIds: [DEFAULT_TASK_PERSON.id],
      subtaskCount: 0,
      subtaskCompleted: 0,
      isFavorite: false,
      isPinned: false,
      depth: parent ? parent.depth + 1 : 0,
      createdAt: now,
      updatedAt: now,
      archivedAt: null,
    };
    repo.tasks = [task, ...repo.tasks];
    repo.checklists[task.id] = [];
    repo.comments[task.id] = [];
    repo.attachments[task.id] = [];
    repo.dependencies[task.id] = [];
    repo.activity[task.id] = [
      {
        id: createId('act'),
        taskId: task.id,
        actor: DEFAULT_TASK_PERSON.fullName,
        action: 'created',
        target: 'task',
        timestamp: now,
        timestampLabel: 'just now',
      },
    ];
    repo.history[task.id] = [];
    if (parent) {
      syncSubtaskCounts(repo, parent.id);
    }
    writeRepo(input.workspaceId, repo);
    return task;
  }

  async updateTask(workspaceId: string, id: string, input: UpdateTaskInput): Promise<Task> {
    await delay();
    const repo = readRepo(workspaceId);
    const index = repo.tasks.findIndex((task) => task.id === id);
    if (index < 0) {
      throw new Error('Task not found.');
    }
    const current = repo.tasks[index]!;
    const nextStatus = input.status ?? current.status;
    const updated: Task = {
      ...current,
      title: input.title?.trim() ?? current.title,
      description: input.description !== undefined ? input.description.trim() : current.description,
      status: nextStatus,
      priority: input.priority ?? current.priority,
      type: input.type ?? current.type,
      projectId: input.projectId ?? current.projectId,
      projectName: input.projectId ? resolveProjectName(input.projectId) : current.projectName,
      parentTaskId: input.parentTaskId !== undefined ? input.parentTaskId : current.parentTaskId,
      assignee: input.assigneeId !== undefined ? resolvePerson(input.assigneeId) : current.assignee,
      startDate: input.startDate !== undefined ? input.startDate : current.startDate,
      dueDate: input.dueDate !== undefined ? input.dueDate : current.dueDate,
      estimatedMinutes:
        input.estimatedMinutes !== undefined ? input.estimatedMinutes : current.estimatedMinutes,
      actualMinutes:
        input.actualMinutes !== undefined ? input.actualMinutes : current.actualMinutes,
      labels: input.labels ? [...input.labels] : current.labels,
      tags: input.tags ? [...input.tags] : current.tags,
      position: input.position ?? current.position,
      orderIndex: input.orderIndex ?? current.orderIndex,
      completedDate:
        nextStatus === 'completed'
          ? (current.completedDate ?? Date.now())
          : nextStatus === 'archived'
            ? current.completedDate
            : null,
      updatedAt: Date.now(),
    };
    repo.tasks[index] = updated;
    const history = [...(repo.history[id] ?? [])];
    if (input.status && input.status !== current.status) {
      history.unshift({
        id: createId('hist'),
        taskId: id,
        field: 'status',
        fromValue: current.status,
        toValue: input.status,
        actor: DEFAULT_TASK_PERSON.fullName,
        timestamp: Date.now(),
        timestampLabel: 'just now',
      });
    }
    repo.history[id] = history;
    if (updated.parentTaskId) {
      syncSubtaskCounts(repo, updated.parentTaskId);
    }
    if (current.parentTaskId && current.parentTaskId !== updated.parentTaskId) {
      syncSubtaskCounts(repo, current.parentTaskId);
    }
    writeRepo(workspaceId, repo);
    return updated;
  }

  async archiveTask(workspaceId: string, id: string): Promise<Task> {
    return this.updateTask(workspaceId, id, { status: 'archived' }).then(async (task) => {
      const repo = readRepo(workspaceId);
      const index = repo.tasks.findIndex((item) => item.id === id);
      if (index >= 0) {
        repo.tasks[index] = { ...task, archivedAt: Date.now(), status: 'archived' };
        writeRepo(workspaceId, repo);
        return repo.tasks[index]!;
      }
      return task;
    });
  }

  async restoreTask(workspaceId: string, id: string): Promise<Task> {
    await delay();
    const repo = readRepo(workspaceId);
    const index = repo.tasks.findIndex((task) => task.id === id);
    if (index < 0) {
      throw new Error('Task not found.');
    }
    const restored: Task = {
      ...repo.tasks[index]!,
      status: 'todo',
      archivedAt: null,
      updatedAt: Date.now(),
    };
    repo.tasks[index] = restored;
    writeRepo(workspaceId, repo);
    return restored;
  }

  async deleteTask(workspaceId: string, id: string): Promise<void> {
    await delay();
    const repo = readRepo(workspaceId);
    const target = repo.tasks.find((task) => task.id === id);
    repo.tasks = repo.tasks.filter((task) => task.id !== id && task.parentTaskId !== id);
    delete repo.checklists[id];
    delete repo.comments[id];
    delete repo.attachments[id];
    delete repo.dependencies[id];
    delete repo.activity[id];
    delete repo.history[id];
    if (target?.parentTaskId) {
      syncSubtaskCounts(repo, target.parentTaskId);
    }
    writeRepo(workspaceId, repo);
  }

  async duplicateTask(workspaceId: string, id: string): Promise<Task> {
    const original = await this.getTask(workspaceId, id);
    if (!original) {
      throw new Error('Task not found.');
    }
    return this.createTask({
      workspaceId,
      projectId: original.projectId,
      parentTaskId: original.parentTaskId,
      title: `${original.title} (copy)`,
      description: original.description,
      status: original.status === 'archived' ? 'todo' : original.status,
      priority: original.priority,
      type: original.type,
      assigneeId: original.assignee?.id ?? null,
      startDate: original.startDate,
      dueDate: original.dueDate,
      estimatedMinutes: original.estimatedMinutes,
      labels: original.labels,
      tags: original.tags,
    });
  }

  async copyTask(workspaceId: string, id: string, projectId?: string): Promise<Task> {
    const original = await this.getTask(workspaceId, id);
    if (!original) {
      throw new Error('Task not found.');
    }
    return this.createTask({
      workspaceId,
      projectId: projectId ?? original.projectId,
      parentTaskId: null,
      title: `${original.title} (copy)`,
      description: original.description,
      status: 'todo',
      priority: original.priority,
      type: original.type,
      assigneeId: original.assignee?.id ?? null,
      labels: original.labels,
      tags: original.tags,
    });
  }

  async moveTask(workspaceId: string, id: string, input: MoveTaskInput): Promise<Task> {
    return this.updateTask(workspaceId, id, {
      projectId: input.projectId,
      parentTaskId: input.parentTaskId,
      status: input.status,
      position: input.position,
      orderIndex: input.orderIndex,
    });
  }

  async toggleFavorite(workspaceId: string, id: string): Promise<Task> {
    await delay(80);
    const repo = readRepo(workspaceId);
    const index = repo.tasks.findIndex((task) => task.id === id);
    if (index < 0) {
      throw new Error('Task not found.');
    }
    const updated = {
      ...repo.tasks[index]!,
      isFavorite: !repo.tasks[index]!.isFavorite,
      updatedAt: Date.now(),
    };
    repo.tasks[index] = updated;
    writeRepo(workspaceId, repo);
    return updated;
  }

  async togglePinned(workspaceId: string, id: string): Promise<Task> {
    await delay(80);
    const repo = readRepo(workspaceId);
    const index = repo.tasks.findIndex((task) => task.id === id);
    if (index < 0) {
      throw new Error('Task not found.');
    }
    const updated = {
      ...repo.tasks[index]!,
      isPinned: !repo.tasks[index]!.isPinned,
      updatedAt: Date.now(),
    };
    repo.tasks[index] = updated;
    writeRepo(workspaceId, repo);
    return updated;
  }

  async bulkUpdate(
    workspaceId: string,
    ids: readonly string[],
    input: BulkTaskUpdateInput,
  ): Promise<Task[]> {
    await delay(240);
    if (input.delete) {
      for (const id of ids) {
        await this.deleteTask(workspaceId, id);
      }
      return [];
    }
    const results: Task[] = [];
    for (const id of ids) {
      if (input.archive) {
        results.push(await this.archiveTask(workspaceId, id));
        continue;
      }
      results.push(
        await this.updateTask(workspaceId, id, {
          status: input.status,
          priority: input.priority,
          assigneeId: input.assigneeId,
          projectId: input.projectId,
          labels: input.labels,
        }),
      );
    }
    return results;
  }

  async listSubtasks(workspaceId: string, parentId: string): Promise<Task[]> {
    await delay(80);
    return readRepo(workspaceId)
      .tasks.filter((task) => task.parentTaskId === parentId)
      .sort((a, b) => a.orderIndex - b.orderIndex);
  }

  async listChecklist(workspaceId: string, taskId: string): Promise<TaskChecklistItem[]> {
    await delay(60);
    return [...(readRepo(workspaceId).checklists[taskId] ?? [])].sort(
      (a, b) => a.orderIndex - b.orderIndex,
    );
  }

  async addChecklistItem(
    workspaceId: string,
    taskId: string,
    title: string,
  ): Promise<TaskChecklistItem> {
    await delay(80);
    const repo = readRepo(workspaceId);
    const items = [...(repo.checklists[taskId] ?? [])];
    const item: TaskChecklistItem = {
      id: createId('chk'),
      title: title.trim(),
      completed: false,
      orderIndex: items.length,
    };
    items.push(item);
    repo.checklists[taskId] = items;
    const index = repo.tasks.findIndex((task) => task.id === taskId);
    if (index >= 0) {
      repo.tasks[index] = syncChecklistCounts(repo.tasks[index]!, items);
    }
    writeRepo(workspaceId, repo);
    return item;
  }

  async updateChecklistItem(
    workspaceId: string,
    taskId: string,
    itemId: string,
    patch: Partial<Pick<TaskChecklistItem, 'title' | 'completed' | 'orderIndex'>>,
  ): Promise<TaskChecklistItem> {
    await delay(60);
    const repo = readRepo(workspaceId);
    const items = [...(repo.checklists[taskId] ?? [])];
    const index = items.findIndex((item) => item.id === itemId);
    if (index < 0) {
      throw new Error('Checklist item not found.');
    }
    const updated = { ...items[index]!, ...patch };
    items[index] = updated;
    repo.checklists[taskId] = items;
    const taskIndex = repo.tasks.findIndex((task) => task.id === taskId);
    if (taskIndex >= 0) {
      repo.tasks[taskIndex] = syncChecklistCounts(repo.tasks[taskIndex]!, items);
    }
    writeRepo(workspaceId, repo);
    return updated;
  }

  async deleteChecklistItem(workspaceId: string, taskId: string, itemId: string): Promise<void> {
    await delay(60);
    const repo = readRepo(workspaceId);
    const items = (repo.checklists[taskId] ?? []).filter((item) => item.id !== itemId);
    repo.checklists[taskId] = items.map((item, orderIndex) => ({ ...item, orderIndex }));
    const taskIndex = repo.tasks.findIndex((task) => task.id === taskId);
    if (taskIndex >= 0) {
      repo.tasks[taskIndex] = syncChecklistCounts(repo.tasks[taskIndex]!, repo.checklists[taskId]!);
    }
    writeRepo(workspaceId, repo);
  }

  async reorderChecklist(
    workspaceId: string,
    taskId: string,
    orderedIds: readonly string[],
  ): Promise<TaskChecklistItem[]> {
    await delay(60);
    const repo = readRepo(workspaceId);
    const map = new Map((repo.checklists[taskId] ?? []).map((item) => [item.id, item]));
    const items = orderedIds
      .map((id, orderIndex) => {
        const item = map.get(id);
        return item ? { ...item, orderIndex } : null;
      })
      .filter((item): item is TaskChecklistItem => item !== null);
    repo.checklists[taskId] = items;
    writeRepo(workspaceId, repo);
    return items;
  }

  async listComments(workspaceId: string, taskId: string): Promise<TaskComment[]> {
    await delay(60);
    return [...(readRepo(workspaceId).comments[taskId] ?? [])].sort(
      (a, b) => a.createdAt - b.createdAt,
    );
  }

  async addComment(
    workspaceId: string,
    taskId: string,
    body: string,
    parentId: string | null = null,
  ): Promise<TaskComment> {
    await delay(80);
    const repo = readRepo(workspaceId);
    const now = Date.now();
    const comment: TaskComment = {
      id: createId('cmt'),
      taskId,
      author: DEFAULT_TASK_PERSON,
      body: body.trim(),
      parentId,
      createdAt: now,
      updatedAt: now,
      reactionsPlaceholder: [],
    };
    repo.comments[taskId] = [...(repo.comments[taskId] ?? []), comment];
    const index = repo.tasks.findIndex((task) => task.id === taskId);
    if (index >= 0) {
      repo.tasks[index] = {
        ...repo.tasks[index]!,
        commentCount: repo.comments[taskId]!.length,
        updatedAt: now,
      };
    }
    writeRepo(workspaceId, repo);
    return comment;
  }

  async updateComment(
    workspaceId: string,
    taskId: string,
    commentId: string,
    body: string,
  ): Promise<TaskComment> {
    await delay(60);
    const repo = readRepo(workspaceId);
    const comments = [...(repo.comments[taskId] ?? [])];
    const index = comments.findIndex((comment) => comment.id === commentId);
    if (index < 0) {
      throw new Error('Comment not found.');
    }
    const updated = { ...comments[index]!, body: body.trim(), updatedAt: Date.now() };
    comments[index] = updated;
    repo.comments[taskId] = comments;
    writeRepo(workspaceId, repo);
    return updated;
  }

  async deleteComment(workspaceId: string, taskId: string, commentId: string): Promise<void> {
    await delay(60);
    const repo = readRepo(workspaceId);
    repo.comments[taskId] = (repo.comments[taskId] ?? []).filter(
      (comment) => comment.id !== commentId && comment.parentId !== commentId,
    );
    const index = repo.tasks.findIndex((task) => task.id === taskId);
    if (index >= 0) {
      repo.tasks[index] = {
        ...repo.tasks[index]!,
        commentCount: repo.comments[taskId]!.length,
        updatedAt: Date.now(),
      };
    }
    writeRepo(workspaceId, repo);
  }

  async listAttachments(workspaceId: string, taskId: string): Promise<TaskAttachment[]> {
    await delay(60);
    return [...(readRepo(workspaceId).attachments[taskId] ?? [])];
  }

  async deleteAttachmentPlaceholder(
    workspaceId: string,
    taskId: string,
    attachmentId: string,
  ): Promise<void> {
    await delay(60);
    const repo = readRepo(workspaceId);
    repo.attachments[taskId] = (repo.attachments[taskId] ?? []).filter(
      (item) => item.id !== attachmentId,
    );
    const index = repo.tasks.findIndex((task) => task.id === taskId);
    if (index >= 0) {
      repo.tasks[index] = {
        ...repo.tasks[index]!,
        attachmentCount: repo.attachments[taskId]!.length,
        updatedAt: Date.now(),
      };
    }
    writeRepo(workspaceId, repo);
  }

  async listDependencies(workspaceId: string, taskId: string): Promise<TaskDependency[]> {
    await delay(60);
    return [...(readRepo(workspaceId).dependencies[taskId] ?? [])];
  }

  async listActivity(workspaceId: string, taskId: string): Promise<TaskActivityItem[]> {
    await delay(60);
    return [...(readRepo(workspaceId).activity[taskId] ?? [])];
  }

  async listHistory(workspaceId: string, taskId: string): Promise<TaskHistoryItem[]> {
    await delay(60);
    return [...(readRepo(workspaceId).history[taskId] ?? [])];
  }

  async getPreferences(): Promise<TaskPreferences> {
    await delay(40);
    return readPreferences();
  }

  async updatePreferences(prefs: Partial<TaskPreferences>): Promise<TaskPreferences> {
    await delay(40);
    const next = { ...readPreferences(), ...prefs };
    writePreferences(next);
    return next;
  }

  async listPeople(): Promise<readonly TaskPerson[]> {
    await delay(40);
    return PEOPLE;
  }

  async listProjects(): Promise<readonly { id: string; name: string }[]> {
    await delay(40);
    return PROJECTS;
  }

  async listLabelCatalog(): Promise<readonly TaskLabel[]> {
    await delay(40);
    return LABELS;
  }
}

export const createTaskService = (): TaskService => new InMemoryTaskService();

/** @deprecated Prefer createTaskService — exposed for tests that need a clean repo. */
export const __resetTaskStorageForTests = (): void => {
  try {
    globalThis.localStorage?.removeItem(STORAGE_KEY);
    globalThis.localStorage?.removeItem(PREFS_KEY);
  } catch {
    // ignore
  }
  void emptyRepo;
};

export const formatTaskDueDate = (dueDate: number | null): string => {
  if (dueDate == null) {
    return 'No due date';
  }
  return new Date(dueDate).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
};

export const checklistProgress = (completed: number, total: number): number => {
  if (total <= 0) {
    return 0;
  }
  return Math.round((completed / total) * 100);
};
