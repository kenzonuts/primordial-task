export {
  KANBAN_ROUTES,
  kanbanBoardPath,
  kanbanSettingsPath,
  kanbanOverviewPath,
  COLUMN_WIDTH_PRESETS,
  SWIMLANE_MODES,
  BOARD_TEMPLATES,
  DEFAULT_COLUMN_DEFS,
} from '@features/kanban/types';
export type {
  BoardTemplateId,
  ColumnWidthPreset,
  CreateBoardInput,
  CreateColumnInput,
  KanbanBoard,
  KanbanBoardStatistics,
  KanbanCardPlacement,
  KanbanColumn,
  KanbanDragState,
  KanbanFiltersState,
  KanbanLayoutState,
  KanbanMovePayload,
  KanbanPreferences,
  KanbanSavedFilter,
  KanbanSwimlane,
  SwimlaneMode,
  UpdateBoardInput,
  UpdateColumnInput,
} from '@features/kanban/types';

export {
  BOARD_TEMPLATE_LABELS,
  COLUMN_WIDTH_LABELS,
  SWIMLANE_MODE_LABELS,
  DEFAULT_KANBAN_PREFERENCES,
  KANBAN_CARD_MIN_HEIGHT,
  KANBAN_COLUMN_GAP,
  KANBAN_CARD_GAP,
  KANBAN_VIRTUALIZE_THRESHOLD,
  KANBAN_MAX_ACTIVE_COLUMNS,
  KANBAN_SEARCH_DEBOUNCE_MS,
} from '@features/kanban/constants';

export {
  createBoardSchema,
  updateBoardSchema,
  createColumnSchema,
  renameColumnSchema,
  boardNameSchema,
  boardDescriptionSchema,
  columnNameSchema,
} from '@features/kanban/schemas/kanban-schemas';
export type {
  CreateBoardFormValues,
  UpdateBoardFormValues,
  CreateColumnFormValues,
} from '@features/kanban/schemas/kanban-schemas';

export {
  useKanbanBoardStore,
  useKanbanColumnStore,
  useKanbanFilterStore,
  useKanbanSearchStore,
  useKanbanSelectionStore,
  useKanbanDragStore,
  useKanbanPreferencesStore,
  useKanbanLayoutStore,
  filterBoardTasks,
  kanbanService,
} from '@features/kanban/store';

export {
  createKanbanService,
  InMemoryKanbanService,
  __resetKanbanStorageForTests,
} from '@features/kanban/services/kanban-service';

export { KanbanProvider, useKanbanContext } from '@features/kanban/context/kanban-context';
export type { KanbanContextValue } from '@features/kanban/context/kanban-context';

export { KanbanRoutes } from '@features/kanban/routes/kanban-routes';

export {
  BoardListPage,
  BoardCreatePage,
  BoardPage,
  BoardOverviewPage,
  BoardSettingsPage,
} from '@features/kanban/pages';

export * from '@features/kanban/components';
