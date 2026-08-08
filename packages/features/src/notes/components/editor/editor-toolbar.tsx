import type { ReactElement, ReactNode } from 'react';

import { EditorStatus } from '@features/notes/components/editor/editor-status';
import type { EditorSaveState } from '@features/notes/types';
import { Inline } from '@shared/ui/layout/inline';
import { cn } from '@shared/ui/lib/cn';

type EditorToolbarProps = {
  readonly title: string;
  readonly onTitleChange?: (title: string) => void;
  readonly saveState?: EditorSaveState;
  readonly error?: string | null;
  readonly editable?: boolean;
  readonly actions?: ReactNode;
  readonly className?: string;
};

/**
 * Minimal sticky title row — not a formatting toolbar.
 * Title input + status + optional actions slot.
 */
export const EditorToolbar = ({
  title,
  onTitleChange,
  saveState = 'idle',
  error = null,
  editable = true,
  actions,
  className,
}: EditorToolbarProps): ReactElement => {
  return (
    <div
      className={cn(
        'sticky top-0 z-[1] flex items-center gap-3 border-b border-border-subtle bg-surface-base/90 px-4 py-3 backdrop-blur-sm',
        'motion-reduce:backdrop-blur-none',
        className,
      )}
    >
      <input
        type="text"
        value={title}
        readOnly={!editable || !onTitleChange}
        onChange={(event) => onTitleChange?.(event.target.value)}
        aria-label="Note title"
        placeholder="Untitled"
        className={cn(
          'min-w-0 flex-1 bg-transparent text-lg font-semibold leading-7 text-text-primary',
          'placeholder:text-text-placeholder',
          'outline-none focus-visible:outline-none',
          'ds-transition-fast motion-reduce:transition-none',
        )}
      />
      <Inline gap={8} align="center" className="shrink-0">
        <EditorStatus state={saveState} error={error} />
        {actions}
      </Inline>
    </div>
  );
};
