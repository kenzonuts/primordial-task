import { Archive, Copy, ExternalLink, FolderInput, Pencil, Trash2 } from 'lucide-react';
import type { ReactElement, ReactNode } from 'react';

import type { CalendarEvent } from '@features/calendar/types';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from '@shared/ui/overlays/context-menu';

type EventContextMenuProps = {
  readonly event: CalendarEvent;
  readonly children: ReactNode;
  readonly onOpen?: (event: CalendarEvent) => void;
  readonly onEdit?: (event: CalendarEvent) => void;
  readonly onDuplicate?: (event: CalendarEvent) => void;
  readonly onMove?: (event: CalendarEvent) => void;
  readonly onArchive?: (event: CalendarEvent) => void;
  readonly onDelete?: (event: CalendarEvent) => void;
  readonly onCopyId?: (event: CalendarEvent) => void;
};

export const EventContextMenu = ({
  event,
  children,
  onOpen,
  onEdit,
  onDuplicate,
  onMove,
  onArchive,
  onDelete,
  onCopyId,
}: EventContextMenuProps): ReactElement => {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent aria-label={`Actions for ${event.title}`}>
        {onOpen ? (
          <ContextMenuItem onSelect={() => onOpen(event)}>
            <ExternalLink aria-hidden="true" />
            Open
            <ContextMenuShortcut>↵</ContextMenuShortcut>
          </ContextMenuItem>
        ) : null}
        {onEdit ? (
          <ContextMenuItem onSelect={() => onEdit(event)}>
            <Pencil aria-hidden="true" />
            Edit
          </ContextMenuItem>
        ) : null}
        {onDuplicate ? (
          <ContextMenuItem onSelect={() => onDuplicate(event)}>
            <Copy aria-hidden="true" />
            Duplicate
          </ContextMenuItem>
        ) : null}
        {onMove ? (
          <ContextMenuItem onSelect={() => onMove(event)}>
            <FolderInput aria-hidden="true" />
            Move
          </ContextMenuItem>
        ) : null}

        <ContextMenuSeparator />

        {onCopyId ? (
          <ContextMenuItem
            onSelect={() => {
              void navigator.clipboard?.writeText(event.taskId);
              onCopyId(event);
            }}
          >
            <Copy aria-hidden="true" />
            Copy ID
          </ContextMenuItem>
        ) : null}

        <ContextMenuSeparator />

        {onArchive ? (
          <ContextMenuItem onSelect={() => onArchive(event)}>
            <Archive aria-hidden="true" />
            Archive
          </ContextMenuItem>
        ) : null}
        {onDelete ? (
          <ContextMenuItem
            onSelect={() => onDelete(event)}
            className="text-danger focus:text-danger"
          >
            <Trash2 aria-hidden="true" />
            Delete
          </ContextMenuItem>
        ) : null}
      </ContextMenuContent>
    </ContextMenu>
  );
};

export type { EventContextMenuProps };
