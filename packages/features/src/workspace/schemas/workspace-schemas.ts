import { z } from 'zod';

import { WORKSPACE_COLORS } from '@features/workspace/rbac';

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const workspaceNameSchema = z
  .string()
  .trim()
  .min(1, 'Enter a workspace name.')
  .min(2, 'Use at least 2 characters.')
  .max(80, 'Use at most 80 characters.');

export const workspaceSlugSchema = z
  .string()
  .trim()
  .min(1, 'Enter a workspace slug.')
  .min(2, 'Use at least 2 characters.')
  .max(48, 'Use at most 48 characters.')
  .regex(slugPattern, 'Use lowercase letters, numbers, and hyphens only.');

export const workspaceDescriptionSchema = z
  .string()
  .trim()
  .max(280, 'Use at most 280 characters.')
  .optional()
  .or(z.literal(''));

export const workspaceColorSchema = z
  .string()
  .refine(
    (value) =>
      (WORKSPACE_COLORS as readonly string[]).includes(value) || /^#[0-9A-Fa-f]{6}$/.test(value),
    'Choose a valid color.',
  );

export const workspaceLogoUrlSchema = z
  .string()
  .trim()
  .url('Enter a valid logo URL.')
  .optional()
  .or(z.literal(''));

export const createWorkspaceSchema = z.object({
  name: workspaceNameSchema,
  slug: workspaceSlugSchema,
  description: workspaceDescriptionSchema,
  color: workspaceColorSchema,
  logoUrl: workspaceLogoUrlSchema,
  visibility: z.enum(['private', 'team', 'public']),
});

export const updateWorkspaceSchema = createWorkspaceSchema.partial().extend({
  name: workspaceNameSchema.optional(),
  slug: workspaceSlugSchema.optional(),
});

export const inviteMemberSchema = z.object({
  email: z.string().trim().min(1, 'Enter an email.').email('Enter a valid email address.'),
  role: z.enum(['administrator', 'member', 'viewer', 'guest']),
});

export type CreateWorkspaceFormValues = z.infer<typeof createWorkspaceSchema>;
export type UpdateWorkspaceFormValues = z.infer<typeof updateWorkspaceSchema>;
export type InviteMemberFormValues = z.infer<typeof inviteMemberSchema>;

export const slugifyWorkspaceName = (name: string): string => {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
};
