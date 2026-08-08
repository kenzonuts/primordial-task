import { z } from 'zod';

import { FOLDER_NAME_RESERVED } from '@features/notes/constants';
import { NOTE_TYPES, NOTE_VISIBILITIES, PUBLISH_STATUSES } from '@features/notes/types';

export const noteTitleSchema = z
  .string()
  .trim()
  .min(1, 'Enter a title.')
  .max(200, 'Use at most 200 characters.')
  .or(z.literal('Untitled'));

export const folderNameSchema = z
  .string()
  .trim()
  .min(1, 'Enter a folder name.')
  .max(80, 'Use at most 80 characters.')
  .refine((value) => !FOLDER_NAME_RESERVED.test(value), {
    message: 'Folder name cannot include reserved characters.',
  });

export const createNoteSchema = z.object({
  title: z.string().trim().max(200).optional().or(z.literal('')),
  folderId: z.string().nullable().optional(),
  projectId: z.string().nullable().optional(),
  templateId: z.string().nullable().optional(),
  noteType: z.enum(NOTE_TYPES).optional(),
  isDocumentation: z.boolean().optional(),
});

export const createFolderSchema = z.object({
  name: folderNameSchema,
  parentId: z.string().nullable().optional(),
});

export const renameFolderSchema = z.object({
  name: folderNameSchema,
});

export const updateNoteMetaSchema = z.object({
  title: z.string().trim().min(1).max(200),
  visibility: z.enum(NOTE_VISIBILITIES).optional(),
  publishStatus: z.enum(PUBLISH_STATUSES).optional(),
  noteType: z.enum(NOTE_TYPES).optional(),
});

export const commentBodySchema = z
  .string()
  .trim()
  .min(1, 'Enter a comment.')
  .max(4000, 'Use at most 4000 characters.');

export const tagNameSchema = z
  .string()
  .trim()
  .min(1)
  .max(40)
  .regex(/^[a-zA-Z0-9_-]+$/, 'Use letters, numbers, underscores, or hyphens.');

export type CreateNoteFormValues = z.infer<typeof createNoteSchema>;
export type CreateFolderFormValues = z.infer<typeof createFolderSchema>;
export type UpdateNoteMetaFormValues = z.infer<typeof updateNoteMetaSchema>;
