import type { ReactElement, ReactNode } from 'react';
import { useMemo } from 'react';

import { NoteCard } from '@features/notes/components/note-card';
import { NoteEmptyState, type NoteEmptyVariant } from '@features/notes/components/note-empty-state';
import { NoteRow } from '@features/notes/components/note-row';
import type { Note, NoteFolder, NoteViewMode } from '@features/notes/types';
import { cn } from '@shared/ui/lib/cn';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@shared/ui/overlays/context-menu';
import { Text } from '@shared/ui/typography/text';

type NotesExplorerProps = {
  readonly notes: readonly Note[];
  readonly folders?: readonly NoteFolder[];
  readonly view: NoteViewMode;
  readonly emptyVariant?: NoteEmptyVariant;
  readonly emptyAction?: ReactNode;
  readonly selectedNoteId?: string | null;
  readonly onOpen?: (note: Note) => void;
  readonly onToggleFavorite?: (note: Note) => void;
  readonly onTogglePinned?: (note: Note) => void;
  readonly onDuplicate?: (note: Note) => void;
  readonly onArchive?: (note: Note) => void;
  readonly onDelete?: (note: Note) => void;
  readonly onMove?: (note: Note) => void;
  readonly onRestore?: (note: Note) => void;
  readonly className?: string;
};

const NoteActionsMenu = ({
  note,
  children,
  onOpen,
  onToggleFavorite,
  onTogglePinned,
  onDuplicate,
  onArchive,
  onDelete,
  onMove,
  onRestore,
}: {
  readonly note: Note;
  readonly children: ReactNode;
  readonly onOpen?: (note: Note) => void;
  readonly onToggleFavorite?: (note: Note) => void;
  readonly onTogglePinned?: (note: Note) => void;
  readonly onDuplicate?: (note: Note) => void;
  readonly onArchive?: (note: Note) => void;
  readonly onDelete?: (note: Note) => void;
  readonly onMove?: (note: Note) => void;
  readonly onRestore?: (note: Note) => void;
}): ReactElement => {
  const inTrash = note.deletedAt != null;

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent aria-label={`Actions for ${note.title}`}>
        {onOpen ? <ContextMenuItem onSelect={() => onOpen(note)}>Open</ContextMenuItem> : null}
        {inTrash ? (
          onRestore ? (
            <ContextMenuItem onSelect={() => onRestore(note)}>Restore</ContextMenuItem>
          ) : null
        ) : (
          <>
            {onToggleFavorite ? (
              <ContextMenuItem onSelect={() => onToggleFavorite(note)}>
                {note.isFavorite ? 'Remove favorite' : 'Favorite'}
              </ContextMenuItem>
            ) : null}
            {onTogglePinned ? (
              <ContextMenuItem onSelect={() => onTogglePinned(note)}>
                {note.isPinned ? 'Unpin' : 'Pin'}
              </ContextMenuItem>
            ) : null}
            {onMove ? <ContextMenuItem onSelect={() => onMove(note)}>Move…</ContextMenuItem> : null}
            {onDuplicate ? (
              <ContextMenuItem onSelect={() => onDuplicate(note)}>Duplicate</ContextMenuItem>
            ) : null}
            <ContextMenuSeparator />
            {onArchive ? (
              <ContextMenuItem onSelect={() => onArchive(note)}>Archive</ContextMenuItem>
            ) : null}
            {onDelete ? (
              <ContextMenuItem
                className="text-danger focus:text-danger"
                onSelect={() => onDelete(note)}
              >
                Move to trash
              </ContextMenuItem>
            ) : null}
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
};

export const NotesExplorer = ({
  notes,
  folders = [],
  view,
  emptyVariant = 'none',
  emptyAction,
  selectedNoteId = null,
  onOpen,
  onToggleFavorite,
  onTogglePinned,
  onDuplicate,
  onArchive,
  onDelete,
  onMove,
  onRestore,
  className,
}: NotesExplorerProps): ReactElement => {
  const folderNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const folder of folders) {
      map.set(folder.id, folder.name);
    }
    return map;
  }, [folders]);

  if (notes.length === 0) {
    return <NoteEmptyState variant={emptyVariant} action={emptyAction} className={className} />;
  }

  if (view === 'grid') {
    return (
      <div
        className={cn('grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3', className)}
        role="list"
        aria-label="Notes grid"
      >
        {notes.map((note) => (
          <NoteActionsMenu
            key={note.id}
            note={note}
            onOpen={onOpen}
            onToggleFavorite={onToggleFavorite}
            onTogglePinned={onTogglePinned}
            onDuplicate={onDuplicate}
            onArchive={onArchive}
            onDelete={onDelete}
            onMove={onMove}
            onRestore={onRestore}
          >
            <div role="listitem">
              <NoteCard
                note={note}
                selected={selectedNoteId === note.id}
                onOpen={onOpen}
                onToggleFavorite={onToggleFavorite}
                onTogglePinned={onTogglePinned}
              />
            </div>
          </NoteActionsMenu>
        ))}
      </div>
    );
  }

  if (view === 'tree') {
    const byFolder = new Map<string | null, Note[]>();
    for (const note of notes) {
      const key = note.folderId;
      const bucket = byFolder.get(key) ?? [];
      bucket.push(note);
      byFolder.set(key, bucket);
    }
    const folderKeys = [...byFolder.keys()].sort((a, b) => {
      if (a == null) {
        return -1;
      }
      if (b == null) {
        return 1;
      }
      return (folderNameById.get(a) ?? a).localeCompare(folderNameById.get(b) ?? b);
    });

    return (
      <div className={cn('flex flex-col p-2', className)} role="list" aria-label="Notes tree">
        {folderKeys.map((folderId) => {
          const items = byFolder.get(folderId) ?? [];
          const label = folderId == null ? 'Unfiled' : (folderNameById.get(folderId) ?? 'Folder');
          return (
            <div key={folderId ?? 'unfiled'} className="mb-3">
              <Text
                variant="caption"
                muted
                className="mb-1 px-2 uppercase tracking-wide font-medium"
              >
                {label}
              </Text>
              {items.map((note) => (
                <NoteActionsMenu
                  key={note.id}
                  note={note}
                  onOpen={onOpen}
                  onToggleFavorite={onToggleFavorite}
                  onTogglePinned={onTogglePinned}
                  onDuplicate={onDuplicate}
                  onArchive={onArchive}
                  onDelete={onDelete}
                  onMove={onMove}
                  onRestore={onRestore}
                >
                  <div role="listitem">
                    <NoteRow
                      note={note}
                      depth={1}
                      selected={selectedNoteId === note.id}
                      onOpen={onOpen}
                      onToggleFavorite={onToggleFavorite}
                      onTogglePinned={onTogglePinned}
                    />
                  </div>
                </NoteActionsMenu>
              ))}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col', className)} role="list" aria-label="Notes list">
      {notes.map((note) => (
        <NoteActionsMenu
          key={note.id}
          note={note}
          onOpen={onOpen}
          onToggleFavorite={onToggleFavorite}
          onTogglePinned={onTogglePinned}
          onDuplicate={onDuplicate}
          onArchive={onArchive}
          onDelete={onDelete}
          onMove={onMove}
          onRestore={onRestore}
        >
          <div role="listitem">
            <NoteRow
              note={note}
              selected={selectedNoteId === note.id}
              onOpen={onOpen}
              onToggleFavorite={onToggleFavorite}
              onTogglePinned={onTogglePinned}
            />
          </div>
        </NoteActionsMenu>
      ))}
    </div>
  );
};

export type { NotesExplorerProps };
