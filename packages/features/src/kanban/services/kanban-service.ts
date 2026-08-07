import { DEFAULT_KANBAN_PREFERENCES } from '@features/kanban/constants';
import {
  createLocalPersistence,
  type PersistenceAdapter,
} from '@features/kanban/services/persistence';
import { DEFAULT_COLUMN_DEFS } from '@features/kanban/types';
import type {
  CreateBoardInput,
  CreateColumnInput,
  KanbanBoard,
  KanbanBoardStatistics,
  KanbanCardPlacement,
  KanbanColumn,
  KanbanFiltersState,
  KanbanMovePayload,
  KanbanPreferences,
  KanbanSavedFilter,
  KanbanSwimlane,
  UpdateBoardInput,
  UpdateColumnInput,
} from '@features/kanban/types';
import { createTaskService } from '@features/task/services/task-service';
import type { Task, TaskStatus } from '@features/task/types';

const STORAGE_KEY = 'primordial-kanban-v1';
const PREFS_KEY = 'primordial-kanban-preferences-v1';
const FILTERS_KEY = 'primordial-kanban-saved-filters-v1';

interface KanbanRepositoryState {
  boards: KanbanBoard[];
  columns: KanbanColumn[];
  placements: KanbanCardPlacement[];
  swimlanes: KanbanSwimlane[];
}

const delay = async (ms = 120): Promise<void> => {
  await new Promise((resolve) => {
    globalThis.setTimeout(resolve, ms);
  });
};

const createId = (prefix: string): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
};

const PROJECTS = [
  { id: 'proj-core', name: 'Primordial Core' },
  { id: 'proj-workspace', name: 'Workspace Management' },
  { id: 'proj-design', name: 'Design System' },
  { id: 'proj-ai', name: 'AI Workspace' },
] as const;

const statusToColumnKey = (status: TaskStatus): string => {
  switch (status) {
    case 'backlog':
      return 'backlog';
    case 'todo':
      return 'todo';
    case 'in_progress':
      return 'in_progress';
    case 'in_review':
      return 'review';
    case 'blocked':
      return 'blocked';
    case 'completed':
      return 'done';
    case 'archived':
      return 'archived';
    case 'cancelled':
      return 'archived';
    default:
      return 'backlog';
  }
};

const emptyRepo = (): KanbanRepositoryState => ({
  boards: [],
  columns: [],
  placements: [],
  swimlanes: [],
});

const buildColumnsForBoard = (boardId: string, templateId: string): KanbanColumn[] => {
  const defs =
    templateId === 'blank'
      ? DEFAULT_COLUMN_DEFS.filter((def) => ['todo', 'in_progress', 'done'].includes(def.key))
      : templateId === 'bug_triage'
        ? DEFAULT_COLUMN_DEFS.filter((def) =>
            ['backlog', 'todo', 'in_progress', 'review', 'done', 'blocked'].includes(def.key),
          )
        : [...DEFAULT_COLUMN_DEFS];

  return defs.map((def, orderIndex) => ({
    id: createId('col'),
    boardId,
    key: def.key,
    name: def.name,
    description: def.description,
    mappedStatus: def.mappedStatus,
    orderIndex,
    wipLimit: def.key === 'in_progress' ? 5 : null,
    widthPreset: 'default' as const,
    collapsed: false,
    isSystem: def.system,
    isArchived: false,
  }));
};

const seedRepo = (workspaceId: string): KanbanRepositoryState => {
  const now = Date.now();
  const boards: KanbanBoard[] = PROJECTS.map((project, index) => ({
    id: `board-${project.id}`,
    workspaceId,
    projectId: project.id,
    projectName: project.name,
    name: `${project.name} Board`,
    description: `Primary execution board for ${project.name}.`,
    templateId: 'software_delivery' as const,
    isFavorite: index < 2,
    isPinned: index === 0,
    archivedAt: null,
    createdAt: now - 1000 * 60 * 60 * 24 * (30 - index),
    updatedAt: now - 1000 * 60 * 20 * index,
  }));

  const columns: KanbanColumn[] = [];
  for (const board of boards) {
    columns.push(...buildColumnsForBoard(board.id, board.templateId));
  }

  return {
    boards,
    columns,
    placements: [],
    swimlanes: [],
  };
};

export class InMemoryKanbanService {
  private readonly persistence: PersistenceAdapter;
  private readonly taskService = createTaskService();

  constructor(persistence: PersistenceAdapter = createLocalPersistence()) {
    this.persistence = persistence;
  }

  private async readRepo(workspaceId: string): Promise<KanbanRepositoryState> {
    const raw = await this.persistence.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded = seedRepo(workspaceId);
      await this.writeRepo(workspaceId, seeded);
      return seeded;
    }
    try {
      const parsed = JSON.parse(raw) as Record<string, KanbanRepositoryState>;
      if (parsed[workspaceId]) {
        return {
          boards: [...parsed[workspaceId].boards],
          columns: [...parsed[workspaceId].columns],
          placements: [...parsed[workspaceId].placements],
          swimlanes: [...(parsed[workspaceId].swimlanes ?? [])],
        };
      }
      const seeded = seedRepo(workspaceId);
      parsed[workspaceId] = seeded;
      await this.persistence.setItem(STORAGE_KEY, JSON.stringify(parsed));
      return seeded;
    } catch {
      return seedRepo(workspaceId);
    }
  }

  private async writeRepo(workspaceId: string, state: KanbanRepositoryState): Promise<void> {
    const raw = await this.persistence.getItem(STORAGE_KEY);
    let parsed: Record<string, KanbanRepositoryState> = {};
    if (raw) {
      try {
        parsed = JSON.parse(raw) as Record<string, KanbanRepositoryState>;
      } catch {
        parsed = {};
      }
    }
    parsed[workspaceId] = state;
    await this.persistence.setItem(STORAGE_KEY, JSON.stringify(parsed));
  }

  /**
   * Ensures every workspace task has a card placement on the project board.
   * Task Engine remains source of truth for task fields.
   */
  async syncPlacementsFromTasks(workspaceId: string): Promise<void> {
    const repo = await this.readRepo(workspaceId);
    const tasks = await this.taskService.listTasks(workspaceId);
    const existing = new Set(repo.placements.map((placement) => placement.taskId));
    const nextPlacements = [...repo.placements];

    for (const task of tasks) {
      if (existing.has(task.id)) {
        continue;
      }
      const board = repo.boards.find(
        (item) => item.projectId === task.projectId && !item.archivedAt,
      );
      if (!board) {
        continue;
      }
      const columnKey = statusToColumnKey(task.status);
      const column =
        repo.columns.find((item) => item.boardId === board.id && item.key === columnKey) ??
        repo.columns.find((item) => item.boardId === board.id && item.key === 'todo');
      if (!column) {
        continue;
      }
      const siblings = nextPlacements.filter((item) => item.columnId === column.id);
      nextPlacements.push({
        id: createId('card'),
        boardId: board.id,
        taskId: task.id,
        columnId: column.id,
        swimlaneId: null,
        orderIndex: siblings.length,
      });
    }

    repo.placements.splice(0, repo.placements.length, ...nextPlacements);
    await this.writeRepo(workspaceId, repo);
  }

  async listBoards(workspaceId: string): Promise<KanbanBoard[]> {
    await delay();
    await this.syncPlacementsFromTasks(workspaceId);
    const repo = await this.readRepo(workspaceId);
    return [...repo.boards].sort((a, b) => b.updatedAt - a.updatedAt);
  }

  async getBoard(workspaceId: string, boardId: string): Promise<KanbanBoard | null> {
    await delay(80);
    const repo = await this.readRepo(workspaceId);
    return repo.boards.find((board) => board.id === boardId) ?? null;
  }

  async createBoard(input: CreateBoardInput): Promise<KanbanBoard> {
    await delay();
    const repo = await this.readRepo(input.workspaceId);
    const now = Date.now();
    const projectName =
      PROJECTS.find((project) => project.id === input.projectId)?.name ?? 'Project';
    const board: KanbanBoard = {
      id: createId('board'),
      workspaceId: input.workspaceId,
      projectId: input.projectId,
      projectName,
      name: input.name.trim(),
      description: input.description?.trim() ?? '',
      templateId: input.templateId ?? 'software_delivery',
      isFavorite: false,
      isPinned: false,
      archivedAt: null,
      createdAt: now,
      updatedAt: now,
    };
    repo.boards.unshift(board);
    repo.columns.push(...buildColumnsForBoard(board.id, board.templateId));
    await this.writeRepo(input.workspaceId, repo);
    await this.syncPlacementsFromTasks(input.workspaceId);
    return board;
  }

  async updateBoard(
    workspaceId: string,
    boardId: string,
    input: UpdateBoardInput,
  ): Promise<KanbanBoard> {
    await delay();
    const repo = await this.readRepo(workspaceId);
    const index = repo.boards.findIndex((board) => board.id === boardId);
    if (index < 0) {
      throw new Error('Board not found.');
    }
    const updated: KanbanBoard = {
      ...repo.boards[index]!,
      name: input.name?.trim() ?? repo.boards[index]!.name,
      description:
        input.description !== undefined
          ? input.description.trim()
          : repo.boards[index]!.description,
      updatedAt: Date.now(),
    };
    repo.boards[index] = updated;
    await this.writeRepo(workspaceId, repo);
    return updated;
  }

  async archiveBoard(workspaceId: string, boardId: string): Promise<KanbanBoard> {
    await delay();
    const repo = await this.readRepo(workspaceId);
    const index = repo.boards.findIndex((board) => board.id === boardId);
    if (index < 0) {
      throw new Error('Board not found.');
    }
    const updated = { ...repo.boards[index]!, archivedAt: Date.now(), updatedAt: Date.now() };
    repo.boards[index] = updated;
    await this.writeRepo(workspaceId, repo);
    return updated;
  }

  async restoreBoard(workspaceId: string, boardId: string): Promise<KanbanBoard> {
    await delay();
    const repo = await this.readRepo(workspaceId);
    const index = repo.boards.findIndex((board) => board.id === boardId);
    if (index < 0) {
      throw new Error('Board not found.');
    }
    const updated = { ...repo.boards[index]!, archivedAt: null, updatedAt: Date.now() };
    repo.boards[index] = updated;
    await this.writeRepo(workspaceId, repo);
    return updated;
  }

  async deleteBoard(workspaceId: string, boardId: string): Promise<void> {
    await delay();
    const repo = await this.readRepo(workspaceId);
    repo.boards = repo.boards.filter((board) => board.id !== boardId);
    repo.columns = repo.columns.filter((column) => column.boardId !== boardId);
    repo.placements = repo.placements.filter((placement) => placement.boardId !== boardId);
    repo.swimlanes = repo.swimlanes.filter((lane) => lane.boardId !== boardId);
    await this.writeRepo(workspaceId, repo);
  }

  async toggleFavorite(workspaceId: string, boardId: string): Promise<KanbanBoard> {
    await delay(60);
    const repo = await this.readRepo(workspaceId);
    const index = repo.boards.findIndex((board) => board.id === boardId);
    if (index < 0) {
      throw new Error('Board not found.');
    }
    const updated = {
      ...repo.boards[index]!,
      isFavorite: !repo.boards[index]!.isFavorite,
      updatedAt: Date.now(),
    };
    repo.boards[index] = updated;
    await this.writeRepo(workspaceId, repo);
    return updated;
  }

  async listColumns(workspaceId: string, boardId: string): Promise<KanbanColumn[]> {
    await delay(60);
    const repo = await this.readRepo(workspaceId);
    return repo.columns
      .filter((column) => column.boardId === boardId && !column.isArchived)
      .sort((a, b) => a.orderIndex - b.orderIndex);
  }

  async createColumn(workspaceId: string, input: CreateColumnInput): Promise<KanbanColumn> {
    await delay();
    const repo = await this.readRepo(workspaceId);
    const siblings = repo.columns.filter(
      (column) => column.boardId === input.boardId && !column.isArchived,
    );
    if (siblings.length >= 20) {
      throw new Error('Column limit reached (20 active columns).');
    }
    const column: KanbanColumn = {
      id: createId('col'),
      boardId: input.boardId,
      key: createId('custom'),
      name: input.name.trim(),
      description: input.description?.trim() ?? '',
      mappedStatus: input.mappedStatus,
      orderIndex: siblings.length,
      wipLimit: input.wipLimit ?? null,
      widthPreset: 'default',
      collapsed: false,
      isSystem: false,
      isArchived: false,
    };
    repo.columns.push(column);
    await this.writeRepo(workspaceId, repo);
    return column;
  }

  async updateColumn(
    workspaceId: string,
    columnId: string,
    input: UpdateColumnInput,
  ): Promise<KanbanColumn> {
    await delay(60);
    const repo = await this.readRepo(workspaceId);
    const index = repo.columns.findIndex((column) => column.id === columnId);
    if (index < 0) {
      throw new Error('Column not found.');
    }
    const current = repo.columns[index]!;
    const updated: KanbanColumn = {
      ...current,
      name: input.name?.trim() ?? current.name,
      description: input.description !== undefined ? input.description.trim() : current.description,
      mappedStatus: input.mappedStatus ?? current.mappedStatus,
      wipLimit: input.wipLimit !== undefined ? input.wipLimit : current.wipLimit,
      widthPreset: input.widthPreset ?? current.widthPreset,
      collapsed: input.collapsed ?? current.collapsed,
      color: input.color ?? current.color,
    };
    repo.columns[index] = updated;
    await this.writeRepo(workspaceId, repo);
    return updated;
  }

  async archiveColumn(workspaceId: string, columnId: string): Promise<KanbanColumn> {
    return this.updateColumn(workspaceId, columnId, {}).then(async () => {
      const repo = await this.readRepo(workspaceId);
      const index = repo.columns.findIndex((column) => column.id === columnId);
      if (index < 0) {
        throw new Error('Column not found.');
      }
      if (repo.columns[index]!.isSystem) {
        throw new Error('System columns cannot be archived.');
      }
      const updated = { ...repo.columns[index]!, isArchived: true };
      repo.columns[index] = updated;
      await this.writeRepo(workspaceId, repo);
      return updated;
    });
  }

  async deleteColumn(
    workspaceId: string,
    columnId: string,
    destinationColumnId?: string,
  ): Promise<void> {
    await delay();
    const repo = await this.readRepo(workspaceId);
    const column = repo.columns.find((item) => item.id === columnId);
    if (!column) {
      throw new Error('Column not found.');
    }
    if (column.isSystem) {
      throw new Error('System columns cannot be deleted.');
    }
    const cards = repo.placements.filter((placement) => placement.columnId === columnId);
    if (cards.length > 0) {
      if (!destinationColumnId) {
        throw new Error('Choose a destination column for existing tasks.');
      }
      const dest = repo.columns.find((item) => item.id === destinationColumnId);
      if (!dest) {
        throw new Error('Destination column not found.');
      }
      let order = repo.placements.filter((item) => item.columnId === destinationColumnId).length;
      for (const card of cards) {
        const index = repo.placements.findIndex((item) => item.id === card.id);
        if (index >= 0) {
          repo.placements[index] = {
            ...card,
            columnId: destinationColumnId,
            orderIndex: order,
          };
          order += 1;
          await this.taskService.updateTask(workspaceId, card.taskId, {
            status: dest.mappedStatus,
          });
        }
      }
    }
    repo.columns = repo.columns.filter((item) => item.id !== columnId);
    await this.writeRepo(workspaceId, repo);
  }

  async reorderColumns(
    workspaceId: string,
    boardId: string,
    orderedIds: readonly string[],
  ): Promise<KanbanColumn[]> {
    await delay(60);
    const repo = await this.readRepo(workspaceId);
    const map = new Map(
      repo.columns
        .filter((column) => column.boardId === boardId)
        .map((column) => [column.id, column]),
    );
    orderedIds.forEach((id, orderIndex) => {
      const column = map.get(id);
      if (column) {
        const index = repo.columns.findIndex((item) => item.id === id);
        if (index >= 0) {
          repo.columns[index] = { ...column, orderIndex };
        }
      }
    });
    await this.writeRepo(workspaceId, repo);
    return this.listColumns(workspaceId, boardId);
  }

  async listPlacements(workspaceId: string, boardId: string): Promise<KanbanCardPlacement[]> {
    await delay(40);
    await this.syncPlacementsFromTasks(workspaceId);
    const repo = await this.readRepo(workspaceId);
    return repo.placements
      .filter((placement) => placement.boardId === boardId)
      .sort((a, b) => a.orderIndex - b.orderIndex);
  }

  /**
   * Optimistic-friendly move. Updates Task Engine status from destination column mapping.
   * Returns previous placements for rollback.
   */
  async moveCards(
    workspaceId: string,
    payload: KanbanMovePayload,
  ): Promise<{ placements: KanbanCardPlacement[]; previous: KanbanCardPlacement[] }> {
    await delay(80);
    const repo = await this.readRepo(workspaceId);
    const destination = repo.columns.find((column) => column.id === payload.destinationColumnId);
    if (!destination) {
      throw new Error('Destination column not found.');
    }

    if (destination.wipLimit != null) {
      const currentCount = repo.placements.filter(
        (placement) =>
          placement.columnId === destination.id && !payload.taskIds.includes(placement.taskId),
      ).length;
      if (currentCount + payload.taskIds.length > destination.wipLimit) {
        throw new Error(`WIP limit of ${destination.wipLimit} would be exceeded.`);
      }
    }

    const previous = repo.placements
      .filter((placement) => payload.taskIds.includes(placement.taskId))
      .map((placement) => ({ ...placement }));

    // Remove moving cards from source lists
    const remaining = repo.placements.filter(
      (placement) => !payload.taskIds.includes(placement.taskId),
    );

    const destCards = remaining
      .filter((placement) => placement.columnId === payload.destinationColumnId)
      .sort((a, b) => a.orderIndex - b.orderIndex);

    const moving = previous.map((placement, offset) => ({
      ...placement,
      columnId: payload.destinationColumnId,
      swimlaneId: payload.destinationSwimlaneId,
      orderIndex: payload.destinationIndex + offset,
    }));

    const before = destCards.slice(0, payload.destinationIndex);
    const after = destCards.slice(payload.destinationIndex);
    const reindexedDest = [...before, ...moving, ...after].map((placement, orderIndex) => ({
      ...placement,
      orderIndex,
    }));

    const other = remaining.filter(
      (placement) => placement.columnId !== payload.destinationColumnId,
    );

    // Reindex source column
    const sourceCards = other
      .filter((placement) => placement.columnId === payload.sourceColumnId)
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map((placement, orderIndex) => ({ ...placement, orderIndex }));

    const rest = other.filter((placement) => placement.columnId !== payload.sourceColumnId);

    repo.placements = [...rest, ...sourceCards, ...reindexedDest];
    await this.writeRepo(workspaceId, repo);

    // Task Engine is source of truth for status
    for (const taskId of payload.taskIds) {
      await this.taskService.updateTask(workspaceId, taskId, {
        status: destination.mappedStatus,
        orderIndex: moving.find((item) => item.taskId === taskId)?.orderIndex,
      });
    }

    return {
      placements: repo.placements.filter((placement) => placement.boardId === destination.boardId),
      previous,
    };
  }

  async rollbackPlacements(
    workspaceId: string,
    previous: readonly KanbanCardPlacement[],
  ): Promise<void> {
    const repo = await this.readRepo(workspaceId);
    for (const prior of previous) {
      const index = repo.placements.findIndex((placement) => placement.id === prior.id);
      if (index >= 0) {
        repo.placements[index] = { ...prior };
      }
      const column = repo.columns.find((item) => item.id === prior.columnId);
      if (column) {
        await this.taskService.updateTask(workspaceId, prior.taskId, {
          status: column.mappedStatus,
          orderIndex: prior.orderIndex,
        });
      }
    }
    await this.writeRepo(workspaceId, repo);
  }

  async getStatistics(
    workspaceId: string,
    boardId: string,
    tasks: readonly Task[],
  ): Promise<KanbanBoardStatistics> {
    await delay(40);
    const repo = await this.readRepo(workspaceId);
    const columns = repo.columns.filter((column) => column.boardId === boardId);
    const placements = repo.placements.filter((placement) => placement.boardId === boardId);
    const taskMap = new Map(tasks.map((task) => [task.id, task]));
    const tasksPerColumn: Record<string, number> = {};
    let completed = 0;
    let blocked = 0;
    let overdue = 0;
    let totalVisible = 0;
    const now = Date.now();

    for (const column of columns) {
      if (column.key === 'archived') {
        continue;
      }
      const cards = placements.filter((placement) => placement.columnId === column.id);
      tasksPerColumn[column.id] = cards.length;
      for (const card of cards) {
        const task = taskMap.get(card.taskId);
        if (!task || task.archivedAt) {
          continue;
        }
        totalVisible += 1;
        if (task.status === 'completed') {
          completed += 1;
        }
        if (task.status === 'blocked') {
          blocked += 1;
        }
        if (task.dueDate != null && task.dueDate < now && task.status !== 'completed') {
          overdue += 1;
        }
      }
    }

    return {
      tasksPerColumn,
      completionRate: totalVisible === 0 ? 0 : Math.round((completed / totalVisible) * 100),
      blockedCount: blocked,
      overdueCount: overdue,
      totalVisible,
    };
  }

  async getPreferences(): Promise<KanbanPreferences> {
    const raw = await this.persistence.getItem(PREFS_KEY);
    if (!raw) {
      return { ...DEFAULT_KANBAN_PREFERENCES };
    }
    try {
      return {
        ...DEFAULT_KANBAN_PREFERENCES,
        ...(JSON.parse(raw) as Partial<KanbanPreferences>),
      };
    } catch {
      return { ...DEFAULT_KANBAN_PREFERENCES };
    }
  }

  async updatePreferences(prefs: Partial<KanbanPreferences>): Promise<KanbanPreferences> {
    const next = { ...(await this.getPreferences()), ...prefs };
    await this.persistence.setItem(PREFS_KEY, JSON.stringify(next));
    return next;
  }

  async listSavedFilters(workspaceId: string): Promise<KanbanSavedFilter[]> {
    const raw = await this.persistence.getItem(`${FILTERS_KEY}:${workspaceId}`);
    if (!raw) {
      return [];
    }
    try {
      return JSON.parse(raw) as KanbanSavedFilter[];
    } catch {
      return [];
    }
  }

  async saveFilter(
    workspaceId: string,
    name: string,
    filters: KanbanFiltersState,
  ): Promise<KanbanSavedFilter> {
    const list = await this.listSavedFilters(workspaceId);
    const saved: KanbanSavedFilter = {
      id: createId('filter'),
      name,
      filters,
      shared: false,
    };
    list.unshift(saved);
    await this.persistence.setItem(`${FILTERS_KEY}:${workspaceId}`, JSON.stringify(list));
    return saved;
  }

  emptyFilters(): KanbanFiltersState {
    return {
      query: '',
      statuses: [],
      priorities: [],
      assigneeIds: [],
      projectIds: [],
      labels: [],
      tags: [],
      favoritesOnly: false,
      pinnedOnly: false,
      completedOnly: false,
      archivedOnly: false,
      blockedOnly: false,
      dueFrom: null,
      dueTo: null,
    };
  }
}

export const createKanbanService = (): InMemoryKanbanService => new InMemoryKanbanService();

export const __resetKanbanStorageForTests = async (): Promise<void> => {
  const persistence = createLocalPersistence();
  await persistence.removeItem(STORAGE_KEY);
  await persistence.removeItem(PREFS_KEY);
};

export { emptyRepo };
