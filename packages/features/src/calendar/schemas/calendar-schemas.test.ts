import { describe, expect, it } from 'vitest';

import {
  calendarViewSchema,
  goToDateSchema,
  recurrenceRuleSchema,
  rescheduleEventSchema,
  timelineZoomSchema,
} from '@features/calendar/schemas/calendar-schemas';

describe('calendar validation schemas', () => {
  it('accepts known calendar views', () => {
    expect(calendarViewSchema.parse('month')).toBe('month');
    expect(calendarViewSchema.parse('timeline')).toBe('timeline');
    expect(calendarViewSchema.parse('schedule')).toBe('schedule');
  });

  it('rejects unknown calendar views', () => {
    expect(calendarViewSchema.safeParse('gantt').success).toBe(false);
  });

  it('accepts timeline zoom levels', () => {
    expect(timelineZoomSchema.parse('week')).toBe('week');
    expect(timelineZoomSchema.parse('quarter')).toBe('quarter');
  });

  it('validates go-to-date ISO strings', () => {
    expect(goToDateSchema.parse({ dateIso: '2026-08-08' }).dateIso).toBe('2026-08-08');
    expect(goToDateSchema.safeParse({ dateIso: '08-08-2026' }).success).toBe(false);
  });

  it('requires end on or after start for reschedule', () => {
    const ok = rescheduleEventSchema.parse({ startAt: 1000, endAt: 2000 });
    expect(ok.endAt).toBe(2000);

    const bad = rescheduleEventSchema.safeParse({ startAt: 2000, endAt: 1000 });
    expect(bad.success).toBe(false);
  });

  it('validates recurrence rule foundation payloads', () => {
    const parsed = recurrenceRuleSchema.parse({
      frequency: 'weekly',
      interval: 2,
      byWeekday: [1, 3],
    });

    expect(parsed.frequency).toBe('weekly');
    expect(parsed.interval).toBe(2);
    expect(parsed.byWeekday).toEqual([1, 3]);
  });

  it('defaults recurrence interval to 1', () => {
    const parsed = recurrenceRuleSchema.parse({ frequency: 'daily' });
    expect(parsed.interval).toBe(1);
  });
});
