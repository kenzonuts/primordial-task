import type { KeyboardEvent, MouseEvent, ReactElement } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { AgendaList } from '@features/calendar/components/agenda-list';
import { CalendarDialog } from '@features/calendar/components/calendar-dialog';
import { CalendarEmptyState } from '@features/calendar/components/calendar-empty-state';
import { CalendarGrid } from '@features/calendar/components/calendar-grid';
import { CalendarSidebar } from '@features/calendar/components/calendar-sidebar';
import { CalendarSkeleton } from '@features/calendar/components/calendar-skeleton';
import { CalendarToolbar } from '@features/calendar/components/calendar-toolbar';
import { DayView } from '@features/calendar/components/day-view';
import { ScheduleView } from '@features/calendar/components/schedule-view';
import { Timeline } from '@features/calendar/components/timeline';
import { WeekView } from '@features/calendar/components/week-view';
import { CALENDAR_SIDEBAR_WIDTH, SEARCH_DEBOUNCE_MS } from '@features/calendar/constants';
import { useCalendarContext } from '@features/calendar/context/calendar-context';
import {
  calendarService,
  selectVisibleEvents,
  useCalendarDragStore,
  useCalendarFilterStore,
  useCalendarNavigationStore,
  useCalendarPreferenceStore,
  useCalendarSearchStore,
  useCalendarSelectionStore,
  useCalendarStore,
  useCalendarViewStore,
  useTimelineStore,
} from '@features/calendar/store';
import type { CalendarEvent, CalendarViewMode } from '@features/calendar/types';
import {
  endOfDay,
  formatDayLabel,
  formatMonthYear,
  formatRangeLabel,
  parseDateIso,
  shiftAnchorForView,
  startOfDay,
  visibleRangeForView,
} from '@features/calendar/utils/date-utils';
import { useKanbanLayoutStore } from '@features/kanban/store/layout-store';
import { useProjectStore } from '@features/project/store/project-store';
import { useUtilityPanelStore } from '@features/shell/store/utility-panel-store';
import { useTaskStore } from '@features/task/store/task-store';
import { TASK_ROUTES } from '@features/task/types';
import { Alert } from '@shared/ui/feedback/alert';
import { toast } from '@shared/ui/feedback/toast';
import { Stack } from '@shared/ui/layout/stack';
import { Button } from '@shared/ui/primitives/button';

const isTypingTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  const tag = target.tagName;
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    target.isContentEditable ||
    Boolean(target.closest('[contenteditable="true"]'))
  );
};

const VIEW_HOTKEYS: Record<string, CalendarViewMode> = {
  m: 'month',
  w: 'week',
  d: 'day',
  a: 'agenda',
  l: 'timeline',
  s: 'schedule',
};

type CalendarPageProps = {
  readonly forcedView?: CalendarViewMode;
};

export const CalendarPage = ({ forcedView }: CalendarPageProps): ReactElement => {
  const navigate = useNavigate();
  const { date: dateParam } = useParams<{ date?: string }>();
  const { workspaceId, status, loadEvents } = useCalendarContext();

  const events = useCalendarStore((state) => state.events);
  const milestones = useCalendarStore((state) => state.milestones);
  const error = useCalendarStore((state) => state.error);
  const clearError = useCalendarStore((state) => state.clearError);
  const resize = useCalendarStore((state) => state.resize);

  const view = useCalendarViewStore((state) => state.view);
  const setView = useCalendarViewStore((state) => state.setView);

  const anchorDate = useCalendarNavigationStore((state) => state.anchorDate);
  const setAnchorDate = useCalendarNavigationStore((state) => state.setAnchorDate);
  const goToday = useCalendarNavigationStore((state) => state.goToday);

  const filters = useCalendarFilterStore((state) => state.filters);
  const setFilters = useCalendarFilterStore((state) => state.setFilters);
  const resetFilters = useCalendarFilterStore((state) => state.resetFilters);

  const query = useCalendarSearchStore((state) => state.query);
  const setQuery = useCalendarSearchStore((state) => state.setQuery);
  const setDebouncedQuery = useCalendarSearchStore((state) => state.setDebouncedQuery);
  const clearSearch = useCalendarSearchStore((state) => state.clear);

  const selectedIds = useCalendarSelectionStore((state) => state.selectedIds);
  const focusedEventId = useCalendarSelectionStore((state) => state.focusedEventId);
  const focusedDate = useCalendarSelectionStore((state) => state.focusedDate);
  const selectEvent = useCalendarSelectionStore((state) => state.select);
  const toggleSelection = useCalendarSelectionStore((state) => state.toggle);
  const clearSelection = useCalendarSelectionStore((state) => state.clear);
  const setFocusedDate = useCalendarSelectionStore((state) => state.setFocusedDate);

  const preferences = useCalendarPreferenceStore((state) => state.preferences);

  const timelineZoom = useTimelineStore((state) => state.zoom);
  const timelineGroupBy = useTimelineStore((state) => state.groupBy);
  const setTimelineZoom = useTimelineStore((state) => state.setZoom);
  const setScrollLeft = useTimelineStore((state) => state.setScrollLeft);

  const dragAnnouncement = useCalendarDragStore((state) => state.announcement);
  const startMove = useCalendarDragStore((state) => state.startMove);
  const commitMove = useCalendarDragStore((state) => state.commitMove);

  const openDetail = useKanbanLayoutStore((state) => state.openDetail);
  const setUtilityMode = useUtilityPanelStore((state) => state.setMode);
  const setUtilityOpen = useUtilityPanelStore((state) => state.setOpen);

  const createTask = useTaskStore((state) => state.createTask);
  const projects = useProjectStore((state) => state.projects);
  const selectedProjectId = useProjectStore((state) => state.selectedProjectId);
  const loadProjects = useProjectStore((state) => state.loadProjects);

  const [goToOpen, setGoToOpen] = useState(false);
  const [announcement, setAnnouncement] = useState<string | null>(null);

  const activeView = forcedView ?? view;
  const weekStartsOn = preferences.weekStartsOn;
  const isLoading = status === 'idle' || status === 'loading';

  useEffect(() => {
    if (forcedView && view !== forcedView) {
      setView(forcedView);
    }
  }, [forcedView, view, setView]);

  useEffect(() => {
    if (!dateParam) {
      return;
    }
    const parsed = parseDateIso(dateParam);
    if (!Number.isNaN(parsed)) {
      setAnchorDate(parsed);
      setFocusedDate(startOfDay(parsed));
      if (!forcedView) {
        setView('day');
      }
    }
  }, [dateParam, forcedView, setAnchorDate, setFocusedDate, setView]);

  useEffect(() => {
    if (!workspaceId) {
      return;
    }
    void loadProjects(workspaceId);
  }, [workspaceId, loadProjects]);

  useEffect(() => {
    const handle = globalThis.setTimeout(() => {
      setDebouncedQuery(query);
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      globalThis.clearTimeout(handle);
    };
  }, [query, setDebouncedQuery]);

  const visibleEvents = useMemo(
    () => selectVisibleEvents(events, activeView, anchorDate, weekStartsOn, filters),
    [events, activeView, anchorDate, weekStartsOn, filters],
  );

  const upcoming = useMemo(() => calendarService.upcoming(events), [events]);
  const overdue = useMemo(() => calendarService.overdue(events), [events]);
  const favorites = useMemo(() => calendarService.favorites(events), [events]);

  const timelineRows = useMemo(
    () => calendarService.buildTimelineRows(visibleEvents, timelineGroupBy),
    [visibleEvents, timelineGroupBy],
  );

  const rangeLabel = useMemo(() => {
    if (activeView === 'month') {
      return formatMonthYear(anchorDate);
    }
    if (activeView === 'day') {
      return formatDayLabel(anchorDate);
    }
    const range = visibleRangeForView(activeView, anchorDate, weekStartsOn);
    return formatRangeLabel(range.start, range.end);
  }, [activeView, anchorDate, weekStartsOn]);

  const defaultProjectId = selectedProjectId ?? projects[0]?.id ?? 'proj-core';

  const openEvent = useCallback(
    (event: CalendarEvent): void => {
      selectEvent(event.id);
      openDetail(event.taskId);
      setUtilityMode('task-details');
      setUtilityOpen(true);
    },
    [openDetail, selectEvent, setUtilityMode, setUtilityOpen],
  );

  const handleSelectEvent = useCallback(
    (event: CalendarEvent, nativeEvent: MouseEvent | KeyboardEvent): void => {
      const additive = nativeEvent.metaKey || nativeEvent.ctrlKey;
      toggleSelection(event.id, additive);
    },
    [toggleSelection],
  );

  const handlePickup = useCallback(
    (event: CalendarEvent): void => {
      const ids = selectedIds.has(event.id) && selectedIds.size > 1 ? [...selectedIds] : [event.id];
      startMove(ids);
      setAnnouncement(`Picked up ${ids.length} event${ids.length === 1 ? '' : 's'}.`);
    },
    [selectedIds, startMove],
  );

  const resolveEventsByIds = useCallback(
    (eventIds: readonly string[]): CalendarEvent[] => {
      const idSet = new Set(eventIds);
      return events.filter((event) => idSet.has(event.id));
    },
    [events],
  );

  const handleMoveToDate = useCallback(
    async (taskId: string, dateMs: number, eventIds?: readonly string[]): Promise<void> => {
      if (!workspaceId) {
        return;
      }
      const targets =
        eventIds && eventIds.length > 0
          ? resolveEventsByIds(eventIds)
          : events.filter((event) => event.taskId === taskId);
      if (targets.length === 0) {
        return;
      }
      const primary = targets.find((event) => event.taskId === taskId) ?? targets[0]!;
      const dayDelta = startOfDay(dateMs) - startOfDay(primary.startAt);
      try {
        await commitMove(
          workspaceId,
          targets.map((event) => ({
            taskId: event.taskId,
            startAt: event.startAt + dayDelta,
            endAt: event.endAt + dayDelta,
          })),
        );
        setAnnouncement(`Moved to ${formatDayLabel(dateMs)}.`);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Could not reschedule.');
      }
    },
    [workspaceId, events, resolveEventsByIds, commitMove],
  );

  const handleMoveEvent = useCallback(
    async (
      taskId: string,
      startAt: number,
      endAt: number,
      eventIds?: readonly string[],
    ): Promise<void> => {
      if (!workspaceId) {
        return;
      }
      const targets =
        eventIds && eventIds.length > 0
          ? resolveEventsByIds(eventIds)
          : events.filter((event) => event.taskId === taskId);
      if (targets.length === 0) {
        return;
      }
      const primary = targets.find((event) => event.taskId === taskId) ?? targets[0]!;
      const delta = startAt - primary.startAt;
      try {
        await commitMove(
          workspaceId,
          targets.map((event) => ({
            taskId: event.taskId,
            startAt: event.startAt + delta,
            endAt: event.endAt + delta,
          })),
        );
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Could not move event.');
      }
    },
    [workspaceId, events, resolveEventsByIds, commitMove],
  );

  const handleResize = useCallback(
    async (event: CalendarEvent, edge: 'start' | 'end', nextMs: number): Promise<void> => {
      if (!workspaceId) {
        return;
      }
      try {
        await resize(workspaceId, event.taskId, edge, nextMs);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Could not resize event.');
      }
    },
    [workspaceId, resize],
  );

  const quickCreateAt = useCallback(
    async (dateMs: number, hour?: number): Promise<void> => {
      if (!workspaceId) {
        navigate(TASK_ROUTES.create);
        return;
      }
      const start = hour == null ? startOfDay(dateMs) : startOfDay(dateMs) + hour * 60 * 60 * 1000;
      const end = hour == null ? endOfDay(dateMs) : start + 60 * 60 * 1000;
      try {
        const task = await createTask({
          workspaceId,
          projectId: defaultProjectId,
          title: 'New calendar task',
          status: 'todo',
          priority: 'medium',
          type: 'task',
          startDate: start,
          dueDate: end,
        });
        await loadEvents();
        openDetail(task.id);
        setUtilityMode('task-details');
        toast.success('Task created.');
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Could not create task.');
        navigate(TASK_ROUTES.create);
      }
    },
    [workspaceId, defaultProjectId, createTask, loadEvents, openDetail, setUtilityMode, navigate],
  );

  const handleQuickCreate = useCallback((): void => {
    const focus = focusedDate ?? anchorDate;
    void quickCreateAt(focus);
  }, [focusedDate, anchorDate, quickCreateAt]);

  const handlePrev = useCallback((): void => {
    const next = shiftAnchorForView(anchorDate, activeView, -1);
    setAnchorDate(next);
    setAnnouncement(formatDayLabel(next));
  }, [anchorDate, activeView, setAnchorDate]);

  const handleNext = useCallback((): void => {
    const next = shiftAnchorForView(anchorDate, activeView, 1);
    setAnchorDate(next);
    setAnnouncement(formatDayLabel(next));
  }, [anchorDate, activeView, setAnchorDate]);

  const handleToday = useCallback((): void => {
    goToday();
    setFocusedDate(startOfDay(Date.now()));
    setAnnouncement('Today');
  }, [goToday, setFocusedDate]);

  const handleViewChange = useCallback(
    (next: CalendarViewMode): void => {
      setView(next);
      setAnnouncement(`${next} view`);
    },
    [setView],
  );

  const handleSelectDate = useCallback(
    (dateMs: number): void => {
      setFocusedDate(startOfDay(dateMs));
      setAnchorDate(dateMs);
    },
    [setFocusedDate, setAnchorDate],
  );

  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent): void => {
      if (isTypingTarget(event.target)) {
        return;
      }

      const meta = event.metaKey || event.ctrlKey;
      const key = event.key.toLowerCase();

      if (meta && key === 'f') {
        event.preventDefault();
        const input = document.getElementById('calendar-search') as HTMLInputElement | null;
        input?.focus();
        input?.select();
        return;
      }

      if (event.key === 'Escape') {
        if (selectedIds.size > 0) {
          clearSelection();
          return;
        }
        if (query.trim()) {
          clearSearch();
        }
        return;
      }

      if (event.key === 'Enter' && focusedEventId) {
        const focused = events.find((item) => item.id === focusedEventId);
        if (focused) {
          event.preventDefault();
          openEvent(focused);
        }
        return;
      }

      if (key === 't') {
        event.preventDefault();
        handleToday();
        return;
      }

      if (key === 'c') {
        event.preventDefault();
        handleQuickCreate();
        return;
      }

      if (VIEW_HOTKEYS[key]) {
        event.preventDefault();
        handleViewChange(VIEW_HOTKEYS[key]!);
        return;
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        handlePrev();
        return;
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [
    selectedIds,
    clearSelection,
    query,
    clearSearch,
    focusedEventId,
    events,
    openEvent,
    handleToday,
    handleQuickCreate,
    handleViewChange,
    handlePrev,
    handleNext,
  ]);

  const liveAnnouncement = dragAnnouncement ?? announcement;
  const hasActiveFilters =
    Boolean(filters.query.trim()) ||
    filters.favoritesOnly ||
    filters.overdueOnly ||
    filters.pinnedOnly ||
    filters.completedOnly ||
    filters.projectIds.length > 0 ||
    filters.statuses.length > 0 ||
    filters.priorities.length > 0;

  const renderCenter = (): ReactElement => {
    if (isLoading) {
      return <CalendarSkeleton view={activeView} className="h-full" />;
    }

    if (
      visibleEvents.length === 0 &&
      activeView !== 'month' &&
      activeView !== 'week' &&
      activeView !== 'day'
    ) {
      return (
        <CalendarEmptyState
          variant={hasActiveFilters ? 'filtered' : 'none'}
          action={
            <Button type="button" size="sm" onClick={handleQuickCreate}>
              Create task
            </Button>
          }
        />
      );
    }

    switch (activeView) {
      case 'week':
        return (
          <WeekView
            anchorDate={anchorDate}
            events={visibleEvents}
            weekStartsOn={weekStartsOn}
            workdayStartHour={preferences.workdayStartHour}
            selectedEventIds={selectedIds}
            dimPastEvents={preferences.dimPastEvents}
            announcement={liveAnnouncement}
            onSelectDay={handleSelectDate}
            onOpenEvent={openEvent}
            onSelectEvent={handleSelectEvent}
            onPickupEvent={handlePickup}
            onMoveEvent={(taskId, startAt, endAt, eventIds) => {
              void handleMoveEvent(taskId, startAt, endAt, eventIds);
            }}
            onResize={(event, edge, nextMs) => {
              void handleResize(event, edge, nextMs);
            }}
            onCreateAt={(dateMs, hour) => {
              void quickCreateAt(dateMs, hour);
            }}
            className="h-full"
          />
        );
      case 'day':
        return (
          <DayView
            date={anchorDate}
            events={visibleEvents}
            workdayStartHour={preferences.workdayStartHour}
            selectedEventIds={selectedIds}
            dimPastEvents={preferences.dimPastEvents}
            announcement={liveAnnouncement}
            onOpenEvent={openEvent}
            onSelectEvent={handleSelectEvent}
            onPickupEvent={handlePickup}
            onMoveEvent={(taskId, startAt, endAt, eventIds) => {
              void handleMoveEvent(taskId, startAt, endAt, eventIds);
            }}
            onResize={(event, edge, nextMs) => {
              void handleResize(event, edge, nextMs);
            }}
            onCreateAt={(dateMs, hour) => {
              void quickCreateAt(dateMs, hour);
            }}
            className="h-full"
          />
        );
      case 'agenda':
        return (
          <AgendaList
            events={visibleEvents}
            selectedEventIds={selectedIds}
            dimPastEvents={preferences.dimPastEvents}
            onOpenEvent={openEvent}
            onSelectEvent={handleSelectEvent}
            className="h-full"
          />
        );
      case 'timeline':
        return (
          <Timeline
            rows={timelineRows}
            zoom={timelineZoom}
            anchorDate={anchorDate}
            milestones={milestones}
            selectedEventIds={selectedIds}
            onZoomChange={setTimelineZoom}
            onOpenEvent={openEvent}
            onSelectEvent={handleSelectEvent}
            onScrollLeftChange={setScrollLeft}
            className="h-full"
          />
        );
      case 'schedule':
        return (
          <ScheduleView
            anchorDate={anchorDate}
            events={visibleEvents}
            weekStartsOn={weekStartsOn}
            selectedEventIds={selectedIds}
            dimPastEvents={preferences.dimPastEvents}
            onOpenEvent={openEvent}
            onSelectEvent={handleSelectEvent}
            onSelectDay={handleSelectDate}
            className="h-full"
          />
        );
      case 'month':
      default:
        return (
          <CalendarGrid
            anchorDate={anchorDate}
            events={visibleEvents}
            weekStartsOn={weekStartsOn}
            showWeekends={preferences.showWeekends}
            selectedDate={focusedDate}
            selectedEventIds={selectedIds}
            dimPastEvents={preferences.dimPastEvents}
            announcement={liveAnnouncement}
            onSelectDate={handleSelectDate}
            onOpenEvent={openEvent}
            onSelectEvent={handleSelectEvent}
            onPickupEvent={handlePickup}
            onCreateAt={(dateMs) => {
              void quickCreateAt(dateMs);
            }}
            onMoveToDate={(taskId, dateMs, eventIds) => {
              void handleMoveToDate(taskId, dateMs, eventIds);
            }}
            className="h-full"
          />
        );
    }
  };

  return (
    <div className="flex h-full min-h-0 overflow-hidden bg-bg-app" data-testid="calendar-page">
      {!preferences.sidebarCollapsed ? (
        <aside
          className="hidden shrink-0 border-r border-border-default lg:block"
          style={{ width: CALENDAR_SIDEBAR_WIDTH }}
        >
          <CalendarSidebar
            events={events}
            upcoming={upcoming}
            overdue={overdue}
            favorites={favorites}
            filters={filters}
            anchorDate={anchorDate}
            selectedDate={focusedDate}
            weekStartsOn={weekStartsOn}
            onSelectDate={handleSelectDate}
            onMonthChange={setAnchorDate}
            onOpenEvent={openEvent}
            className="h-full"
          />
        </aside>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <h1 className="sr-only">Calendar</h1>
        <CalendarToolbar
          view={activeView}
          rangeLabel={rangeLabel}
          searchValue={query}
          filters={filters}
          announcement={liveAnnouncement}
          onViewChange={handleViewChange}
          onToday={handleToday}
          onPrev={handlePrev}
          onNext={handleNext}
          onSearchChange={setQuery}
          onFiltersChange={setFilters}
          onResetFilters={resetFilters}
          onQuickCreate={handleQuickCreate}
          onGoToDate={() => setGoToOpen(true)}
        />

        {error ? (
          <div className="px-3 pt-3">
            <Alert
              variant="danger"
              title="Calendar could not be loaded"
              dismissible
              onDismiss={clearError}
            >
              <Stack gap={12}>
                <span>{error}</span>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    clearError();
                    void loadEvents();
                  }}
                >
                  Retry
                </Button>
              </Stack>
            </Alert>
          </div>
        ) : null}

        <div className="min-h-0 flex-1 overflow-hidden">{renderCenter()}</div>
      </div>

      <CalendarDialog
        open={goToOpen}
        onOpenChange={setGoToOpen}
        initialDate={anchorDate}
        onConfirm={(dateMs) => {
          setAnchorDate(dateMs);
          setFocusedDate(startOfDay(dateMs));
          setAnnouncement(`Go to ${formatDayLabel(dateMs)}`);
        }}
      />
    </div>
  );
};

export type { CalendarPageProps };
