export const TASK_ROUTES = {
  list: '/tasks',
  create: '/tasks/new',
  detail: '/tasks/:id',
  edit: '/tasks/:id/edit',
  history: '/tasks/:id/history',
} as const;

export const taskDetailPath = (id: string): string => `/tasks/${id}`;
export const taskEditPath = (id: string): string => `/tasks/${id}/edit`;
export const taskHistoryPath = (id: string): string => `/tasks/${id}/history`;

export const TASK_STATUSES = [
  'backlog',
  'todo',
  'in_progress',
  'in_review',
  'blocked',
  'completed',
  'cancelled',
  'archived',
] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_PRIORITIES = ['critical', 'high', 'medium', 'low', 'none'] as const;

export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export const TASK_TYPES = [
  'task',
  'bug',
  'feature',
  'improvement',
  'epic',
  'story',
  'research',
  'documentation',
  'chore',
] as const;

export type TaskType = (typeof TASK_TYPES)[number];

export const TASK_DEPENDENCY_TYPES = [
  'blocks',
  'blocked_by',
  'related',
  'duplicate',
  'parent',
  'child',
] as const;

export type TaskDependencyType = (typeof TASK_DEPENDENCY_TYPES)[number];

export type TaskViewMode = 'table' | 'compact' | 'grouped';

export type TaskSortKey =
  'updated' | 'title' | 'status' | 'priority' | 'due' | 'favorites' | 'pinned';

export type TaskGroupBy = 'none' | 'status' | 'priority' | 'project' | 'assignee';

export type TaskFilterPreset = 'all' | 'favorites' | 'pinned' | 'archived' | 'completed' | 'mine';

export interface TaskPerson {
  readonly id: string;
  readonly fullName: string;
  readonly email: string;
  readonly avatarUrl?: string;
}

export interface TaskLabel {
  readonly id: string;
  readonly name: string;
  readonly color: string;
}

export interface TaskChecklistItem {
  readonly id: string;
  readonly title: string;
  readonly completed: boolean;
  readonly orderIndex: number;
}

export interface TaskComment {
  readonly id: string;
  readonly taskId: string;
  readonly author: TaskPerson;
  readonly body: string;
  readonly parentId: string | null;
  readonly createdAt: number;
  readonly updatedAt: number;
  readonly reactionsPlaceholder: readonly string[];
}

export interface TaskAttachment {
  readonly id: string;
  readonly taskId: string;
  readonly name: string;
  readonly mimeType: string;
  readonly sizeLabel: string;
  readonly kind: 'file' | 'image' | 'link';
  readonly previewPlaceholder: boolean;
  readonly createdAt: number;
}

export interface TaskDependency {
  readonly id: string;
  readonly taskId: string;
  readonly relatedTaskId: string;
  readonly relatedTitle: string;
  readonly type: TaskDependencyType;
}

export interface TaskActivityItem {
  readonly id: string;
  readonly taskId: string;
  readonly actor: string;
  readonly action: string;
  readonly target: string;
  readonly timestamp: number;
  readonly timestampLabel: string;
}

export interface TaskHistoryItem {
  readonly id: string;
  readonly taskId: string;
  readonly field: string;
  readonly fromValue: string;
  readonly toValue: string;
  readonly actor: string;
  readonly timestamp: number;
  readonly timestampLabel: string;
}

/**
 * Core Task domain entity — single source of truth for Kanban, Calendar, Analytics, AI, etc.
 */
export interface Task {
  readonly id: string;
  readonly workspaceId: string;
  readonly projectId: string;
  readonly projectName: string;
  readonly parentTaskId: string | null;
  readonly title: string;
  readonly description: string;
  readonly status: TaskStatus;
  readonly priority: TaskPriority;
  readonly type: TaskType;
  readonly assignee: TaskPerson | null;
  readonly reporter: TaskPerson;
  readonly startDate: number | null;
  readonly dueDate: number | null;
  readonly completedDate: number | null;
  readonly estimatedMinutes: number | null;
  readonly actualMinutes: number | null;
  readonly position: number;
  readonly orderIndex: number;
  readonly labels: readonly TaskLabel[];
  readonly tags: readonly string[];
  readonly attachmentCount: number;
  readonly commentCount: number;
  readonly checklistTotal: number;
  readonly checklistCompleted: number;
  readonly dependencyCount: number;
  readonly watcherIds: readonly string[];
  readonly subtaskCount: number;
  readonly subtaskCompleted: number;
  readonly isFavorite: boolean;
  readonly isPinned: boolean;
  readonly depth: number;
  readonly createdAt: number;
  readonly updatedAt: number;
  readonly archivedAt: number | null;
}

export interface CreateTaskInput {
  readonly workspaceId: string;
  readonly projectId: string;
  readonly parentTaskId?: string | null;
  readonly title: string;
  readonly description?: string;
  readonly status?: TaskStatus;
  readonly priority?: TaskPriority;
  readonly type?: TaskType;
  readonly assigneeId?: string | null;
  readonly startDate?: number | null;
  readonly dueDate?: number | null;
  readonly estimatedMinutes?: number | null;
  readonly labels?: readonly TaskLabel[];
  readonly tags?: readonly string[];
}

export interface UpdateTaskInput {
  readonly title?: string;
  readonly description?: string;
  readonly status?: TaskStatus;
  readonly priority?: TaskPriority;
  readonly type?: TaskType;
  readonly projectId?: string;
  readonly parentTaskId?: string | null;
  readonly assigneeId?: string | null;
  readonly startDate?: number | null;
  readonly dueDate?: number | null;
  readonly estimatedMinutes?: number | null;
  readonly actualMinutes?: number | null;
  readonly labels?: readonly TaskLabel[];
  readonly tags?: readonly string[];
  readonly position?: number;
  readonly orderIndex?: number;
}

export interface MoveTaskInput {
  readonly projectId?: string;
  readonly parentTaskId?: string | null;
  readonly status?: TaskStatus;
  readonly position?: number;
  readonly orderIndex?: number;
}

export interface BulkTaskUpdateInput {
  readonly status?: TaskStatus;
  readonly priority?: TaskPriority;
  readonly assigneeId?: string | null;
  readonly projectId?: string;
  readonly labels?: readonly TaskLabel[];
  readonly archive?: boolean;
  readonly delete?: boolean;
}

export interface TaskFiltersState {
  readonly query: string;
  readonly sort: TaskSortKey;
  readonly preset: TaskFilterPreset;
  readonly view: TaskViewMode;
  readonly groupBy: TaskGroupBy;
  readonly statuses: readonly TaskStatus[];
  readonly priorities: readonly TaskPriority[];
  readonly projectIds: readonly string[];
  readonly assigneeIds: readonly string[];
  readonly labels: readonly string[];
  readonly tags: readonly string[];
  readonly dateFrom: number | null;
  readonly dateTo: number | null;
  readonly page: number;
  readonly pageSize: number;
}

export interface TaskPreferences {
  readonly defaultView: TaskViewMode;
  readonly defaultGroupBy: TaskGroupBy;
  readonly showCompleted: boolean;
  readonly showArchivedByDefault: boolean;
  readonly denseList: boolean;
  readonly pageSize: number;
}

export interface TaskListPageResult {
  readonly items: readonly Task[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
  readonly hasMore: boolean;
}
