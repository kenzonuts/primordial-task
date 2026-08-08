import { DEFAULT_AUTHOR, EMPTY_DOC } from '@features/notes/constants';
import type {
  CreateFolderInput,
  CreateNoteInput,
  Note,
  NoteComment,
  NoteDocumentJson,
  NoteFolder,
  NotesRepository,
  NoteTemplate,
  NoteVersion,
  UpdateNoteInput,
} from '@features/notes/types';
import {
  docToMarkdown,
  excerptFromDoc,
  markdownToDoc,
  wouldCreateDocCycle,
  wouldCreateFolderCycle,
  wordCountFromDoc,
} from '@features/notes/utils/content-utils';

const STORAGE_KEY = 'primordial-notes-v1';

interface NotesRepoState {
  notes: Note[];
  folders: NoteFolder[];
  versions: NoteVersion[];
  comments: NoteComment[];
  templates: NoteTemplate[];
}

const delay = async (ms = 100): Promise<void> => {
  await new Promise((resolve) => {
    globalThis.setTimeout(resolve, ms);
  });
};

const createId = (prefix: string): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
};

const builtinTemplates = (workspaceId: string): NoteTemplate[] => [
  {
    id: 'tpl-meeting',
    workspaceId,
    name: 'Meeting Notes',
    description: 'Agenda, attendees, and action items.',
    category: 'Meetings',
    noteType: 'meeting',
    content: markdownToDoc(
      '# Meeting Notes\n\n## Agenda\n\n- \n\n## Notes\n\n\n## Action Items\n\n- [ ] ',
    ),
  },
  {
    id: 'tpl-brief',
    workspaceId,
    name: 'Project Brief',
    description: 'Goals, scope, and success criteria.',
    category: 'Planning',
    noteType: 'project',
    content: markdownToDoc('# Project Brief\n\n## Goals\n\n## Scope\n\n## Success Criteria\n'),
  },
  {
    id: 'tpl-tech',
    workspaceId,
    name: 'Technical Specification',
    description: 'Architecture and implementation details.',
    category: 'Engineering',
    noteType: 'technical_spec',
    content: markdownToDoc(
      '# Technical Specification\n\n## Overview\n\n## Architecture\n\n## API\n\n## Risks\n',
    ),
  },
  {
    id: 'tpl-api',
    workspaceId,
    name: 'API Documentation',
    description: 'Endpoints, payloads, and auth.',
    category: 'Engineering',
    noteType: 'api_docs',
    content: markdownToDoc(
      '# API Documentation\n\n## Authentication\n\n## Endpoints\n\n### GET /\n',
    ),
  },
  {
    id: 'tpl-adr',
    workspaceId,
    name: 'Architecture Decision Record',
    description: 'Context, decision, and consequences.',
    category: 'Engineering',
    noteType: 'adr',
    content: markdownToDoc(
      '# ADR: Title\n\n## Status\n\nProposed\n\n## Context\n\n## Decision\n\n## Consequences\n',
    ),
  },
  {
    id: 'tpl-changelog',
    workspaceId,
    name: 'Changelog',
    description: 'Release notes template.',
    category: 'Release',
    noteType: 'release_note',
    content: markdownToDoc('# Changelog\n\n## Added\n\n## Changed\n\n## Fixed\n'),
  },
  {
    id: 'tpl-bug',
    workspaceId,
    name: 'Bug Report',
    description: 'Steps to reproduce and expected behavior.',
    category: 'Engineering',
    noteType: 'checklist',
    content: markdownToDoc(
      '# Bug Report\n\n## Summary\n\n## Steps to Reproduce\n\n1. \n\n## Expected\n\n## Actual\n',
    ),
  },
];

const seedState = (workspaceId: string): NotesRepoState => {
  const now = Date.now();
  const folderRoot: NoteFolder = {
    id: 'folder-general',
    workspaceId,
    projectId: 'proj-core',
    parentId: null,
    name: 'General',
    orderIndex: 0,
    createdAt: now - 1000 * 60 * 60 * 24 * 20,
    updatedAt: now - 1000 * 60 * 60 * 24,
  };
  const folderEng: NoteFolder = {
    id: 'folder-engineering',
    workspaceId,
    projectId: 'proj-core',
    parentId: null,
    name: 'Engineering',
    orderIndex: 1,
    createdAt: now - 1000 * 60 * 60 * 24 * 18,
    updatedAt: now - 1000 * 60 * 60 * 12,
  };
  const folderArch: NoteFolder = {
    id: 'folder-architecture',
    workspaceId,
    projectId: 'proj-core',
    parentId: folderEng.id,
    name: 'Architecture',
    orderIndex: 0,
    createdAt: now - 1000 * 60 * 60 * 24 * 10,
    updatedAt: now - 1000 * 60 * 60 * 8,
  };

  const contentA = markdownToDoc(
    '# Primordial Core Notes\n\nWorking notes for shell and auth.\n\n## Open questions\n\n- Keyboard density\n- Utility panel defaults\n',
  );
  const contentB = markdownToDoc(
    '# Task Engine Integration\n\nNotes must link to tasks without duplicating task logic.\n\n```ts\nuseTaskStore.getState()\n```\n',
  );
  const contentDoc = markdownToDoc(
    '# Getting Started\n\nWelcome to project documentation.\n\n## Structure\n\nUse nested pages for deep specs.\n',
  );

  const noteA: Note = {
    id: 'note-core-1',
    workspaceId,
    projectId: 'proj-core',
    folderId: folderRoot.id,
    parentDocId: null,
    title: 'Primordial Core Notes',
    excerpt: excerptFromDoc(contentA),
    noteType: 'project',
    visibility: 'project',
    publishStatus: 'draft',
    content: contentA,
    markdownCache: docToMarkdown(contentA),
    author: DEFAULT_AUTHOR,
    tags: [
      { id: 'tag-draft', name: 'draft' },
      { id: 'tag-eng', name: 'engineering' },
    ],
    links: [
      {
        id: 'link-1',
        kind: 'task',
        targetId: 'task-shell-epic',
        label: 'Ship Application Shell epic',
      },
    ],
    isFavorite: true,
    isPinned: true,
    isTemplate: false,
    isDocumentation: false,
    orderIndex: 0,
    wordCount: wordCountFromDoc(contentA),
    lastViewedAt: now - 1000 * 60 * 30,
    createdAt: now - 1000 * 60 * 60 * 24 * 14,
    updatedAt: now - 1000 * 60 * 30,
    archivedAt: null,
    deletedAt: null,
    version: 3,
  };

  const noteB: Note = {
    id: 'note-core-2',
    workspaceId,
    projectId: 'proj-core',
    folderId: folderArch.id,
    parentDocId: null,
    title: 'Task Engine Integration',
    excerpt: excerptFromDoc(contentB),
    noteType: 'technical_spec',
    visibility: 'project',
    publishStatus: 'draft',
    content: contentB,
    markdownCache: docToMarkdown(contentB),
    author: DEFAULT_AUTHOR,
    tags: [{ id: 'tag-eng', name: 'engineering' }],
    links: [],
    isFavorite: false,
    isPinned: false,
    isTemplate: false,
    isDocumentation: false,
    orderIndex: 1,
    wordCount: wordCountFromDoc(contentB),
    lastViewedAt: now - 1000 * 60 * 90,
    createdAt: now - 1000 * 60 * 60 * 24 * 7,
    updatedAt: now - 1000 * 60 * 90,
    archivedAt: null,
    deletedAt: null,
    version: 1,
  };

  const docRoot: Note = {
    id: 'doc-getting-started',
    workspaceId,
    projectId: 'proj-core',
    folderId: null,
    parentDocId: null,
    title: 'Getting Started',
    excerpt: excerptFromDoc(contentDoc),
    noteType: 'documentation',
    visibility: 'workspace',
    publishStatus: 'published',
    content: contentDoc,
    markdownCache: docToMarkdown(contentDoc),
    author: DEFAULT_AUTHOR,
    tags: [{ id: 'tag-docs', name: 'docs' }],
    links: [],
    isFavorite: true,
    isPinned: false,
    isTemplate: false,
    isDocumentation: true,
    orderIndex: 0,
    wordCount: wordCountFromDoc(contentDoc),
    lastViewedAt: now - 1000 * 60 * 10,
    createdAt: now - 1000 * 60 * 60 * 24 * 30,
    updatedAt: now - 1000 * 60 * 10,
    archivedAt: null,
    deletedAt: null,
    version: 2,
  };

  const docChildContent = markdownToDoc(
    '# Editor Guidelines\n\nKeep the writing surface distraction-free.\n\n## Shortcuts\n\n- `/` slash menu\n- `Cmd+K` link\n',
  );
  const docChild: Note = {
    id: 'doc-editor-guidelines',
    workspaceId,
    projectId: 'proj-core',
    folderId: null,
    parentDocId: docRoot.id,
    title: 'Editor Guidelines',
    excerpt: excerptFromDoc(docChildContent),
    noteType: 'documentation',
    visibility: 'workspace',
    publishStatus: 'published',
    content: docChildContent,
    markdownCache: docToMarkdown(docChildContent),
    author: DEFAULT_AUTHOR,
    tags: [{ id: 'tag-docs', name: 'docs' }],
    links: [],
    isFavorite: false,
    isPinned: false,
    isTemplate: false,
    isDocumentation: true,
    orderIndex: 0,
    wordCount: wordCountFromDoc(docChildContent),
    lastViewedAt: null,
    createdAt: now - 1000 * 60 * 60 * 24 * 12,
    updatedAt: now - 1000 * 60 * 60 * 5,
    archivedAt: null,
    deletedAt: null,
    version: 1,
  };

  return {
    folders: [folderRoot, folderEng, folderArch],
    notes: [noteA, noteB, docRoot, docChild],
    versions: [
      {
        id: 'ver-1',
        noteId: noteA.id,
        label: 'Initial draft',
        author: DEFAULT_AUTHOR,
        content: contentA,
        markdownCache: docToMarkdown(contentA),
        createdAt: now - 1000 * 60 * 60 * 24,
        isManual: true,
        isCurrent: false,
      },
    ],
    comments: [
      {
        id: 'cmt-note-1',
        noteId: noteA.id,
        blockId: null,
        parentId: null,
        author: DEFAULT_AUTHOR,
        body: 'Capture utility panel defaults before Phase 13.',
        resolved: false,
        createdAt: now - 1000 * 60 * 40,
        updatedAt: now - 1000 * 60 * 40,
      },
    ],
    templates: builtinTemplates(workspaceId),
  };
};

const readAll = (): Record<string, NotesRepoState> => {
  try {
    const raw = globalThis.localStorage?.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }
    return JSON.parse(raw) as Record<string, NotesRepoState>;
  } catch {
    return {};
  }
};

const writeAll = (all: Record<string, NotesRepoState>): void => {
  try {
    globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // ignore quota
  }
};

const readRepo = (workspaceId: string): NotesRepoState => {
  const all = readAll();
  if (!all[workspaceId]) {
    all[workspaceId] = seedState(workspaceId);
    writeAll(all);
  }
  const state = all[workspaceId]!;
  return {
    notes: [...state.notes],
    folders: [...state.folders],
    versions: [...state.versions],
    comments: [...state.comments],
    templates: [...state.templates],
  };
};

const writeRepo = (workspaceId: string, state: NotesRepoState): void => {
  const all = readAll();
  all[workspaceId] = state;
  writeAll(all);
};

const withContentMeta = (note: Note, content: NoteDocumentJson, markdownCache?: string): Note => {
  const markdown = markdownCache ?? docToMarkdown(content);
  return {
    ...note,
    content,
    markdownCache: markdown,
    excerpt: excerptFromDoc(content),
    wordCount: wordCountFromDoc(content),
    updatedAt: Date.now(),
    version: note.version + 1,
  };
};

export class InMemoryNotesRepository implements NotesRepository {
  async listNotes(workspaceId: string): Promise<Note[]> {
    await delay();
    return readRepo(workspaceId).notes.sort((a, b) => b.updatedAt - a.updatedAt);
  }

  async getNote(workspaceId: string, id: string): Promise<Note | null> {
    await delay(60);
    const repo = readRepo(workspaceId);
    const note = repo.notes.find((item) => item.id === id) ?? null;
    if (note) {
      const index = repo.notes.findIndex((item) => item.id === id);
      repo.notes[index] = { ...note, lastViewedAt: Date.now() };
      writeRepo(workspaceId, repo);
      return repo.notes[index]!;
    }
    return null;
  }

  async createNote(input: CreateNoteInput): Promise<Note> {
    await delay();
    const repo = readRepo(input.workspaceId);
    const template = input.templateId
      ? repo.templates.find((item) => item.id === input.templateId)
      : null;
    const content = template?.content ?? { ...EMPTY_DOC };
    const now = Date.now();
    const note: Note = {
      id: createId('note'),
      workspaceId: input.workspaceId,
      projectId: input.projectId ?? null,
      folderId: input.folderId ?? null,
      parentDocId: input.parentDocId ?? null,
      title: input.title?.trim() || 'Untitled',
      excerpt: excerptFromDoc(content),
      noteType:
        input.noteType ??
        template?.noteType ??
        (input.isDocumentation ? 'documentation' : 'personal'),
      visibility: input.isDocumentation ? 'workspace' : 'project',
      publishStatus: 'draft',
      content,
      markdownCache: docToMarkdown(content),
      author: DEFAULT_AUTHOR,
      tags: [],
      links: [],
      isFavorite: false,
      isPinned: false,
      isTemplate: false,
      isDocumentation: Boolean(input.isDocumentation),
      orderIndex: repo.notes.filter(
        (item) => item.isDocumentation === Boolean(input.isDocumentation),
      ).length,
      wordCount: wordCountFromDoc(content),
      lastViewedAt: now,
      createdAt: now,
      updatedAt: now,
      archivedAt: null,
      deletedAt: null,
      version: 1,
    };
    repo.notes.unshift(note);
    writeRepo(input.workspaceId, repo);
    return note;
  }

  async updateNote(workspaceId: string, id: string, input: UpdateNoteInput): Promise<Note> {
    await delay(40);
    const repo = readRepo(workspaceId);
    const index = repo.notes.findIndex((item) => item.id === id);
    if (index < 0) {
      throw new Error('Note not found.');
    }
    let note = repo.notes[index]!;
    if (input.parentDocId !== undefined) {
      if (wouldCreateDocCycle(repo.notes, id, input.parentDocId)) {
        throw new Error('Cannot create a circular documentation hierarchy.');
      }
    }
    note = {
      ...note,
      title: input.title?.trim() ?? note.title,
      folderId: input.folderId !== undefined ? input.folderId : note.folderId,
      parentDocId: input.parentDocId !== undefined ? input.parentDocId : note.parentDocId,
      noteType: input.noteType ?? note.noteType,
      visibility: input.visibility ?? note.visibility,
      publishStatus: input.publishStatus ?? note.publishStatus,
      tags: input.tags ? [...input.tags] : note.tags,
      links: input.links ? [...input.links] : note.links,
      isFavorite: input.isFavorite ?? note.isFavorite,
      isPinned: input.isPinned ?? note.isPinned,
      orderIndex: input.orderIndex ?? note.orderIndex,
      updatedAt: Date.now(),
    };
    if (input.content) {
      note = withContentMeta(note, input.content, input.markdownCache);
    }
    repo.notes[index] = note;
    writeRepo(workspaceId, repo);
    return note;
  }

  async moveNote(workspaceId: string, id: string, folderId: string | null): Promise<Note> {
    return this.updateNote(workspaceId, id, { folderId });
  }

  async archiveNote(workspaceId: string, id: string): Promise<Note> {
    const note = await this.updateNote(workspaceId, id, { publishStatus: 'archived' });
    const repo = readRepo(workspaceId);
    const index = repo.notes.findIndex((item) => item.id === id);
    repo.notes[index] = { ...note, archivedAt: Date.now() };
    writeRepo(workspaceId, repo);
    return repo.notes[index]!;
  }

  async restoreNote(workspaceId: string, id: string): Promise<Note> {
    await delay();
    const repo = readRepo(workspaceId);
    const index = repo.notes.findIndex((item) => item.id === id);
    if (index < 0) {
      throw new Error('Note not found.');
    }
    const restored = {
      ...repo.notes[index]!,
      archivedAt: null,
      deletedAt: null,
      publishStatus: 'draft' as const,
      updatedAt: Date.now(),
    };
    repo.notes[index] = restored;
    writeRepo(workspaceId, repo);
    return restored;
  }

  async softDeleteNote(workspaceId: string, id: string): Promise<void> {
    await delay();
    const repo = readRepo(workspaceId);
    const index = repo.notes.findIndex((item) => item.id === id);
    if (index < 0) {
      return;
    }
    repo.notes[index] = { ...repo.notes[index]!, deletedAt: Date.now() };
    writeRepo(workspaceId, repo);
  }

  async purgeNote(workspaceId: string, id: string): Promise<void> {
    await delay();
    const repo = readRepo(workspaceId);
    repo.notes = repo.notes.filter((item) => item.id !== id);
    repo.versions = repo.versions.filter((item) => item.noteId !== id);
    repo.comments = repo.comments.filter((item) => item.noteId !== id);
    writeRepo(workspaceId, repo);
  }

  async duplicateNote(workspaceId: string, id: string): Promise<Note> {
    const original = await this.getNote(workspaceId, id);
    if (!original) {
      throw new Error('Note not found.');
    }
    return this.createNote({
      workspaceId,
      projectId: original.projectId,
      folderId: original.folderId,
      title: `${original.title} (copy)`,
      noteType: original.noteType,
      isDocumentation: original.isDocumentation,
    }).then(async (created) =>
      this.updateNote(workspaceId, created.id, {
        content: original.content,
        markdownCache: original.markdownCache,
        tags: original.tags,
      }),
    );
  }

  async listFolders(workspaceId: string): Promise<NoteFolder[]> {
    await delay(40);
    return readRepo(workspaceId).folders.sort((a, b) => a.orderIndex - b.orderIndex);
  }

  async createFolder(input: CreateFolderInput): Promise<NoteFolder> {
    await delay();
    const repo = readRepo(input.workspaceId);
    const siblings = repo.folders.filter((folder) => folder.parentId === (input.parentId ?? null));
    if (siblings.some((folder) => folder.name.toLowerCase() === input.name.trim().toLowerCase())) {
      throw new Error('Folder name must be unique within its parent.');
    }
    const folder: NoteFolder = {
      id: createId('folder'),
      workspaceId: input.workspaceId,
      projectId: input.projectId ?? null,
      parentId: input.parentId ?? null,
      name: input.name.trim(),
      orderIndex: siblings.length,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    repo.folders.push(folder);
    writeRepo(input.workspaceId, repo);
    return folder;
  }

  async renameFolder(workspaceId: string, id: string, name: string): Promise<NoteFolder> {
    await delay();
    const repo = readRepo(workspaceId);
    const index = repo.folders.findIndex((folder) => folder.id === id);
    if (index < 0) {
      throw new Error('Folder not found.');
    }
    const current = repo.folders[index]!;
    const conflict = repo.folders.some(
      (folder) =>
        folder.id !== id &&
        folder.parentId === current.parentId &&
        folder.name.toLowerCase() === name.trim().toLowerCase(),
    );
    if (conflict) {
      throw new Error('Folder name must be unique within its parent.');
    }
    const updated = { ...current, name: name.trim(), updatedAt: Date.now() };
    repo.folders[index] = updated;
    writeRepo(workspaceId, repo);
    return updated;
  }

  async moveFolder(workspaceId: string, id: string, parentId: string | null): Promise<NoteFolder> {
    await delay();
    const repo = readRepo(workspaceId);
    if (wouldCreateFolderCycle(repo.folders, id, parentId)) {
      throw new Error('Cannot create a circular folder hierarchy.');
    }
    const index = repo.folders.findIndex((folder) => folder.id === id);
    if (index < 0) {
      throw new Error('Folder not found.');
    }
    const updated = { ...repo.folders[index]!, parentId, updatedAt: Date.now() };
    repo.folders[index] = updated;
    writeRepo(workspaceId, repo);
    return updated;
  }

  async deleteFolder(workspaceId: string, id: string): Promise<void> {
    await delay();
    const repo = readRepo(workspaceId);
    const hasChildren = repo.folders.some((folder) => folder.parentId === id);
    if (hasChildren) {
      throw new Error('Move or delete child folders first.');
    }
    repo.notes = repo.notes.map((note) =>
      note.folderId === id ? { ...note, folderId: null } : note,
    );
    repo.folders = repo.folders.filter((folder) => folder.id !== id);
    writeRepo(workspaceId, repo);
  }

  async listVersions(workspaceId: string, noteId: string): Promise<NoteVersion[]> {
    await delay(60);
    return readRepo(workspaceId)
      .versions.filter((version) => version.noteId === noteId)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  async createVersion(
    workspaceId: string,
    noteId: string,
    label: string | null = null,
  ): Promise<NoteVersion> {
    await delay();
    const repo = readRepo(workspaceId);
    const note = repo.notes.find((item) => item.id === noteId);
    if (!note) {
      throw new Error('Note not found.');
    }
    repo.versions = repo.versions.map((version) =>
      version.noteId === noteId ? { ...version, isCurrent: false } : version,
    );
    const version: NoteVersion = {
      id: createId('ver'),
      noteId,
      label,
      author: DEFAULT_AUTHOR,
      content: note.content,
      markdownCache: note.markdownCache,
      createdAt: Date.now(),
      isManual: true,
      isCurrent: true,
    };
    repo.versions.unshift(version);
    writeRepo(workspaceId, repo);
    return version;
  }

  async restoreVersion(workspaceId: string, noteId: string, versionId: string): Promise<Note> {
    await delay();
    const repo = readRepo(workspaceId);
    const note = repo.notes.find((item) => item.id === noteId);
    const version = repo.versions.find((item) => item.id === versionId && item.noteId === noteId);
    if (!note || !version) {
      throw new Error('Version not found.');
    }
    // Preserve current as a new snapshot before restore
    await this.createVersion(workspaceId, noteId, 'Before restore');
    return this.updateNote(workspaceId, noteId, {
      content: version.content,
      markdownCache: version.markdownCache,
    });
  }

  async listComments(workspaceId: string, noteId: string): Promise<NoteComment[]> {
    await delay(40);
    return readRepo(workspaceId)
      .comments.filter((comment) => comment.noteId === noteId)
      .sort((a, b) => a.createdAt - b.createdAt);
  }

  async addComment(
    workspaceId: string,
    noteId: string,
    body: string,
    parentId: string | null = null,
    blockId: string | null = null,
  ): Promise<NoteComment> {
    await delay();
    const repo = readRepo(workspaceId);
    const comment: NoteComment = {
      id: createId('cmt'),
      noteId,
      blockId,
      parentId,
      author: DEFAULT_AUTHOR,
      body: body.trim(),
      resolved: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    repo.comments.push(comment);
    writeRepo(workspaceId, repo);
    return comment;
  }

  async updateComment(
    workspaceId: string,
    noteId: string,
    commentId: string,
    body: string,
  ): Promise<NoteComment> {
    await delay();
    const repo = readRepo(workspaceId);
    const index = repo.comments.findIndex(
      (comment) => comment.id === commentId && comment.noteId === noteId,
    );
    if (index < 0) {
      throw new Error('Comment not found.');
    }
    const updated = {
      ...repo.comments[index]!,
      body: body.trim(),
      updatedAt: Date.now(),
    };
    repo.comments[index] = updated;
    writeRepo(workspaceId, repo);
    return updated;
  }

  async deleteComment(workspaceId: string, noteId: string, commentId: string): Promise<void> {
    await delay();
    const repo = readRepo(workspaceId);
    repo.comments = repo.comments.filter(
      (comment) =>
        !(
          comment.noteId === noteId &&
          (comment.id === commentId || comment.parentId === commentId)
        ),
    );
    writeRepo(workspaceId, repo);
  }

  async resolveComment(
    workspaceId: string,
    noteId: string,
    commentId: string,
    resolved: boolean,
  ): Promise<NoteComment> {
    await delay();
    const repo = readRepo(workspaceId);
    const index = repo.comments.findIndex(
      (comment) => comment.id === commentId && comment.noteId === noteId,
    );
    if (index < 0) {
      throw new Error('Comment not found.');
    }
    const updated = { ...repo.comments[index]!, resolved, updatedAt: Date.now() };
    repo.comments[index] = updated;
    writeRepo(workspaceId, repo);
    return updated;
  }

  async listTemplates(workspaceId: string): Promise<NoteTemplate[]> {
    await delay(40);
    return readRepo(workspaceId).templates;
  }

  async importMarkdown(
    workspaceId: string,
    markdown: string,
    folderId: string | null = null,
  ): Promise<Note> {
    const content = markdownToDoc(markdown);
    const created = await this.createNote({
      workspaceId,
      folderId,
      title: 'Imported note',
    });
    return this.updateNote(workspaceId, created.id, {
      content,
      markdownCache: docToMarkdown(content),
    });
  }

  async reorderDocs(
    workspaceId: string,
    orderedIds: readonly string[],
    parentDocId: string | null,
  ): Promise<void> {
    await delay();
    const repo = readRepo(workspaceId);
    orderedIds.forEach((id, orderIndex) => {
      const index = repo.notes.findIndex((note) => note.id === id);
      if (index >= 0) {
        repo.notes[index] = {
          ...repo.notes[index]!,
          parentDocId,
          orderIndex,
          updatedAt: Date.now(),
        };
      }
    });
    writeRepo(workspaceId, repo);
  }
}

export const createNotesRepository = (): NotesRepository => new InMemoryNotesRepository();

export const __resetNotesStorageForTests = (): void => {
  try {
    globalThis.localStorage?.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
};
