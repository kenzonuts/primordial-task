import type { NotesPreferences, NoteType } from '@features/notes/types';

export const NOTE_TYPE_LABELS: Record<NoteType, string> = {
  personal: 'Personal Note',
  workspace: 'Workspace Note',
  project: 'Project Note',
  meeting: 'Meeting Notes',
  documentation: 'Documentation',
  technical_spec: 'Technical Specification',
  release_note: 'Release Note',
  adr: 'Architecture Decision Record',
  api_docs: 'API Documentation',
  checklist: 'Checklist',
  knowledge_base: 'Knowledge Base',
};

export const DEFAULT_NOTES_PREFERENCES: NotesPreferences = {
  defaultView: 'list',
  sidebarCollapsed: false,
  showArchived: false,
  autosaveDebounceMs: 1000,
  editorMaxWidth: 720,
};

export const FOLDER_NAME_RESERVED = /[/\\:*?"<>|]/;
export const MAX_FOLDER_DEPTH = 20;
export const TRASH_RETENTION_DAYS = 30;
export const EDITOR_CONTENT_MAX_WIDTH = 720;
export const NOTES_SIDEBAR_WIDTH = 264;

export const DEFAULT_AUTHOR = {
  id: 'user-local',
  fullName: 'Alex Rivera',
  email: 'alex@primordial.dev',
} as const;

export const EMPTY_DOC = {
  type: 'doc' as const,
  content: [{ type: 'paragraph' }],
};

export const SLASH_COMMAND_GROUPS = [
  {
    id: 'text',
    label: 'Text',
    commands: [
      { id: 'paragraph', label: 'Paragraph', block: 'paragraph' },
      { id: 'h1', label: 'Heading 1', block: 'heading_1' },
      { id: 'h2', label: 'Heading 2', block: 'heading_2' },
      { id: 'h3', label: 'Heading 3', block: 'heading_3' },
    ],
  },
  {
    id: 'lists',
    label: 'Lists',
    commands: [
      { id: 'bullet', label: 'Bullet List', block: 'bullet_list' },
      { id: 'ordered', label: 'Ordered List', block: 'ordered_list' },
      { id: 'checklist', label: 'Checklist', block: 'checklist' },
    ],
  },
  {
    id: 'blocks',
    label: 'Blocks',
    commands: [
      { id: 'quote', label: 'Quote', block: 'quote' },
      { id: 'code', label: 'Code Block', block: 'code_block' },
      { id: 'divider', label: 'Divider', block: 'divider' },
      { id: 'table', label: 'Table', block: 'table' },
    ],
  },
] as const;
