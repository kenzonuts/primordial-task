export const NOTES_ROUTES = {
  list: '/notes',
  create: '/notes/new',
  detail: '/notes/:id',
  history: '/notes/:id/history',
  templates: '/notes/templates',
  trash: '/notes/trash',
  docs: '/docs',
  docDetail: '/docs/:id',
} as const;

export const noteDetailPath = (id: string): string => `/notes/${id}`;
export const noteHistoryPath = (id: string): string => `/notes/${id}/history`;
export const docDetailPath = (id: string): string => `/docs/${id}`;

export const NOTE_TYPES = [
  'personal',
  'workspace',
  'project',
  'meeting',
  'documentation',
  'technical_spec',
  'release_note',
  'adr',
  'api_docs',
  'checklist',
  'knowledge_base',
] as const;

export type NoteType = (typeof NOTE_TYPES)[number];

export const NOTE_VISIBILITIES = ['private', 'project', 'workspace'] as const;
export type NoteVisibility = (typeof NOTE_VISIBILITIES)[number];

export const PUBLISH_STATUSES = ['draft', 'published', 'archived'] as const;
export type PublishStatus = (typeof PUBLISH_STATUSES)[number];

export const EDITOR_SAVE_STATES = [
  'idle',
  'dirty',
  'saving',
  'saved',
  'syncing',
  'offline',
  'conflict',
  'error',
] as const;

export type EditorSaveState = (typeof EDITOR_SAVE_STATES)[number];

export const NOTE_VIEW_MODES = ['grid', 'list', 'tree'] as const;
export type NoteViewMode = (typeof NOTE_VIEW_MODES)[number];

export const NOTE_SORT_KEYS = ['updated', 'created', 'title', 'favorites', 'pinned'] as const;
export type NoteSortKey = (typeof NOTE_SORT_KEYS)[number];

export const NOTE_FILTER_PRESETS = [
  'all',
  'favorites',
  'pinned',
  'recent',
  'archived',
  'trash',
  'documentation',
] as const;

export type NoteFilterPreset = (typeof NOTE_FILTER_PRESETS)[number];

export const BLOCK_TYPES = [
  'paragraph',
  'heading_1',
  'heading_2',
  'heading_3',
  'bullet_list',
  'ordered_list',
  'checklist',
  'quote',
  'code_block',
  'divider',
  'link',
  'image',
  'table',
] as const;

export type BlockType = (typeof BLOCK_TYPES)[number];

export interface NoteAuthor {
  readonly id: string;
  readonly fullName: string;
  readonly email: string;
}

export interface NoteTag {
  readonly id: string;
  readonly name: string;
}

export interface NoteLinkRef {
  readonly id: string;
  readonly kind: 'task' | 'project' | 'calendar' | 'note' | 'documentation' | 'member';
  readonly targetId: string;
  readonly label: string;
}

/**
 * TipTap/ProseMirror JSON document. Extensible block architecture.
 */
export type NoteDocumentJson = {
  readonly type: 'doc';
  readonly content?: readonly Record<string, unknown>[];
};

export interface NoteFolder {
  readonly id: string;
  readonly workspaceId: string;
  readonly projectId: string | null;
  readonly parentId: string | null;
  readonly name: string;
  readonly orderIndex: number;
  readonly createdAt: number;
  readonly updatedAt: number;
}

export interface Note {
  readonly id: string;
  readonly workspaceId: string;
  readonly projectId: string | null;
  readonly folderId: string | null;
  readonly parentDocId: string | null;
  readonly title: string;
  readonly excerpt: string;
  readonly noteType: NoteType;
  readonly visibility: NoteVisibility;
  readonly publishStatus: PublishStatus;
  readonly content: NoteDocumentJson;
  readonly markdownCache: string;
  readonly author: NoteAuthor;
  readonly tags: readonly NoteTag[];
  readonly links: readonly NoteLinkRef[];
  readonly isFavorite: boolean;
  readonly isPinned: boolean;
  readonly isTemplate: boolean;
  readonly isDocumentation: boolean;
  readonly orderIndex: number;
  readonly wordCount: number;
  readonly lastViewedAt: number | null;
  readonly createdAt: number;
  readonly updatedAt: number;
  readonly archivedAt: number | null;
  readonly deletedAt: number | null;
  readonly version: number;
}

export interface NoteVersion {
  readonly id: string;
  readonly noteId: string;
  readonly label: string | null;
  readonly author: NoteAuthor;
  readonly content: NoteDocumentJson;
  readonly markdownCache: string;
  readonly createdAt: number;
  readonly isManual: boolean;
  readonly isCurrent: boolean;
}

export interface NoteComment {
  readonly id: string;
  readonly noteId: string;
  readonly blockId: string | null;
  readonly parentId: string | null;
  readonly author: NoteAuthor;
  readonly body: string;
  readonly resolved: boolean;
  readonly createdAt: number;
  readonly updatedAt: number;
}

export interface NoteTemplate {
  readonly id: string;
  readonly workspaceId: string | null;
  readonly name: string;
  readonly description: string;
  readonly category: string;
  readonly content: NoteDocumentJson;
  readonly noteType: NoteType;
}

export interface CreateNoteInput {
  readonly workspaceId: string;
  readonly projectId?: string | null;
  readonly folderId?: string | null;
  readonly title?: string;
  readonly templateId?: string | null;
  readonly noteType?: NoteType;
  readonly isDocumentation?: boolean;
  readonly parentDocId?: string | null;
}

export interface UpdateNoteInput {
  readonly title?: string;
  readonly folderId?: string | null;
  readonly parentDocId?: string | null;
  readonly noteType?: NoteType;
  readonly visibility?: NoteVisibility;
  readonly publishStatus?: PublishStatus;
  readonly content?: NoteDocumentJson;
  readonly markdownCache?: string;
  readonly tags?: readonly NoteTag[];
  readonly links?: readonly NoteLinkRef[];
  readonly isFavorite?: boolean;
  readonly isPinned?: boolean;
  readonly orderIndex?: number;
}

export interface CreateFolderInput {
  readonly workspaceId: string;
  readonly projectId?: string | null;
  readonly parentId?: string | null;
  readonly name: string;
}

export interface NotesFiltersState {
  readonly query: string;
  readonly sort: NoteSortKey;
  readonly preset: NoteFilterPreset;
  readonly view: NoteViewMode;
  readonly folderId: string | null;
  readonly tags: readonly string[];
  readonly noteTypes: readonly NoteType[];
  readonly projectId: string | null;
}

export interface NotesPreferences {
  readonly defaultView: NoteViewMode;
  readonly sidebarCollapsed: boolean;
  readonly showArchived: boolean;
  readonly autosaveDebounceMs: number;
  readonly editorMaxWidth: number;
}

export interface OfflineQueueItem {
  readonly id: string;
  readonly noteId: string;
  readonly kind: 'create' | 'update' | 'delete' | 'restore' | 'comment';
  readonly payload: unknown;
  readonly createdAt: number;
  readonly attempts: number;
}

export interface PresenceUser {
  readonly userId: string;
  readonly fullName: string;
  readonly color: string;
  readonly lastActiveAt: number;
}

export interface CollaborationAdapter {
  readonly kind: 'local' | 'yjs' | 'automerge';
  connect(noteId: string): Promise<void>;
  disconnect(noteId: string): Promise<void>;
  getPresence(noteId: string): Promise<readonly PresenceUser[]>;
  applyUpdate(noteId: string, update: Uint8Array | string): Promise<void>;
}

export interface NotesRepository {
  listNotes(workspaceId: string): Promise<Note[]>;
  getNote(workspaceId: string, id: string): Promise<Note | null>;
  createNote(input: CreateNoteInput): Promise<Note>;
  updateNote(workspaceId: string, id: string, input: UpdateNoteInput): Promise<Note>;
  moveNote(workspaceId: string, id: string, folderId: string | null): Promise<Note>;
  archiveNote(workspaceId: string, id: string): Promise<Note>;
  restoreNote(workspaceId: string, id: string): Promise<Note>;
  softDeleteNote(workspaceId: string, id: string): Promise<void>;
  purgeNote(workspaceId: string, id: string): Promise<void>;
  duplicateNote(workspaceId: string, id: string): Promise<Note>;
  listFolders(workspaceId: string): Promise<NoteFolder[]>;
  createFolder(input: CreateFolderInput): Promise<NoteFolder>;
  renameFolder(workspaceId: string, id: string, name: string): Promise<NoteFolder>;
  moveFolder(workspaceId: string, id: string, parentId: string | null): Promise<NoteFolder>;
  deleteFolder(workspaceId: string, id: string): Promise<void>;
  listVersions(workspaceId: string, noteId: string): Promise<NoteVersion[]>;
  createVersion(workspaceId: string, noteId: string, label?: string | null): Promise<NoteVersion>;
  restoreVersion(workspaceId: string, noteId: string, versionId: string): Promise<Note>;
  listComments(workspaceId: string, noteId: string): Promise<NoteComment[]>;
  addComment(
    workspaceId: string,
    noteId: string,
    body: string,
    parentId?: string | null,
    blockId?: string | null,
  ): Promise<NoteComment>;
  updateComment(
    workspaceId: string,
    noteId: string,
    commentId: string,
    body: string,
  ): Promise<NoteComment>;
  deleteComment(workspaceId: string, noteId: string, commentId: string): Promise<void>;
  resolveComment(
    workspaceId: string,
    noteId: string,
    commentId: string,
    resolved: boolean,
  ): Promise<NoteComment>;
  listTemplates(workspaceId: string): Promise<NoteTemplate[]>;
  importMarkdown(workspaceId: string, markdown: string, folderId?: string | null): Promise<Note>;
  reorderDocs(
    workspaceId: string,
    orderedIds: readonly string[],
    parentDocId: string | null,
  ): Promise<void>;
}
