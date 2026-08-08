import { describe, expect, it } from 'vitest';

import {
  addDays,
  buildMonthGrid,
  parseDateIso,
  shiftAnchorForView,
  startOfDay,
  startOfWeek,
  toDateIso,
  visibleRangeForView,
} from '@features/calendar/utils/date-utils';

describe('calendar date utils', () => {
  it('normalizes start of day and ISO round-trip', () => {
    const ms = parseDateIso('2026-08-08');
    expect(toDateIso(startOfDay(ms))).toBe('2026-08-08');
    expect(toDateIso(addDays(ms, 1))).toBe('2026-08-09');
  });

  it('builds a 42-cell month grid aligned to Monday', () => {
    const cells = buildMonthGrid(parseDateIso('2026-08-08'), 1);
    expect(cells).toHaveLength(42);
    expect(new Date(cells[0]!.date).getDay()).toBe(1);
    expect(cells.some((cell) => cell.iso === '2026-08-08' && cell.inCurrentMonth)).toBe(true);
  });

  it('starts weeks on Monday when configured', () => {
    const monday = startOfWeek(parseDateIso('2026-08-08'), 1);
    expect(new Date(monday).getDay()).toBe(1);
  });

  it('shifts month and week anchors', () => {
    const august = parseDateIso('2026-08-15');
    expect(toDateIso(shiftAnchorForView(august, 'month', 1)).startsWith('2026-09')).toBe(true);
    expect(toDateIso(shiftAnchorForView(august, 'week', -1))).toBe('2026-08-08');
  });

  it('computes visible ranges for month and day views', () => {
    const anchor = parseDateIso('2026-08-08');
    const month = visibleRangeForView('month', anchor, 1);
    const day = visibleRangeForView('day', anchor, 1);

    expect(month.end).toBeGreaterThan(month.start);
    expect(toDateIso(day.start)).toBe('2026-08-08');
    expect(toDateIso(day.end)).toBe('2026-08-08');
  });
});
