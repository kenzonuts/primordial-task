import type { BoardTemplateId, ColumnWidthPreset, SwimlaneMode } from '@features/kanban/types';
import type { KanbanPreferences } from '@features/kanban/types';

export const BOARD_TEMPLATE_LABELS: Record<BoardTemplateId, string> = {
  software_delivery: 'Software Delivery',
  bug_triage: 'Bug Triage',
  content: 'Content Pipeline',
  blank: 'Blank Board',
};

export const COLUMN_WIDTH_LABELS: Record<ColumnWidthPreset, string> = {
  compact: 'Compact',
  default: 'Default',
  comfortable: 'Comfortable',
};

export const SWIMLANE_MODE_LABELS: Record<SwimlaneMode, string> = {
  none: 'No swimlanes',
  assignee: 'Assignee',
  priority: 'Priority',
  label: 'Labels',
  status: 'Status',
  custom: 'Custom',
};

export const DEFAULT_KANBAN_PREFERENCES: KanbanPreferences = {
  columnWidth: 'default',
  showStatistics: true,
  showArchivedColumn: false,
  swimlaneMode: 'none',
  cardDensity: 'comfortable',
  autoScroll: true,
  announceMoves: true,
};

export const KANBAN_CARD_MIN_HEIGHT = 96;
export const KANBAN_COLUMN_GAP = 12;
export const KANBAN_CARD_GAP = 8;
export const KANBAN_VIRTUALIZE_THRESHOLD = 50;
export const KANBAN_MAX_ACTIVE_COLUMNS = 20;
export const KANBAN_SEARCH_DEBOUNCE_MS = 150;
