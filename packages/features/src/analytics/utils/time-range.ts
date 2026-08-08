import type { AnalyticsTimeRange, TimeRangePreset } from '@features/analytics/types';

const MS_DAY = 24 * 60 * 60 * 1000;

const startOfDay = (ms: number): number => {
  const date = new Date(ms);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};

const endOfDay = (ms: number): number => {
  const date = new Date(ms);
  date.setHours(23, 59, 59, 999);
  return date.getTime();
};

const startOfWeek = (ms: number): number => {
  const date = new Date(startOfDay(ms));
  const day = date.getDay();
  const diff = (day + 6) % 7; // Monday start
  date.setDate(date.getDate() - diff);
  return date.getTime();
};

const endOfWeek = (ms: number): number => endOfDay(startOfWeek(ms) + 6 * MS_DAY);

const startOfMonth = (ms: number): number => {
  const date = new Date(ms);
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};

const endOfMonth = (ms: number): number => {
  const date = new Date(ms);
  date.setMonth(date.getMonth() + 1, 0);
  date.setHours(23, 59, 59, 999);
  return date.getTime();
};

const startOfQuarter = (ms: number): number => {
  const date = new Date(ms);
  const quarter = Math.floor(date.getMonth() / 3) * 3;
  date.setMonth(quarter, 1);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};

const startOfYear = (ms: number): number => {
  const date = new Date(ms);
  date.setMonth(0, 1);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};

const duration = (start: number, end: number): number => end - start + 1;

/**
 * Resolve preset to absolute local-time range + previous comparable period.
 */
export const resolveTimeRange = (
  preset: TimeRangePreset,
  now = Date.now(),
  customStart?: number | null,
  customEnd?: number | null,
): AnalyticsTimeRange => {
  let start: number;
  let end: number;

  switch (preset) {
    case 'today':
      start = startOfDay(now);
      end = endOfDay(now);
      break;
    case 'yesterday': {
      const y = now - MS_DAY;
      start = startOfDay(y);
      end = endOfDay(y);
      break;
    }
    case 'this_week':
      start = startOfWeek(now);
      end = endOfWeek(now);
      break;
    case 'last_week': {
      const last = startOfWeek(now) - MS_DAY;
      start = startOfWeek(last);
      end = endOfWeek(last);
      break;
    }
    case 'last_7_days':
      end = endOfDay(now);
      start = startOfDay(now - 6 * MS_DAY);
      break;
    case 'last_30_days':
      end = endOfDay(now);
      start = startOfDay(now - 29 * MS_DAY);
      break;
    case 'this_month':
      start = startOfMonth(now);
      end = endOfMonth(now);
      break;
    case 'last_month': {
      const prev = startOfMonth(now) - MS_DAY;
      start = startOfMonth(prev);
      end = endOfMonth(prev);
      break;
    }
    case 'this_quarter':
      start = startOfQuarter(now);
      end = endOfDay(now);
      break;
    case 'this_year':
      start = startOfYear(now);
      end = endOfDay(now);
      break;
    case 'custom':
      start = startOfDay(customStart ?? now - 29 * MS_DAY);
      end = endOfDay(customEnd ?? now);
      break;
    default:
      end = endOfDay(now);
      start = startOfDay(now - 29 * MS_DAY);
  }

  const len = duration(start, end);
  const previousEnd = start - 1;
  const previousStart = previousEnd - len + 1;

  return {
    preset,
    start,
    end,
    previousStart,
    previousEnd,
  };
};

export const TIME_RANGE_LABELS: Record<TimeRangePreset, string> = {
  today: 'Today',
  yesterday: 'Yesterday',
  this_week: 'This Week',
  last_week: 'Last Week',
  last_7_days: 'Last 7 Days',
  last_30_days: 'Last 30 Days',
  this_month: 'This Month',
  last_month: 'Last Month',
  this_quarter: 'This Quarter',
  this_year: 'This Year',
  custom: 'Custom Range',
};

export const formatRangeLabel = (range: AnalyticsTimeRange): string => {
  const fmt = (ms: number): string =>
    new Date(ms).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  return `${fmt(range.start)} – ${fmt(range.end)}`;
};

export { startOfDay, endOfDay, MS_DAY };
