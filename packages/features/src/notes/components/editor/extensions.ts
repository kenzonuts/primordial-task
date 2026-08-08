import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Table } from '@tiptap/extension-table';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableRow } from '@tiptap/extension-table-row';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import Underline from '@tiptap/extension-underline';
import type { Extensions } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export const EDITOR_PLACEHOLDER = 'Start writing… Type / for commands';

/** Base TipTap extensions for the notes block editor (slash commands added separately). */
export const createNoteEditorExtensions = (): Extensions => [
  StarterKit.configure({
    heading: { levels: [1, 2, 3] },
    codeBlock: {
      HTMLAttributes: {
        class:
          'rounded-md bg-surface-elevated border border-border-subtle px-3 py-2 font-mono text-sm',
      },
    },
    blockquote: {
      HTMLAttributes: {
        class: 'border-l-2 border-border-strong pl-4 text-text-secondary',
      },
    },
    horizontalRule: {
      HTMLAttributes: {
        class: 'border-0 border-t border-border-subtle my-6',
      },
    },
  }),
  Placeholder.configure({
    placeholder: EDITOR_PLACEHOLDER,
    emptyEditorClass: 'is-editor-empty',
  }),
  Link.configure({
    openOnClick: false,
    autolink: true,
    linkOnPaste: true,
    HTMLAttributes: {
      class: 'text-text-primary underline underline-offset-2 decoration-border-strong',
      rel: 'noopener noreferrer',
    },
  }),
  TaskList.configure({
    HTMLAttributes: {
      class: 'list-none pl-0',
    },
  }),
  TaskItem.configure({
    nested: true,
    HTMLAttributes: {
      class: 'flex gap-2 items-start',
    },
  }),
  Underline,
  Highlight.configure({
    multicolor: false,
    HTMLAttributes: {
      class: 'bg-state-selected rounded-sm px-0.5',
    },
  }),
  Image.configure({
    allowBase64: false,
    HTMLAttributes: {
      class: 'max-w-full h-auto rounded-md border border-border-subtle',
    },
  }),
  Table.configure({
    resizable: false,
    HTMLAttributes: {
      class: 'border-collapse w-full my-4 text-sm',
    },
  }),
  TableRow,
  TableHeader.configure({
    HTMLAttributes: {
      class: 'border border-border-default bg-surface-elevated px-2 py-1.5 text-left font-medium',
    },
  }),
  TableCell.configure({
    HTMLAttributes: {
      class: 'border border-border-default px-2 py-1.5 align-top',
    },
  }),
];
