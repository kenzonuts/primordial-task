import { describe, expect, it } from 'vitest';

import {
  commentBodySchema,
  createFolderSchema,
  createNoteSchema,
  folderNameSchema,
  noteTitleSchema,
  renameFolderSchema,
  tagNameSchema,
  updateNoteMetaSchema,
} from '@features/notes/schemas/note-schemas';

describe('note validation schemas', () => {
  it('accepts Untitled and trimmed titles', () => {
    expect(noteTitleSchema.parse('Untitled')).toBe('Untitled');
    expect(noteTitleSchema.parse('  Spec draft  ')).toBe('Spec draft');
  });

  it('rejects empty note titles that are not Untitled', () => {
    expect(noteTitleSchema.safeParse('').success).toBe(false);
    expect(noteTitleSchema.safeParse('   ').success).toBe(false);
  });

  it('validates create note payloads', () => {
    const parsed = createNoteSchema.parse({
      title: 'Meeting',
      folderId: null,
      templateId: 'tpl-meeting',
      noteType: 'meeting',
    });
    expect(parsed.title).toBe('Meeting');
    expect(parsed.templateId).toBe('tpl-meeting');
  });

  it('validates folder names and rejects reserved characters', () => {
    expect(folderNameSchema.parse('Engineering')).toBe('Engineering');
    expect(folderNameSchema.safeParse('bad/name').success).toBe(false);
    expect(folderNameSchema.safeParse('a:b').success).toBe(false);
  });

  it('validates create and rename folder forms', () => {
    expect(createFolderSchema.parse({ name: 'Architecture', parentId: null }).name).toBe(
      'Architecture',
    );
    expect(renameFolderSchema.parse({ name: 'Ops' }).name).toBe('Ops');
  });

  it('validates note meta updates', () => {
    const parsed = updateNoteMetaSchema.parse({
      title: 'API Docs',
      visibility: 'workspace',
      publishStatus: 'published',
      noteType: 'api_docs',
    });
    expect(parsed.publishStatus).toBe('published');
  });

  it('validates comments and tags', () => {
    expect(commentBodySchema.parse(' Looks good ')).toBe('Looks good');
    expect(commentBodySchema.safeParse('').success).toBe(false);
    expect(tagNameSchema.parse('release-notes')).toBe('release-notes');
    expect(tagNameSchema.safeParse('bad tag').success).toBe(false);
  });
});
