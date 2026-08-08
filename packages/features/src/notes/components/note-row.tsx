import { Pin, Star } from 'lucide-react';
import { memo, type KeyboardEvent, type ReactElement } from 'react';

import { NOTE_TYPE_LABELS } from '@features/notes/constants';
import type { Note } from '@features/notes/types';
import { cn } from '@shared/ui/lib/cn';
import { Text } from '@shared/ui/typography/text';

const formatRelative = (ms: number): string => {
  const diff = Date.now() - ms;
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) {
    return 'Just now';
  }
  if (minutes < 60) {
    return `${minutes}m ago`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }
  const days = Math.floor(hours / 24);
  if (days < 14) {
    return `${days}d ago`;
  }
  return new Date(ms).toLocaleDateString();
};

type NoteRowProps = {
  readonly note: Note;
  readonly selected?: boolean;
  readonly depth?: number;
  readonly onOpen?: (note: Note) => void;
  readonly onToggleFavorite?: (note: Note) => void;
  readonly onTogglePinned?: (note: Note) => void;
  readonly className?: string;
};

export const NoteRow = memo(function NoteRow({
  note,
  selected = false,
  depth = 0,
  onOpen,
  onToggleFavorite,
  onTogglePinned,
  className,
}: NoteRowProps): ReactElement {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onOpen?.(note);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Open note ${note.title}`}
      aria-pressed={selected}
      onClick={() => onOpen?.(note)}
      onKeyDown={handleKeyDown}
      className={cn(
        'group flex h-10 items-center gap-3 border-b border-border-subtle px-2 text-left',
        'hover:bg-state-hover focus-visible:outline-none focus-visible:ds-focus-ring',
        selected && 'bg-state-selected',
        className,
      )}
      style={{ paddingLeft: 8 + depth * 16 }}
    >
      <Text as="span" variant="body-sm" className="min-w-0 flex-1 truncate font-medium">
        {note.title || 'Untitled'}
      </Text>
      <Text as="span" variant="caption" muted className="hidden shrink-0 sm:inline">
        {NOTE_TYPE_LABELS[note.noteType]}
      </Text>
      <Text as="span" variant="caption" muted className="w-16 shrink-0 text-right">
        {formatRelative(note.updatedAt)}
      </Text>
      <div className="flex w-14 shrink-0 items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100">
        {onTogglePinned ? (
          <button
            type="button"
            aria-label={note.isPinned ? 'Unpin note' : 'Pin note'}
            className="rounded p-1 text-text-muted hover:text-text-primary"
            onClick={(event) => {
              event.stopPropagation();
              onTogglePinned(note);
            }}
          >
            <Pin
              className={cn('size-3.5', note.isPinned && 'text-text-primary opacity-100')}
              aria-hidden
            />
          </button>
        ) : null}
        {onToggleFavorite ? (
          <button
            type="button"
            aria-label={note.isFavorite ? 'Remove favorite' : 'Add favorite'}
            className="rounded p-1 text-text-muted hover:text-text-primary"
            onClick={(event) => {
              event.stopPropagation();
              onToggleFavorite(note);
            }}
          >
            <Star
              className={cn('size-3.5', note.isFavorite && 'fill-current text-text-primary')}
              aria-hidden
            />
          </button>
        ) : null}
      </div>
    </div>
  );
});

export type { NoteRowProps };
