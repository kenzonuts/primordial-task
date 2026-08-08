import type { Task, TaskPriority, TaskStatus } from '@features/task/types';

export const CALENDAR_ROUTES = {
  root: '/calendar',
  timeline: '/calendar/timeline',
  day: '/calendar/day/:date',
  agenda: '/calendar/agenda',
} as const;

export const calendarDayPath = (dateIso: string): string => `/calendar/day/${dateIso}`;

export const CALENDAR_VIEWS = ['month', 'week', 'day', 'agenda', 'timeline', 'schedule'] as const;

export type CalendarViewMode = (typeof CALENDAR_VIEWS)[number];

export const TIMELINE_ZOOM_LEVELS = ['day', 'week', 'month', 'quarter'] as const;

export type TimelineZoomLevel = (typeof TIMELINE_ZOOM_LEVELS)[number];

export const DATE_PRESETS = [
  'today',
  'tomorrow',
  'yesterday',
  'this_week',
  'next_week',
  'this_month',
  'next_month',
  'custom',
] as const;

export type DatePreset = (typeof DATE_PRESETS)[number];

export const RECURRENCE_FREQUENCIES = ['daily', 'weekly', 'monthly', 'yearly', 'custom'] as const;

export type RecurrenceFrequency = (typeof RECURRENCE_FREQUENCIES)[number];

/**
 * Recurrence architecture foundation — no expansion engine in Phase 11.
 */
export interface RecurrenceRule {
  readonly frequency: RecurrenceFrequency;
  readonly interval: number;
  readonly byWeekday?: readonly number[];
  readonly until?: number | null;
  readonly count?: number | null;
  readonly rrulePlaceholder?: string;
}

/**
 * Calendar projection of a Task. Task Engine remains source of truth.
 */
export interface CalendarEvent {
  readonly id: string;
  readonly taskId: string;
  readonly title: string;
  readonly description: string;
  readonly status: TaskStatus;
  readonly priority: TaskPriority;
  readonly projectId: string;
  readonly projectName: string;
  readonly workspaceId: string;
  readonly assigneeName: string | null;
  readonly assigneeId: string | null;
  readonly labels: readonly string[];
  readonly tags: readonly string[];
  readonly startAt: number;
  readonly endAt: number;
  readonly allDay: boolean;
  readonly progress: number;
  readonly completed: boolean;
  readonly isFavorite: boolean;
  readonly isPinned: boolean;
  readonly isOverdue: boolean;
  readonly checklistProgress: number;
  readonly recurrence: RecurrenceRule | null;
}

export interface CalendarMilestone {
  readonly id: string;
  readonly projectId: string;
  readonly title: string;
  readonly at: number;
}

export interface CalendarDependencyIndicator {
  readonly id: string;
  readonly fromTaskId: string;
  readonly toTaskId: string;
  readonly soft: boolean;
}

export interface CalendarDateRange {
  readonly start: number;
  readonly end: number;
}

export interface CalendarFiltersState {
  readonly query: string;
  readonly projectIds: readonly string[];
  readonly statuses: readonly TaskStatus[];
  readonly priorities: readonly TaskPriority[];
  readonly assigneeIds: readonly string[];
  readonly labels: readonly string[];
  readonly tags: readonly string[];
  readonly favoritesOnly: boolean;
  readonly pinnedOnly: boolean;
  readonly archivedOnly: boolean;
  readonly completedOnly: boolean;
  readonly overdueOnly: boolean;
}

export interface CalendarPreferences {
  readonly defaultView: CalendarViewMode;
  readonly weekStartsOn: 0 | 1;
  readonly workdayStartHour: number;
  readonly workdayEndHour: number;
  readonly showWeekends: boolean;
  readonly showCompleted: boolean;
  readonly dimPastEvents: boolean;
  readonly timelineZoom: TimelineZoomLevel;
  readonly timelineGroupBy: 'project' | 'assignee' | 'none';
  readonly sidebarCollapsed: boolean;
}

export interface CalendarSelectionState {
  readonly selectedEventIds: ReadonlySet<string>;
  readonly focusedDate: number | null;
  readonly focusedEventId: string | null;
}

export interface CalendarDragState {
  readonly activeEventIds: readonly string[];
  readonly mode: 'move' | 'resize-start' | 'resize-end' | null;
  readonly previewStart: number | null;
  readonly previewEnd: number | null;
  readonly announcement: string | null;
  readonly isDragging: boolean;
}

export interface TimelineRowModel {
  readonly id: string;
  readonly label: string;
  readonly groupKey: string;
  readonly events: readonly CalendarEvent[];
}

export interface DaySummary {
  readonly date: number;
  readonly eventCount: number;
  readonly overdueCount: number;
  readonly completedCount: number;
  readonly events: readonly CalendarEvent[];
}

export type TaskToEventMapper = (task: Task, now?: number) => CalendarEvent | null;
