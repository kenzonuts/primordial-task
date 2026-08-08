export {
  CALENDAR_ROUTES,
  calendarDayPath,
  CALENDAR_VIEWS,
  TIMELINE_ZOOM_LEVELS,
  DATE_PRESETS,
  RECURRENCE_FREQUENCIES,
} from '@features/calendar/types';
export type {
  CalendarViewMode,
  TimelineZoomLevel,
  DatePreset,
  RecurrenceFrequency,
  RecurrenceRule,
  CalendarEvent,
  CalendarMilestone,
  CalendarDependencyIndicator,
  CalendarDateRange,
  CalendarFiltersState,
  CalendarPreferences,
  CalendarSelectionState,
  CalendarDragState,
  TimelineRowModel,
  DaySummary,
  TaskToEventMapper,
} from '@features/calendar/types';

export {
  CALENDAR_VIEW_LABELS,
  TIMELINE_ZOOM_LABELS,
  DEFAULT_CALENDAR_PREFERENCES,
  CALENDAR_SIDEBAR_WIDTH,
  CALENDAR_TOOLBAR_HEIGHT,
  HOUR_HEIGHT_PX,
  MIN_EVENT_DURATION_MS,
  SEARCH_DEBOUNCE_MS,
  MOVE_DEBOUNCE_MS,
  WEEKDAY_LABELS_SHORT,
  WEEKDAY_LABELS_MON,
} from '@features/calendar/constants';

export {
  calendarViewSchema,
  timelineZoomSchema,
  recurrenceRuleSchema,
  goToDateSchema,
  rescheduleEventSchema,
} from '@features/calendar/schemas/calendar-schemas';
export type {
  GoToDateFormValues,
  RescheduleEventFormValues,
  RecurrenceRuleFormValues,
} from '@features/calendar/schemas/calendar-schemas';

export {
  useCalendarStore,
  calendarService,
  selectVisibleEvents,
  useCalendarViewStore,
  useCalendarNavigationStore,
  useCalendarFilterStore,
  useCalendarSearchStore,
  useCalendarSelectionStore,
  useTimelineStore,
  useCalendarPreferenceStore,
  useCalendarDragStore,
} from '@features/calendar/store';

export {
  createCalendarService,
  CalendarProjectionService,
  mapTaskToCalendarEvent,
  emptyCalendarFilters,
  filterCalendarEvents,
  eventsInRange,
  eventsOnDay,
  __resetCalendarStorageForTests,
} from '@features/calendar/services/calendar-service';

export { CalendarProvider, useCalendarContext } from '@features/calendar/context/calendar-context';
export type { CalendarContextValue } from '@features/calendar/context/calendar-context';

export { CalendarRoutes } from '@features/calendar/routes/calendar-routes';

export { CalendarPage, TimelinePage } from '@features/calendar/pages';
export type { CalendarPageProps } from '@features/calendar/pages';

export * from '@features/calendar/components';
