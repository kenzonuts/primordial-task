export {
  createNoteEditorExtensions,
  EDITOR_PLACEHOLDER,
} from '@features/notes/components/editor/extensions';

export {
  SlashCommands,
  SlashCommandList,
  SlashMenu,
  createSlashCommandsExtension,
  filterSlashCommands,
  insertSlashBlock,
  runSlashCommand,
  type SlashCommandBlock,
  type SlashCommandItem,
  type SlashCommandListRef,
  type SlashCommandsOptions,
  type SlashMenuProps,
} from '@features/notes/components/editor/slash-menu';

export {
  EditorBubbleMenu,
  BubbleMenu,
  applyLinkFromPrompt,
  promptForLinkHref,
} from '@features/notes/components/editor/bubble-menu';

export { EditorStatus } from '@features/notes/components/editor/editor-status';

export { EditorToolbar } from '@features/notes/components/editor/editor-toolbar';

export { BlockEditor, type BlockEditorProps } from '@features/notes/components/editor/block-editor';

export {
  NoteEditor,
  CopyMarkdownButton,
  type NoteEditorProps,
} from '@features/notes/components/editor/note-editor';

export {
  AiActionsMenu,
  AI_ACTION_IDS,
  type AiActionId,
  type AiActionsMenuProps,
} from '@features/notes/components/editor/ai-actions-menu';
