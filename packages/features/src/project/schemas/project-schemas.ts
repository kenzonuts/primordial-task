import { z } from 'zod';

import { PROJECT_COLORS, PROJECT_ICONS } from '@features/project/constants';
import { PROJECT_STATUSES, PROJECT_VISIBILITIES } from '@features/project/types';

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const projectNameSchema = z
  .string()
  .trim()
  .min(1, 'Enter a project name.')
  .min(2, 'Use at least 2 characters.')
  .max(120, 'Use at most 120 characters.');

export const projectSlugSchema = z
  .string()
  .trim()
  .min(1, 'Enter a project slug.')
  .min(2, 'Use at least 2 characters.')
  .max(64, 'Use at most 64 characters.')
  .regex(slugPattern, 'Use lowercase letters, numbers, and hyphens only.');

export const projectDescriptionSchema = z
  .string()
  .trim()
  .max(500, 'Use at most 500 characters.')
  .optional()
  .or(z.literal(''));

export const projectColorSchema = z
  .string()
  .refine(
    (value) =>
      (PROJECT_COLORS as readonly string[]).includes(value) || /^#[0-9A-Fa-f]{6}$/.test(value),
    'Choose a valid color.',
  );

export const projectIconSchema = z
  .string()
  .refine(
    (value) => !value || (PROJECT_ICONS as readonly string[]).includes(value),
    'Choose a valid icon.',
  )
  .optional()
  .or(z.literal(''));

export const projectStatusSchema = z.enum(PROJECT_STATUSES);

export const projectVisibilitySchema = z.enum(PROJECT_VISIBILITIES);

export const createProjectSchema = z.object({
  name: projectNameSchema,
  slug: projectSlugSchema,
  description: projectDescriptionSchema,
  icon: projectIconSchema,
  coverUrl: z.string().trim().url('Enter a valid cover URL.').optional().or(z.literal('')),
  color: projectColorSchema,
  status: projectStatusSchema,
  visibility: projectVisibilitySchema,
});

export const updateProjectSchema = createProjectSchema.partial().extend({
  name: projectNameSchema.optional(),
  slug: projectSlugSchema.optional(),
});

export type CreateProjectFormValues = z.infer<typeof createProjectSchema>;
export type UpdateProjectFormValues = z.infer<typeof updateProjectSchema>;

export const slugifyProjectName = (name: string): string => {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
};
