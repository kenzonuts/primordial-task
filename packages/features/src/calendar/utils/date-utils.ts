/**
 * Pure date utilities for Calendar & Timeline.
 * All timestamps are epoch milliseconds in local timezone interpretation.
 */

const MS_DAY = 24 * 60 * 60 * 1000;

export const startOfDay = (ms: number): number => {
  const date = new Date(ms);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};

export const endOfDay = (ms: number): number => {
  const date = new Date(ms);
  date.setHours(23, 59, 59, 999);
  return date.getTime();
};

export const addDays = (ms: number, days: number): number => ms + days * MS_DAY;

export const addMonths = (ms: number, months: number): number => {
  const date = new Date(ms);
  date.setMonth(date.getMonth() + months);
  return date.getTime();
};

export const startOfWeek = (ms: number, weekStartsOn: 0 | 1 = 1): number => {
  const date = new Date(startOfDay(ms));
  const day = date.getDay();
  const diff = weekStartsOn === 1 ? (day + 6) % 7 : day;
  date.setDate(date.getDate() - diff);
  return date.getTime();
};

export const endOfWeek = (ms: number, weekStartsOn: 0 | 1 = 1): number => {
  return endOfDay(addDays(startOfWeek(ms, weekStartsOn), 6));
};

export const startOfMonth = (ms: number): number => {
  const date = new Date(ms);
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};

export const endOfMonth = (ms: number): number => {
  const date = new Date(ms);
  date.setMonth(date.getMonth() + 1, 0);
  date.setHours(23, 59, 59, 999);
  return date.getTime();
};

export const isSameDay = (a: number, b: number): boolean => startOfDay(a) === startOfDay(b);

export const isToday = (ms: number, now = Date.now()): boolean => isSameDay(ms, now);

export const toDateIso = (ms: number): string => {
  const date = new Date(ms);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const parseDateIso = (iso: string): number => {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year!, (month ?? 1) - 1, day ?? 1).getTime();
};

export const formatMonthYear = (ms: number): string => {
  return new Date(ms).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
};

export const formatDayLabel = (ms: number): string => {
  return new Date(ms).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

export const formatTime = (ms: number): string => {
  return new Date(ms).toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
};

export const formatRangeLabel = (start: number, end: number): string => {
  const startLabel = new Date(start).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
  const endLabel = new Date(end).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  return `${startLabel} – ${endLabel}`;
};

export interface CalendarCell {
  readonly date: number;
  readonly inCurrentMonth: boolean;
  readonly iso: string;
}

/** 6-week month grid (42 cells) aligned to weekStartsOn. */
export const buildMonthGrid = (anchor: number, weekStartsOn: 0 | 1 = 1): CalendarCell[] => {
  const monthStart = startOfMonth(anchor);
  const gridStart = startOfWeek(monthStart, weekStartsOn);
  const cells: CalendarCell[] = [];
  for (let index = 0; index < 42; index += 1) {
    const date = addDays(gridStart, index);
    cells.push({
      date,
      inCurrentMonth: new Date(date).getMonth() === new Date(monthStart).getMonth(),
      iso: toDateIso(date),
    });
  }
  return cells;
};

export const buildWeekDays = (anchor: number, weekStartsOn: 0 | 1 = 1): number[] => {
  const start = startOfWeek(anchor, weekStartsOn);
  return Array.from({ length: 7 }, (_, index) => addDays(start, index));
};

export const hoursInDay = (): number[] => Array.from({ length: 24 }, (_, hour) => hour);

export const resolvePresetRange = (
  preset: string,
  now = Date.now(),
  weekStartsOn: 0 | 1 = 1,
): { start: number; end: number } => {
  switch (preset) {
    case 'today':
      return { start: startOfDay(now), end: endOfDay(now) };
    case 'tomorrow': {
      const tomorrow = addDays(now, 1);
      return { start: startOfDay(tomorrow), end: endOfDay(tomorrow) };
    }
    case 'yesterday': {
      const yesterday = addDays(now, -1);
      return { start: startOfDay(yesterday), end: endOfDay(yesterday) };
    }
    case 'this_week':
      return { start: startOfWeek(now, weekStartsOn), end: endOfWeek(now, weekStartsOn) };
    case 'next_week': {
      const next = addDays(now, 7);
      return { start: startOfWeek(next, weekStartsOn), end: endOfWeek(next, weekStartsOn) };
    }
    case 'this_month':
      return { start: startOfMonth(now), end: endOfMonth(now) };
    case 'next_month': {
      const next = addMonths(now, 1);
      return { start: startOfMonth(next), end: endOfMonth(next) };
    }
    default:
      return { start: startOfWeek(now, weekStartsOn), end: endOfWeek(now, weekStartsOn) };
  }
};

export const shiftAnchorForView = (anchor: number, view: string, direction: 1 | -1): number => {
  if (view === 'month' || view === 'timeline' || view === 'schedule') {
    return addMonths(anchor, direction);
  }
  if (view === 'week') {
    return addDays(anchor, direction * 7);
  }
  return addDays(anchor, direction);
};

export const visibleRangeForView = (
  view: string,
  anchor: number,
  weekStartsOn: 0 | 1 = 1,
): { start: number; end: number } => {
  if (view === 'month') {
    const gridStart = startOfWeek(startOfMonth(anchor), weekStartsOn);
    return { start: gridStart, end: endOfDay(addDays(gridStart, 41)) };
  }
  if (view === 'week' || view === 'schedule') {
    return { start: startOfWeek(anchor, weekStartsOn), end: endOfWeek(anchor, weekStartsOn) };
  }
  if (view === 'day') {
    return { start: startOfDay(anchor), end: endOfDay(anchor) };
  }
  if (view === 'agenda') {
    return { start: startOfDay(anchor), end: endOfDay(addDays(anchor, 30)) };
  }
  // timeline — show ~1 month around anchor depending on zoom handled separately
  return { start: startOfMonth(anchor), end: endOfMonth(addMonths(anchor, 1)) };
};

export const timelineColumnWidth = (zoom: string): number => {
  switch (zoom) {
    case 'day':
      return 48;
    case 'week':
      return 28;
    case 'month':
      return 12;
    case 'quarter':
      return 6;
    default:
      return 28;
  }
};

export const timelineSpanDays = (zoom: string): number => {
  switch (zoom) {
    case 'day':
      return 14;
    case 'week':
      return 42;
    case 'month':
      return 90;
    case 'quarter':
      return 180;
    default:
      return 42;
  }
};
