import { z } from 'zod';

import { TASK_STATUSES } from '@features/task/types';

export const boardNameSchema = z
  .string()
  .trim()
  .min(1, 'Enter a board name.')
  .max(80, 'Use at most 80 characters.');

export const boardDescriptionSchema = z
  .string()
  .trim()
  .max(500, 'Use at most 500 characters.')
  .optional()
  .or(z.literal(''));

export const columnNameSchema = z
  .string()
  .trim()
  .min(1, 'Enter a column name.')
  .max(60, 'Use at most 60 characters.');

export const createBoardSchema = z.object({
  projectId: z.string().min(1, 'Select a project.'),
  name: boardNameSchema,
  description: boardDescriptionSchema,
  templateId: z
    .enum(['software_delivery', 'bug_triage', 'content', 'blank'])
    .default('software_delivery'),
});

export const updateBoardSchema = createBoardSchema.partial().extend({
  name: boardNameSchema.optional(),
  projectId: z.string().min(1).optional(),
});

export const createColumnSchema = z.object({
  name: columnNameSchema,
  mappedStatus: z.enum(TASK_STATUSES),
  description: z.string().trim().max(200).optional().or(z.literal('')),
  wipLimit: z.number().int().positive().nullable().optional(),
});

export const renameColumnSchema = z.object({
  name: columnNameSchema,
});

export type CreateBoardFormValues = z.infer<typeof createBoardSchema>;
export type UpdateBoardFormValues = z.infer<typeof updateBoardSchema>;
export type CreateColumnFormValues = z.infer<typeof createColumnSchema>;
