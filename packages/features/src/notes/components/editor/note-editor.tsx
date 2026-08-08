import type { Editor } from '@tiptap/react';
import { Copy, Sparkles } from 'lucide-react';
import { useCallback, useEffect, useState, type ReactElement } from 'react';

import { AiActionsMenu, type AiActionId } from '@features/notes/components/editor/ai-actions-menu';
import { BlockEditor } from '@features/notes/components/editor/block-editor';
import { EditorBubbleMenu } from '@features/notes/components/editor/bubble-menu';
import { EditorToolbar } from '@features/notes/components/editor/editor-toolbar';
import { EMPTY_DOC } from '@features/notes/constants';
import { useEditorStore } from '@features/notes/store/editor-store';
import type { NoteDocumentJson } from '@features/notes/types';
import { docToMarkdown } from '@features/notes/utils/content-utils';
import { toast } from '@shared/ui/feedback/toast';
import { Inline } from '@shared/ui/layout/inline';
import { cn } from '@shared/ui/lib/cn';
import { Button } from '@shared/ui/primitives/button';

export type NoteEditorProps = {
  readonly workspaceId: string;
  /** When set, loads that note into the editor store. Otherwise uses active note. */
  readonly noteId?: string;
  readonly editable?: boolean;
  /** Alias for `editable={false}` — kept for page/shell callers. */
  readonly readOnly?: boolean;
  readonly className?: string;
  readonly onAiAction?: (action: AiActionId) => void;
};

/**
 * Full note editor: toolbar + TipTap block editor + slash/bubble menus + status.
 * Wires local content updates and debounced save via `useEditorStore`.
 */
export const NoteEditor = ({
  workspaceId,
  noteId,
  editable,
  readOnly = false,
  className,
  onAiAction,
}: NoteEditorProps): ReactElement => {
  const isEditable = editable ?? !readOnly;

  const activeNote = useEditorStore((state) => state.activeNote);
  const saveState = useEditorStore((state) => state.saveState);
  const error = useEditorStore((state) => state.error);
  const loadNote = useEditorStore((state) => state.loadNote);
  const setLocalContent = useEditorStore((state) => state.setLocalContent);
  const setActiveNote = useEditorStore((state) => state.setActiveNote);
  const markDirty = useEditorStore((state) => state.markDirty);
  const save = useEditorStore((state) => state.save);

  const [editor, setEditor] = useState<Editor | null>(null);

  const resolvedId = noteId ?? activeNote?.id;

  useEffect(() => {
    if (!noteId) {
      return;
    }
    void loadNote(workspaceId, noteId);
  }, [workspaceId, noteId, loadNote]);

  const content: NoteDocumentJson = activeNote?.content ?? EMPTY_DOC;
  const title = activeNote?.title ?? '';
  const noteReady = Boolean(activeNote) && (!noteId || activeNote?.id === noteId);

  const handleUpdate = useCallback(
    (json: NoteDocumentJson) => {
      setLocalContent(json);
      void save(workspaceId);
    },
    [setLocalContent, save, workspaceId],
  );

  const handleSaveRequest = useCallback(() => {
    void save(workspaceId, { force: true });
  }, [save, workspaceId]);

  const handleTitleChange = useCallback(
    (nextTitle: string) => {
      const current = useEditorStore.getState().activeNote;
      if (!current) {
        return;
      }
      setActiveNote({ ...current, title: nextTitle });
      markDirty();
      void save(workspaceId);
    },
    [setActiveNote, markDirty, save, workspaceId],
  );

  const handleCopyMarkdown = useCallback(async () => {
    const markdown = activeNote?.markdownCache || docToMarkdown(activeNote?.content ?? EMPTY_DOC);
    try {
      await navigator.clipboard.writeText(markdown);
      toast.success('Markdown copied');
    } catch {
      toast.error('Could not copy markdown');
    }
  }, [activeNote]);

  return (
    <div
      className={cn('flex min-h-0 flex-1 flex-col bg-surface-base', className)}
      data-testid="note-editor"
    >
      <EditorToolbar
        title={title}
        onTitleChange={isEditable ? handleTitleChange : undefined}
        saveState={saveState}
        error={error}
        editable={isEditable}
        actions={
          <Inline gap={4} align="center">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-label="Copy as markdown"
              leftIcon={<Copy aria-hidden className="size-3.5" />}
              onClick={() => {
                void handleCopyMarkdown();
              }}
              disabled={!activeNote}
            >
              Markdown
            </Button>
            <AiActionsMenu
              onAiAction={onAiAction}
              trigger={
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  aria-label="AI actions"
                  leftIcon={<Sparkles aria-hidden className="size-3.5" />}
                >
                  AI
                </Button>
              }
            />
          </Inline>
        }
      />

      <div className="flex min-h-0 flex-1 justify-center overflow-y-auto px-4 py-6">
        {noteReady && activeNote ? (
          <BlockEditor
            documentKey={resolvedId ?? activeNote.id}
            content={content}
            editable={isEditable}
            onUpdate={handleUpdate}
            onSaveRequest={handleSaveRequest}
            showBubbleMenu={false}
            onEditorReady={setEditor}
            className="w-full"
          />
        ) : (
          <div
            className="w-full max-w-[720px] py-8 text-sm text-text-muted"
            role="status"
            aria-live="polite"
          >
            {saveState === 'error' ? (error ?? 'Could not load note.') : 'Loading note…'}
          </div>
        )}
      </div>

      {editor && !editor.isDestroyed ? <EditorBubbleMenu editor={editor} /> : null}
    </div>
  );
};

/** Standalone helper button to copy the active note as markdown. */
export const CopyMarkdownButton = ({
  className,
}: {
  readonly className?: string;
}): ReactElement => {
  const activeNote = useEditorStore((state) => state.activeNote);

  const handleCopy = async (): Promise<void> => {
    const markdown = activeNote?.markdownCache || docToMarkdown(activeNote?.content ?? EMPTY_DOC);
    try {
      await navigator.clipboard.writeText(markdown);
      toast.success('Markdown copied');
    } catch {
      toast.error('Could not copy markdown');
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={className}
      aria-label="Copy as markdown"
      leftIcon={<Copy aria-hidden className="size-3.5" />}
      onClick={() => {
        void handleCopy();
      }}
      disabled={!activeNote}
    >
      Copy Markdown
    </Button>
  );
};
