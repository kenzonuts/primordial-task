export {
  NOTES_ROUTES,
  noteDetailPath,
  noteHistoryPath,
  docDetailPath,
  NOTE_TYPES,
  NOTE_VISIBILITIES,
  PUBLISH_STATUSES,
  EDITOR_SAVE_STATES,
  NOTE_VIEW_MODES,
  NOTE_SORT_KEYS,
  NOTE_FILTER_PRESETS,
  BLOCK_TYPES,
} from '@features/notes/types';
export type {
  NoteType,
  NoteVisibility,
  PublishStatus,
  EditorSaveState,
  NoteViewMode,
  NoteSortKey,
  NoteFilterPreset,
  BlockType,
  NoteAuthor,
  NoteTag,
  NoteLinkRef,
  NoteDocumentJson,
  NoteFolder,
  Note,
  NoteVersion,
  NoteComment,
  NoteTemplate,
  CreateNoteInput,
  UpdateNoteInput,
  CreateFolderInput,
  NotesFiltersState,
  NotesPreferences,
  OfflineQueueItem,
  PresenceUser,
  CollaborationAdapter,
  NotesRepository,
} from '@features/notes/types';

export {
  NOTE_TYPE_LABELS,
  DEFAULT_NOTES_PREFERENCES,
  FOLDER_NAME_RESERVED,
  MAX_FOLDER_DEPTH,
  TRASH_RETENTION_DAYS,
  EDITOR_CONTENT_MAX_WIDTH,
  NOTES_SIDEBAR_WIDTH,
  DEFAULT_AUTHOR,
  EMPTY_DOC,
  SLASH_COMMAND_GROUPS,
} from '@features/notes/constants';

export {
  noteTitleSchema,
  folderNameSchema,
  createNoteSchema,
  createFolderSchema,
  renameFolderSchema,
  updateNoteMetaSchema,
  commentBodySchema,
  tagNameSchema,
} from '@features/notes/schemas/note-schemas';
export type {
  CreateNoteFormValues,
  CreateFolderFormValues,
  UpdateNoteMetaFormValues,
} from '@features/notes/schemas/note-schemas';

export {
  useNotesStore,
  notesRepository,
  filterNotes,
  useFoldersStore,
  useEditorStore,
  useNotesFilterStore,
  useNotesSearchStore,
  useHistoryStore,
  useCommentsStore,
  useNotesPreferenceStore,
  usePresenceStore,
  useDocumentStore,
} from '@features/notes/store';

export {
  createNotesRepository,
  __resetNotesStorageForTests,
} from '@features/notes/services/notes-repository';

export { NotesProvider, useNotesContext } from '@features/notes/context/notes-context';
export type { NotesContextValue } from '@features/notes/context/notes-context';

export { NotesRoutes } from '@features/notes/routes/notes-routes';

export {
  NotesExplorerPage,
  NoteEditorPage,
  NoteCreatePage,
  NoteHistoryPage,
  TemplatesPage,
  TrashPage,
  DocsExplorerPage,
  DocPagePage,
} from '@features/notes/pages';

export * from '@features/notes/components';
