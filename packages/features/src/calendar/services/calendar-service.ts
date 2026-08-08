import { MIN_EVENT_DURATION_MS } from '@features/calendar/constants';
import { DEFAULT_CALENDAR_PREFERENCES } from '@features/calendar/constants';
import type {
  CalendarDependencyIndicator,
  CalendarEvent,
  CalendarFiltersState,
  CalendarMilestone,
  CalendarPreferences,
  DaySummary,
  RecurrenceRule,
  TaskToEventMapper,
  TimelineRowModel,
} from '@features/calendar/types';
import { endOfDay, isSameDay, startOfDay } from '@features/calendar/utils/date-utils';
import { createTaskService } from '@features/task/services/task-service';
import type { Task } from '@features/task/types';

const PREFS_KEY = 'primordial-calendar-preferences-v1';
const RECURRENCE_KEY = 'primordial-calendar-recurrence-v1';

const delay = async (ms = 80): Promise<void> => {
  await new Promise((resolve) => {
    globalThis.setTimeout(resolve, ms);
  });
};

const checklistProgress = (task: Task): number => {
  if (task.checklistTotal <= 0) {
    return 0;
  }
  return Math.round((task.checklistCompleted / task.checklistTotal) * 100);
};

/**
 * Maps a Task Engine task into a calendar event projection.
 * Tasks without start or due dates are excluded.
 */
export const mapTaskToCalendarEvent: TaskToEventMapper = (task, now = Date.now()) => {
  if (task.archivedAt && task.status === 'archived') {
    // still allow if filters want archived — mapper includes them; filter layer decides
  }

  const startSource = task.startDate ?? task.dueDate;
  const endSource = task.dueDate ?? task.startDate;
  if (startSource == null && endSource == null) {
    return null;
  }

  const startAt = startOfDay(startSource ?? endSource!);
  let endAt = endOfDay(endSource ?? startSource!);
  if (endAt < startAt) {
    endAt = startAt + MIN_EVENT_DURATION_MS;
  }

  const allDay =
    task.startDate == null ||
    task.dueDate == null ||
    (startOfDay(startAt) === startAt && endOfDay(endAt) === endAt);

  return {
    id: `evt-${task.id}`,
    taskId: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    projectId: task.projectId,
    projectName: task.projectName,
    workspaceId: task.workspaceId,
    assigneeName: task.assignee?.fullName ?? null,
    assigneeId: task.assignee?.id ?? null,
    labels: task.labels.map((label) => label.name),
    tags: [...task.tags],
    startAt,
    endAt,
    allDay,
    progress: checklistProgress(task),
    completed: task.status === 'completed',
    isFavorite: task.isFavorite,
    isPinned: task.isPinned,
    isOverdue:
      !task.completedDate &&
      task.status !== 'completed' &&
      task.status !== 'cancelled' &&
      endAt < now,
    checklistProgress: checklistProgress(task),
    recurrence: null,
  };
};

export const emptyCalendarFilters = (): CalendarFiltersState => ({
  query: '',
  projectIds: [],
  statuses: [],
  priorities: [],
  assigneeIds: [],
  labels: [],
  tags: [],
  favoritesOnly: false,
  pinnedOnly: false,
  archivedOnly: false,
  completedOnly: false,
  overdueOnly: false,
});

export const filterCalendarEvents = (
  events: readonly CalendarEvent[],
  filters: CalendarFiltersState,
): CalendarEvent[] => {
  let items = [...events];
  const query = filters.query.trim().toLowerCase();

  if (!filters.archivedOnly) {
    items = items.filter((event) => event.status !== 'archived');
  }
  if (!filters.completedOnly) {
    // show completed unless explicitly filtering only completed — prefs handle dimming
  }
  if (filters.completedOnly) {
    items = items.filter((event) => event.completed);
  }
  if (filters.favoritesOnly) {
    items = items.filter((event) => event.isFavorite);
  }
  if (filters.pinnedOnly) {
    items = items.filter((event) => event.isPinned);
  }
  if (filters.overdueOnly) {
    items = items.filter((event) => event.isOverdue);
  }
  if (filters.projectIds.length > 0) {
    items = items.filter((event) => filters.projectIds.includes(event.projectId));
  }
  if (filters.statuses.length > 0) {
    items = items.filter((event) => filters.statuses.includes(event.status));
  }
  if (filters.priorities.length > 0) {
    items = items.filter((event) => filters.priorities.includes(event.priority));
  }
  if (filters.assigneeIds.length > 0) {
    items = items.filter(
      (event) => event.assigneeId !== null && filters.assigneeIds.includes(event.assigneeId),
    );
  }
  if (filters.labels.length > 0) {
    items = items.filter((event) => event.labels.some((label) => filters.labels.includes(label)));
  }
  if (filters.tags.length > 0) {
    items = items.filter((event) => event.tags.some((tag) => filters.tags.includes(tag)));
  }
  if (query) {
    items = items.filter(
      (event) =>
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.projectName.toLowerCase().includes(query) ||
        event.taskId.toLowerCase().includes(query) ||
        event.workspaceId.toLowerCase().includes(query),
    );
  }
  return items;
};

export const eventsInRange = (
  events: readonly CalendarEvent[],
  start: number,
  end: number,
): CalendarEvent[] => {
  return events.filter((event) => event.endAt >= start && event.startAt <= end);
};

export const eventsOnDay = (events: readonly CalendarEvent[], day: number): CalendarEvent[] => {
  return events.filter((event) => event.startAt <= endOfDay(day) && event.endAt >= startOfDay(day));
};

export class CalendarProjectionService {
  private readonly taskService = createTaskService();

  async listEvents(workspaceId: string): Promise<CalendarEvent[]> {
    await delay();
    const tasks = await this.taskService.listTasks(workspaceId);
    const recurrenceMap = this.readRecurrenceMap();
    return tasks
      .map((task) => {
        const event = mapTaskToCalendarEvent(task);
        if (!event) {
          return null;
        }
        const recurrence = recurrenceMap[task.id] ?? null;
        return recurrence ? { ...event, recurrence } : event;
      })
      .filter((event): event is CalendarEvent => event !== null)
      .sort((a, b) => a.startAt - b.startAt);
  }

  /**
   * Reschedule via Task Engine — calendar never owns dates.
   */
  async rescheduleTask(
    workspaceId: string,
    taskId: string,
    startAt: number,
    endAt: number,
  ): Promise<Task> {
    await delay(60);
    if (endAt < startAt) {
      throw new Error('End must be on or after start.');
    }
    const duration = Math.max(endAt - startAt, MIN_EVENT_DURATION_MS);
    return this.taskService.updateTask(workspaceId, taskId, {
      startDate: startOfDay(startAt),
      dueDate: endOfDay(startAt + duration - 1),
    });
  }

  async moveTaskByDays(workspaceId: string, taskId: string, dayDelta: number): Promise<Task> {
    const task = await this.taskService.getTask(workspaceId, taskId);
    if (!task) {
      throw new Error('Task not found.');
    }
    const start = (task.startDate ?? task.dueDate ?? Date.now()) + dayDelta * 24 * 60 * 60 * 1000;
    const end = (task.dueDate ?? task.startDate ?? Date.now()) + dayDelta * 24 * 60 * 60 * 1000;
    return this.rescheduleTask(workspaceId, taskId, start, end);
  }

  async resizeTask(
    workspaceId: string,
    taskId: string,
    edge: 'start' | 'end',
    nextMs: number,
  ): Promise<Task> {
    const task = await this.taskService.getTask(workspaceId, taskId);
    if (!task) {
      throw new Error('Task not found.');
    }
    const start = task.startDate ?? task.dueDate ?? Date.now();
    const end = task.dueDate ?? task.startDate ?? Date.now();
    if (edge === 'start') {
      return this.rescheduleTask(
        workspaceId,
        taskId,
        nextMs,
        Math.max(end, nextMs + MIN_EVENT_DURATION_MS),
      );
    }
    return this.rescheduleTask(
      workspaceId,
      taskId,
      start,
      Math.max(nextMs, start + MIN_EVENT_DURATION_MS),
    );
  }

  /** Milestone foundation — derived placeholders from project due labels / pinned tasks. */
  async listMilestones(workspaceId: string): Promise<CalendarMilestone[]> {
    await delay(40);
    const tasks = await this.taskService.listTasks(workspaceId);
    return tasks
      .filter((task) => task.type === 'epic' && task.dueDate != null)
      .map((task) => ({
        id: `ms-${task.id}`,
        projectId: task.projectId,
        title: task.title,
        at: task.dueDate!,
      }));
  }

  /** Dependency indicators foundation — soft links only, no graph engine. */
  async listDependencyIndicators(
    workspaceId: string,
    taskIds: readonly string[],
  ): Promise<CalendarDependencyIndicator[]> {
    await delay(40);
    const indicators: CalendarDependencyIndicator[] = [];
    for (const taskId of taskIds) {
      const deps = await this.taskService.listDependencies(workspaceId, taskId);
      for (const dep of deps) {
        if (dep.type === 'blocks' || dep.type === 'blocked_by') {
          indicators.push({
            id: dep.id,
            fromTaskId: dep.type === 'blocks' ? taskId : dep.relatedTaskId,
            toTaskId: dep.type === 'blocks' ? dep.relatedTaskId : taskId,
            soft: true,
          });
        }
      }
    }
    return indicators;
  }

  buildTimelineRows(
    events: readonly CalendarEvent[],
    groupBy: 'project' | 'assignee' | 'none',
  ): TimelineRowModel[] {
    if (groupBy === 'none') {
      return [{ id: 'all', label: 'All tasks', groupKey: 'all', events }];
    }
    const map = new Map<string, TimelineRowModel>();
    for (const event of events) {
      const key = groupBy === 'project' ? event.projectId : (event.assigneeId ?? 'unassigned');
      const label =
        groupBy === 'project' ? event.projectName : (event.assigneeName ?? 'Unassigned');
      const existing = map.get(key);
      if (existing) {
        map.set(key, { ...existing, events: [...existing.events, event] });
      } else {
        map.set(key, { id: key, label, groupKey: key, events: [event] });
      }
    }
    return [...map.values()].sort((a, b) => a.label.localeCompare(b.label));
  }

  buildDaySummary(events: readonly CalendarEvent[], date: number): DaySummary {
    const dayEvents = eventsOnDay(events, date);
    return {
      date: startOfDay(date),
      eventCount: dayEvents.length,
      overdueCount: dayEvents.filter((event) => event.isOverdue).length,
      completedCount: dayEvents.filter((event) => event.completed).length,
      events: dayEvents,
    };
  }

  upcoming(events: readonly CalendarEvent[], now = Date.now(), limit = 8): CalendarEvent[] {
    return events
      .filter((event) => !event.completed && event.endAt >= startOfDay(now))
      .sort((a, b) => a.startAt - b.startAt)
      .slice(0, limit);
  }

  overdue(events: readonly CalendarEvent[]): CalendarEvent[] {
    return events
      .filter((event) => event.isOverdue && !event.completed)
      .sort((a, b) => a.endAt - b.endAt);
  }

  favorites(events: readonly CalendarEvent[]): CalendarEvent[] {
    return events.filter((event) => event.isFavorite);
  }

  async getPreferences(): Promise<CalendarPreferences> {
    try {
      const raw = globalThis.localStorage?.getItem(PREFS_KEY);
      if (!raw) {
        return { ...DEFAULT_CALENDAR_PREFERENCES };
      }
      return {
        ...DEFAULT_CALENDAR_PREFERENCES,
        ...(JSON.parse(raw) as Partial<CalendarPreferences>),
      };
    } catch {
      return { ...DEFAULT_CALENDAR_PREFERENCES };
    }
  }

  async updatePreferences(prefs: Partial<CalendarPreferences>): Promise<CalendarPreferences> {
    const next = { ...(await this.getPreferences()), ...prefs };
    try {
      globalThis.localStorage?.setItem(PREFS_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
    return next;
  }

  /**
   * Attach recurrence rule metadata only — no expansion engine.
   */
  async setRecurrenceRule(taskId: string, rule: RecurrenceRule | null): Promise<void> {
    const map = this.readRecurrenceMap();
    if (rule == null) {
      delete map[taskId];
    } else {
      map[taskId] = rule;
    }
    try {
      globalThis.localStorage?.setItem(RECURRENCE_KEY, JSON.stringify(map));
    } catch {
      // ignore
    }
  }

  private readRecurrenceMap(): Record<string, RecurrenceRule> {
    try {
      const raw = globalThis.localStorage?.getItem(RECURRENCE_KEY);
      if (!raw) {
        return {};
      }
      return JSON.parse(raw) as Record<string, RecurrenceRule>;
    } catch {
      return {};
    }
  }
}

export const createCalendarService = (): CalendarProjectionService =>
  new CalendarProjectionService();

export const __resetCalendarStorageForTests = (): void => {
  try {
    globalThis.localStorage?.removeItem(PREFS_KEY);
    globalThis.localStorage?.removeItem(RECURRENCE_KEY);
  } catch {
    // ignore
  }
};

export { isSameDay };
