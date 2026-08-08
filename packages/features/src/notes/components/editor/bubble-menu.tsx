import type { Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import { Bold, Code, Italic, Link2, Strikethrough } from 'lucide-react';
import { type ReactElement, useCallback } from 'react';

import { cn } from '@shared/ui/lib/cn';
import { IconButton } from '@shared/ui/primitives/icon-button';

const SAFE_HREF = /^(https?:|mailto:|#|\/)/i;

export const promptForLinkHref = (current = ''): string | null => {
  const next = window.prompt('Link URL', current || 'https://');
  if (next === null) {
    return null;
  }
  const trimmed = next.trim();
  if (!trimmed) {
    return '';
  }
  if (!SAFE_HREF.test(trimmed)) {
    return null;
  }
  return trimmed;
};

export const applyLinkFromPrompt = (editor: Editor): void => {
  const previous = editor.getAttributes('link').href as string | undefined;
  const href = promptForLinkHref(previous ?? '');
  if (href === null) {
    return;
  }
  if (href === '') {
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
    return;
  }
  editor.chain().focus().extendMarkRange('link').setLink({ href }).run();
};

type EditorBubbleMenuProps = {
  readonly editor: Editor;
  readonly className?: string;
};

type MarkButtonProps = {
  readonly label: string;
  readonly active: boolean;
  readonly onClick: () => void;
  readonly children: ReactElement;
};

const MarkButton = ({ label, active, onClick, children }: MarkButtonProps): ReactElement => (
  <IconButton
    type="button"
    variant={active ? 'selected' : 'ghost'}
    size="sm"
    aria-label={label}
    aria-pressed={active}
    onClick={onClick}
    className="text-text-secondary"
  >
    {children}
  </IconButton>
);

/** Minimal selection bubble for bold / italic / strike / code / link. */
export const EditorBubbleMenu = ({
  editor,
  className,
}: EditorBubbleMenuProps): ReactElement | null => {
  const setLink = useCallback(() => {
    applyLinkFromPrompt(editor);
  }, [editor]);

  if (!editor || editor.isDestroyed) {
    return null;
  }

  return (
    <BubbleMenu
      editor={editor}
      options={{
        placement: 'top',
        offset: 8,
      }}
      className={cn(
        'flex items-center gap-0.5 rounded-md border border-border-default bg-surface-elevated p-0.5 shadow-popover',
        'motion-reduce:transition-none',
        className,
      )}
    >
      <MarkButton
        label="Bold"
        active={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold aria-hidden />
      </MarkButton>
      <MarkButton
        label="Italic"
        active={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic aria-hidden />
      </MarkButton>
      <MarkButton
        label="Strikethrough"
        active={editor.isActive('strike')}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough aria-hidden />
      </MarkButton>
      <MarkButton
        label="Inline code"
        active={editor.isActive('code')}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <Code aria-hidden />
      </MarkButton>
      <MarkButton label="Link" active={editor.isActive('link')} onClick={setLink}>
        <Link2 aria-hidden />
      </MarkButton>
    </BubbleMenu>
  );
};

export { EditorBubbleMenu as BubbleMenu };
