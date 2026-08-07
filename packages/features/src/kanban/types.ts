import type { TaskPriority, TaskStatus } from '@features/task/types';

export const KANBAN_ROUTES = {
  list: '/kanban',
  create: '/kanban/new',
  board: '/kanban/:boardId',
  settings: '/kanban/:boardId/settings',
  overview: '/kanban/:boardId/overview',
} as const;

export const kanbanBoardPath = (boardId: string): string => `/kanban/${boardId}`;
export const kanbanSettingsPath = (boardId: string): string => `/kanban/${boardId}/settings`;
export const kanbanOverviewPath = (boardId: string): string => `/kanban/${boardId}/overview`;

export const COLUMN_WIDTH_PRESETS = {
  compact: 280,
  default: 300,
  comfortable: 340,
} as const;

export type ColumnWidthPreset = keyof typeof COLUMN_WIDTH_PRESETS;

export const SWIMLANE_MODES = [
  'none',
  'assignee',
  'priority',
  'label',
  'status',
  'custom',
] as const;

export type SwimlaneMode = (typeof SWIMLANE_MODES)[number];

export const BOARD_TEMPLATES = ['software_delivery', 'bug_triage', 'content', 'blank'] as const;

export type BoardTemplateId = (typeof BOARD_TEMPLATES)[number];

/** Canonical default workflow columns from KANBAN_BOARD.md §10 */
export const DEFAULT_COLUMN_DEFS = [
  {
    key: 'backlog',
    name: 'Backlog',
    mappedStatus: 'backlog' as TaskStatus,
    description: 'Captured work not yet committed for execution.',
    system: true,
  },
  {
    key: 'todo',
    name: 'To Do',
    mappedStatus: 'todo' as TaskStatus,
    description: 'Ready work selected for execution.',
    system: true,
  },
  {
    key: 'in_progress',
    name: 'In Progress',
    mappedStatus: 'in_progress' as TaskStatus,
    description: 'Work actively being implemented.',
    system: true,
  },
  {
    key: 'review',
    name: 'Review',
    mappedStatus: 'in_review' as TaskStatus,
    description: 'Work awaiting peer, product, or code review.',
    system: true,
  },
  {
    key: 'testing',
    name: 'Testing',
    mappedStatus: 'in_review' as TaskStatus,
    description: 'Work being verified.',
    system: false,
  },
  {
    key: 'done',
    name: 'Done',
    mappedStatus: 'completed' as TaskStatus,
    description: 'Completed work.',
    system: true,
  },
  {
    key: 'blocked',
    name: 'Blocked',
    mappedStatus: 'blocked' as TaskStatus,
    description: 'Work unable to progress because of a dependency or issue.',
    system: true,
  },
  {
    key: 'waiting',
    name: 'Waiting',
    mappedStatus: 'blocked' as TaskStatus,
    description: 'Work waiting on external response or event.',
    system: false,
  },
  {
    key: 'archived',
    name: 'Archived',
    mappedStatus: 'archived' as TaskStatus,
    description: 'Historical completed/cancelled work, hidden by default.',
    system: true,
    hiddenByDefault: true,
  },
] as const;

export interface KanbanBoard {
  readonly id: string;
  readonly workspaceId: string;
  readonly projectId: string;
  readonly projectName: string;
  readonly name: string;
  readonly description: string;
  readonly templateId: BoardTemplateId;
  readonly isFavorite: boolean;
  readonly isPinned: boolean;
  readonly archivedAt: number | null;
  readonly createdAt: number;
  readonly updatedAt: number;
}

export interface KanbanColumn {
  readonly id: string;
  readonly boardId: string;
  readonly key: string;
  readonly name: string;
  readonly description: string;
  readonly mappedStatus: TaskStatus;
  readonly orderIndex: number;
  readonly wipLimit: number | null;
  readonly widthPreset: ColumnWidthPreset;
  readonly collapsed: boolean;
  readonly isSystem: boolean;
  readonly isArchived: boolean;
  readonly color?: string;
}

export interface KanbanSwimlane {
  readonly id: string;
  readonly boardId: string;
  readonly key: string;
  readonly label: string;
  readonly mode: SwimlaneMode;
  readonly orderIndex: number;
  readonly collapsed: boolean;
}

/**
 * Card placement on the board. Task payload always comes from Task Engine.
 */
export interface KanbanCardPlacement {
  readonly id: string;
  readonly boardId: string;
  readonly taskId: string;
  readonly columnId: string;
  readonly swimlaneId: string | null;
  readonly orderIndex: number;
}

export interface KanbanMovePayload {
  readonly taskIds: readonly string[];
  readonly sourceColumnId: string;
  readonly destinationColumnId: string;
  readonly destinationSwimlaneId: string | null;
  readonly destinationIndex: number;
}

export interface KanbanFiltersState {
  readonly query: string;
  readonly statuses: readonly TaskStatus[];
  readonly priorities: readonly TaskPriority[];
  readonly assigneeIds: readonly string[];
  readonly projectIds: readonly string[];
  readonly labels: readonly string[];
  readonly tags: readonly string[];
  readonly favoritesOnly: boolean;
  readonly pinnedOnly: boolean;
  readonly completedOnly: boolean;
  readonly archivedOnly: boolean;
  readonly blockedOnly: boolean;
  readonly dueFrom: number | null;
  readonly dueTo: number | null;
}

export interface KanbanSavedFilter {
  readonly id: string;
  readonly name: string;
  readonly filters: KanbanFiltersState;
  readonly shared: boolean;
}

export interface KanbanPreferences {
  readonly columnWidth: ColumnWidthPreset;
  readonly showStatistics: boolean;
  readonly showArchivedColumn: boolean;
  readonly swimlaneMode: SwimlaneMode;
  readonly cardDensity: 'compact' | 'comfortable';
  readonly autoScroll: boolean;
  readonly announceMoves: boolean;
}

export interface KanbanLayoutState {
  readonly focusedTaskId: string | null;
  readonly focusedColumnId: string | null;
  readonly detailTaskId: string | null;
  readonly showDetailPanel: boolean;
  readonly boardScrollLeft: number;
}

export interface KanbanDragState {
  readonly activeTaskIds: readonly string[];
  readonly activeColumnId: string | null;
  readonly overColumnId: string | null;
  readonly overIndex: number | null;
  readonly overSwimlaneId: string | null;
  readonly mode: 'pointer' | 'keyboard' | null;
  readonly isDragging: boolean;
  readonly announcement: string | null;
}

export interface KanbanBoardStatistics {
  readonly tasksPerColumn: Readonly<Record<string, number>>;
  readonly completionRate: number;
  readonly blockedCount: number;
  readonly overdueCount: number;
  readonly totalVisible: number;
}

export interface CreateBoardInput {
  readonly workspaceId: string;
  readonly projectId: string;
  readonly name: string;
  readonly description?: string;
  readonly templateId?: BoardTemplateId;
}

export interface UpdateBoardInput {
  readonly name?: string;
  readonly description?: string;
}

export interface CreateColumnInput {
  readonly boardId: string;
  readonly name: string;
  readonly mappedStatus: TaskStatus;
  readonly description?: string;
  readonly wipLimit?: number | null;
}

export interface UpdateColumnInput {
  readonly name?: string;
  readonly description?: string;
  readonly mappedStatus?: TaskStatus;
  readonly wipLimit?: number | null;
  readonly widthPreset?: ColumnWidthPreset;
  readonly collapsed?: boolean;
  readonly color?: string;
}

export interface PersistenceAdapter {
  readonly kind: 'local' | 'sqlite' | 'supabase';
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}
