import type { Editor, JSONContent } from '@tiptap/react';
import { EditorContent, useEditor } from '@tiptap/react';
import { memo, useEffect, useRef, type ReactElement } from 'react';

import {
  applyLinkFromPrompt,
  EditorBubbleMenu,
} from '@features/notes/components/editor/bubble-menu';
import { createNoteEditorExtensions } from '@features/notes/components/editor/extensions';
import { createSlashCommandsExtension } from '@features/notes/components/editor/slash-menu';
import { EDITOR_CONTENT_MAX_WIDTH, EMPTY_DOC } from '@features/notes/constants';
import type { NoteDocumentJson } from '@features/notes/types';
import { cn } from '@shared/ui/lib/cn';

export type BlockEditorProps = {
  readonly content: NoteDocumentJson;
  readonly editable?: boolean;
  readonly onUpdate?: (json: NoteDocumentJson) => void;
  readonly onSaveRequest?: () => void;
  readonly className?: string;
  /** Remount / re-init key — typically note id. */
  readonly documentKey?: string;
  readonly showBubbleMenu?: boolean;
  readonly onEditorReady?: (editor: Editor | null) => void;
};

const toJsonContent = (content: NoteDocumentJson): JSONContent => content as unknown as JSONContent;

const BlockEditorInner = ({
  content,
  editable = true,
  onUpdate,
  onSaveRequest,
  className,
  documentKey,
  showBubbleMenu = true,
  onEditorReady,
}: BlockEditorProps): ReactElement => {
  const onUpdateRef = useRef(onUpdate);
  const onSaveRequestRef = useRef(onSaveRequest);
  const editorRef = useRef<Editor | null>(null);
  onUpdateRef.current = onUpdate;
  onSaveRequestRef.current = onSaveRequest;

  const extensionsRef = useRef([...createNoteEditorExtensions(), createSlashCommandsExtension()]);

  const editor = useEditor(
    {
      extensions: extensionsRef.current,
      content: toJsonContent(content.content ? content : EMPTY_DOC),
      editable,
      immediatelyRender: false,
      shouldRerenderOnTransaction: false,
      editorProps: {
        attributes: {
          class: cn(
            'prose-notes max-w-none focus:outline-none',
            'min-h-[50vh] px-1 py-2 text-text-primary',
          ),
          'aria-label': 'Note editor',
        },
        handleKeyDown: (_view, event) => {
          const mod = event.metaKey || event.ctrlKey;
          if (mod && event.key.toLowerCase() === 's') {
            event.preventDefault();
            onSaveRequestRef.current?.();
            return true;
          }
          if (mod && event.key.toLowerCase() === 'k') {
            event.preventDefault();
            const current = editorRef.current;
            if (current && !current.isDestroyed) {
              applyLinkFromPrompt(current);
            }
            return true;
          }
          return false;
        },
      },
      onUpdate: ({ editor: current }) => {
        onUpdateRef.current?.(current.getJSON() as NoteDocumentJson);
      },
    },
    [documentKey],
  );

  editorRef.current = editor;

  useEffect(() => {
    onEditorReady?.(editor ?? null);
    return () => {
      onEditorReady?.(null);
    };
  }, [editor, onEditorReady]);

  useEffect(() => {
    if (!editor || editor.isDestroyed) {
      return;
    }
    editor.setEditable(editable);
  }, [editor, editable]);

  return (
    <div
      className={cn('relative w-full', className)}
      style={{ maxWidth: EDITOR_CONTENT_MAX_WIDTH }}
    >
      <EditorContent
        editor={editor}
        className={cn(
          'w-full',
          '[&_.ProseMirror]:outline-none',
          '[&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none',
          '[&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left',
          '[&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0',
          '[&_.ProseMirror_p.is-editor-empty:first-child::before]:text-text-placeholder',
          '[&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]',
          '[&_.ProseMirror_h1]:mb-3 [&_.ProseMirror_h1]:mt-6 [&_.ProseMirror_h1]:text-2xl [&_.ProseMirror_h1]:font-semibold',
          '[&_.ProseMirror_h2]:mb-2 [&_.ProseMirror_h2]:mt-5 [&_.ProseMirror_h2]:text-xl [&_.ProseMirror_h2]:font-semibold',
          '[&_.ProseMirror_h3]:mb-2 [&_.ProseMirror_h3]:mt-4 [&_.ProseMirror_h3]:text-lg [&_.ProseMirror_h3]:font-semibold',
          '[&_.ProseMirror_p]:my-2 [&_.ProseMirror_p]:leading-7',
          '[&_.ProseMirror_ul]:my-2 [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6',
          '[&_.ProseMirror_ol]:my-2 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6',
          '[&_.ProseMirror_li]:my-0.5',
          '[&_.ProseMirror_code]:rounded-sm [&_.ProseMirror_code]:bg-surface-elevated [&_.ProseMirror_code]:px-1 [&_.ProseMirror_code]:font-mono [&_.ProseMirror_code]:text-[0.9em]',
          '[&_.ProseMirror_pre]:my-3 [&_.ProseMirror_pre_code]:bg-transparent [&_.ProseMirror_pre_code]:p-0',
          '[&_.ProseMirror_a]:underline [&_.ProseMirror_a]:underline-offset-2',
          '[&_.ProseMirror_ul[data-type=taskList]]:list-none [&_.ProseMirror_ul[data-type=taskList]]:pl-0',
          '[&_.ProseMirror_ul[data-type=taskList]_li]:flex [&_.ProseMirror_ul[data-type=taskList]_li]:items-start [&_.ProseMirror_ul[data-type=taskList]_li]:gap-2',
          '[&_.ProseMirror_ul[data-type=taskList]_li_label]:mt-1',
          'motion-reduce:transition-none',
        )}
      />
      {showBubbleMenu && editor ? <EditorBubbleMenu editor={editor} /> : null}
    </div>
  );
};

export const BlockEditor = memo(BlockEditorInner);
BlockEditor.displayName = 'BlockEditor';
