import type {
  CalendarPreferences,
  CalendarViewMode,
  TimelineZoomLevel,
} from '@features/calendar/types';

export const CALENDAR_VIEW_LABELS: Record<CalendarViewMode, string> = {
  month: 'Month',
  week: 'Week',
  day: 'Day',
  agenda: 'Agenda',
  timeline: 'Timeline',
  schedule: 'Schedule',
};

export const TIMELINE_ZOOM_LABELS: Record<TimelineZoomLevel, string> = {
  day: 'Day',
  week: 'Week',
  month: 'Month',
  quarter: 'Quarter',
};

export const DEFAULT_CALENDAR_PREFERENCES: CalendarPreferences = {
  defaultView: 'month',
  weekStartsOn: 1,
  workdayStartHour: 9,
  workdayEndHour: 18,
  showWeekends: true,
  showCompleted: true,
  dimPastEvents: true,
  timelineZoom: 'week',
  timelineGroupBy: 'project',
  sidebarCollapsed: false,
};

export const CALENDAR_SIDEBAR_WIDTH = 264;
export const CALENDAR_TOOLBAR_HEIGHT = 48;
export const HOUR_HEIGHT_PX = 48;
export const MIN_EVENT_DURATION_MS = 15 * 60 * 1000;
export const SEARCH_DEBOUNCE_MS = 150;
export const MOVE_DEBOUNCE_MS = 500;

export const WEEKDAY_LABELS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
export const WEEKDAY_LABELS_MON = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
