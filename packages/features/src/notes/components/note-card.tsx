import { Pin, Star } from 'lucide-react';
import { memo, type KeyboardEvent, type ReactElement } from 'react';

import { NOTE_TYPE_LABELS } from '@features/notes/constants';
import type { Note } from '@features/notes/types';
import { cn } from '@shared/ui/lib/cn';
import { Badge } from '@shared/ui/primitives/badge';
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

type NoteCardProps = {
  readonly note: Note;
  readonly selected?: boolean;
  readonly onOpen?: (note: Note) => void;
  readonly onToggleFavorite?: (note: Note) => void;
  readonly onTogglePinned?: (note: Note) => void;
  readonly className?: string;
};

export const NoteCard = memo(function NoteCard({
  note,
  selected = false,
  onOpen,
  onToggleFavorite,
  onTogglePinned,
  className,
}: NoteCardProps): ReactElement {
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
        'flex flex-col gap-2 rounded-md border border-border-subtle bg-surface-elevated p-3 text-left',
        'hover:bg-state-hover focus-visible:outline-none focus-visible:ds-focus-ring',
        selected && 'border-border-default bg-state-selected',
        className,
      )}
    >
      <div className="flex items-start gap-2">
        <Text as="span" variant="body-sm" className="min-w-0 flex-1 truncate font-medium">
          {note.title || 'Untitled'}
        </Text>
        <div className="flex shrink-0 items-center gap-0.5">
          {onTogglePinned ? (
            <button
              type="button"
              aria-label={note.isPinned ? 'Unpin note' : 'Pin note'}
              className="rounded p-1 text-text-muted hover:bg-state-hover hover:text-text-primary"
              onClick={(event) => {
                event.stopPropagation();
                onTogglePinned(note);
              }}
            >
              <Pin className={cn('size-3.5', note.isPinned && 'text-text-primary')} aria-hidden />
            </button>
          ) : note.isPinned ? (
            <Pin className="size-3.5 text-text-primary" aria-hidden />
          ) : null}
          {onToggleFavorite ? (
            <button
              type="button"
              aria-label={note.isFavorite ? 'Remove favorite' : 'Add favorite'}
              className="rounded p-1 text-text-muted hover:bg-state-hover hover:text-text-primary"
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
          ) : note.isFavorite ? (
            <Star className="size-3.5 fill-current text-text-primary" aria-hidden />
          ) : null}
        </div>
      </div>
      {note.excerpt ? (
        <Text as="p" variant="caption" muted className="line-clamp-2">
          {note.excerpt}
        </Text>
      ) : null}
      <div className="mt-auto flex flex-wrap items-center gap-1.5">
        <Badge variant="neutral" size="sm" className="text-[10px]">
          {NOTE_TYPE_LABELS[note.noteType]}
        </Badge>
        <Text as="span" variant="caption" muted className="ml-auto">
          {formatRelative(note.updatedAt)}
        </Text>
      </div>
    </div>
  );
});

export type { NoteCardProps };
