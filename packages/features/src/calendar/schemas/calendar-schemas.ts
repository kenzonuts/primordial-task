import { z } from 'zod';

import {
  CALENDAR_VIEWS,
  RECURRENCE_FREQUENCIES,
  TIMELINE_ZOOM_LEVELS,
} from '@features/calendar/types';

export const calendarViewSchema = z.enum(CALENDAR_VIEWS);

export const timelineZoomSchema = z.enum(TIMELINE_ZOOM_LEVELS);

export const recurrenceRuleSchema = z.object({
  frequency: z.enum(RECURRENCE_FREQUENCIES),
  interval: z.number().int().positive().default(1),
  byWeekday: z.array(z.number().int().min(0).max(6)).optional(),
  until: z.number().nullable().optional(),
  count: z.number().int().positive().nullable().optional(),
  rrulePlaceholder: z.string().optional(),
});

export const goToDateSchema = z.object({
  dateIso: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD format.'),
});

export const rescheduleEventSchema = z
  .object({
    startAt: z.number(),
    endAt: z.number(),
  })
  .superRefine((value, ctx) => {
    if (value.endAt < value.startAt) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'End must be on or after start.',
        path: ['endAt'],
      });
    }
  });

export type GoToDateFormValues = z.infer<typeof goToDateSchema>;
export type RescheduleEventFormValues = z.infer<typeof rescheduleEventSchema>;
export type RecurrenceRuleFormValues = z.infer<typeof recurrenceRuleSchema>;
