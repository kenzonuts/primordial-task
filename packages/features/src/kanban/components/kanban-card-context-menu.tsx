import {
  Archive,
  Copy,
  ExternalLink,
  FolderInput,
  Link2,
  Pencil,
  Pin,
  Star,
  Trash2,
} from 'lucide-react';
import type { ReactElement, ReactNode } from 'react';

import type { Task } from '@features/task/types';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from '@shared/ui/overlays/context-menu';

type KanbanCardContextMenuProps = {
  readonly task: Task;
  readonly children: ReactNode;
  readonly onOpen?: (taskId: string) => void;
  readonly onEdit?: (taskId: string) => void;
  readonly onDuplicate?: (taskId: string) => void;
  readonly onMove?: (taskId: string) => void;
  readonly onArchive?: (taskId: string) => void;
  readonly onDelete?: (taskId: string) => void;
  readonly onCopyLink?: (taskId: string) => void;
  readonly onCopyId?: (taskId: string) => void;
  readonly onTogglePin?: (taskId: string) => void;
  readonly onToggleFavorite?: (taskId: string) => void;
};

export const KanbanCardContextMenu = ({
  task,
  children,
  onOpen,
  onEdit,
  onDuplicate,
  onMove,
  onArchive,
  onDelete,
  onCopyLink,
  onCopyId,
  onTogglePin,
  onToggleFavorite,
}: KanbanCardContextMenuProps): ReactElement => {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent aria-label={`Actions for ${task.title}`}>
        {onOpen ? (
          <ContextMenuItem onSelect={() => onOpen(task.id)}>
            <ExternalLink aria-hidden="true" />
            Open
            <ContextMenuShortcut>↵</ContextMenuShortcut>
          </ContextMenuItem>
        ) : null}
        {onEdit ? (
          <ContextMenuItem onSelect={() => onEdit(task.id)}>
            <Pencil aria-hidden="true" />
            Edit
          </ContextMenuItem>
        ) : null}
        {onDuplicate ? (
          <ContextMenuItem onSelect={() => onDuplicate(task.id)}>
            <Copy aria-hidden="true" />
            Duplicate
          </ContextMenuItem>
        ) : null}
        {onMove ? (
          <ContextMenuItem onSelect={() => onMove(task.id)}>
            <FolderInput aria-hidden="true" />
            Move
          </ContextMenuItem>
        ) : null}

        <ContextMenuSeparator />

        {onTogglePin ? (
          <ContextMenuItem onSelect={() => onTogglePin(task.id)}>
            <Pin aria-hidden="true" />
            {task.isPinned ? 'Unpin' : 'Pin'}
          </ContextMenuItem>
        ) : null}
        {onToggleFavorite ? (
          <ContextMenuItem onSelect={() => onToggleFavorite(task.id)}>
            <Star aria-hidden="true" />
            {task.isFavorite ? 'Remove favorite' : 'Favorite'}
          </ContextMenuItem>
        ) : null}

        <ContextMenuSeparator />

        {onCopyLink ? (
          <ContextMenuItem onSelect={() => onCopyLink(task.id)}>
            <Link2 aria-hidden="true" />
            Copy link
          </ContextMenuItem>
        ) : null}
        {onCopyId ? (
          <ContextMenuItem onSelect={() => onCopyId(task.id)}>
            <Copy aria-hidden="true" />
            Copy ID
          </ContextMenuItem>
        ) : null}

        <ContextMenuSeparator />

        {onArchive ? (
          <ContextMenuItem onSelect={() => onArchive(task.id)}>
            <Archive aria-hidden="true" />
            Archive
          </ContextMenuItem>
        ) : null}
        {onDelete ? (
          <ContextMenuItem variant="danger" onSelect={() => onDelete(task.id)}>
            <Trash2 aria-hidden="true" />
            Delete
          </ContextMenuItem>
        ) : null}
      </ContextMenuContent>
    </ContextMenu>
  );
};

export type { KanbanCardContextMenuProps };
