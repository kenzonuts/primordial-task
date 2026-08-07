import { z } from 'zod';

import { TASK_PRIORITIES, TASK_STATUSES, TASK_TYPES } from '@features/task/types';

export const taskTitleSchema = z
  .string()
  .trim()
  .min(1, 'Enter a task title.')
  .max(160, 'Use at most 160 characters.');

export const taskDescriptionSchema = z
  .string()
  .trim()
  .max(10_000, 'Use at most 10,000 characters.')
  .optional()
  .or(z.literal(''));

export const taskStatusSchema = z.enum(TASK_STATUSES);

export const taskPrioritySchema = z.enum(TASK_PRIORITIES);

export const taskTypeSchema = z.enum(TASK_TYPES);

export const taskDateSchema = z.number().nullable().optional();

export const taskLabelSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1).max(40),
  color: z.string().min(1),
});

export const taskTagsSchema = z.array(z.string().trim().min(1).max(40)).max(20);

const refineTaskDates = <T extends { startDate?: number | null; dueDate?: number | null }>(
  value: T,
  ctx: z.RefinementCtx,
): void => {
  if (value.startDate != null && value.dueDate != null && value.dueDate < value.startDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Due date must be on or after the start date.',
      path: ['dueDate'],
    });
  }
};

const createTaskObjectSchema = z.object({
  projectId: z.string().min(1, 'Select a project.'),
  parentTaskId: z.string().nullable().optional(),
  title: taskTitleSchema,
  description: taskDescriptionSchema,
  status: taskStatusSchema,
  priority: taskPrioritySchema,
  type: taskTypeSchema,
  assigneeId: z.string().nullable().optional(),
  startDate: taskDateSchema,
  dueDate: taskDateSchema,
  estimatedMinutes: z.number().int().nonnegative().nullable().optional(),
  labels: z.array(taskLabelSchema).optional(),
  tags: taskTagsSchema.optional(),
});

export const createTaskSchema = createTaskObjectSchema.superRefine(refineTaskDates);

export const updateTaskSchema = createTaskObjectSchema
  .partial()
  .extend({
    title: taskTitleSchema.optional(),
    projectId: z.string().min(1).optional(),
    actualMinutes: z.number().int().nonnegative().nullable().optional(),
  })
  .superRefine(refineTaskDates);

export const quickCreateTaskSchema = z.object({
  title: taskTitleSchema,
  projectId: z.string().min(1).optional(),
});

export const checklistCreateSchema = z.object({
  title: z.string().trim().min(1, 'Enter a checklist item.').max(200),
});

export const commentCreateSchema = z.object({
  body: z.string().trim().min(1, 'Enter a comment.').max(4000),
  parentId: z.string().nullable().optional(),
});

export type CreateTaskFormValues = z.infer<typeof createTaskSchema>;
export type UpdateTaskFormValues = z.infer<typeof updateTaskSchema>;
export type QuickCreateTaskFormValues = z.infer<typeof quickCreateTaskSchema>;
