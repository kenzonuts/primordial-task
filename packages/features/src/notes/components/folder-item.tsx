import {
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import type { KeyboardEvent, ReactElement } from 'react';

import type { NoteFolder } from '@features/notes/types';
import { cn } from '@shared/ui/lib/cn';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@shared/ui/overlays/dropdown-menu';
import { Button } from '@shared/ui/primitives/button';
import { Text } from '@shared/ui/typography/text';

type FolderItemProps = {
  readonly folder: NoteFolder;
  readonly depth: number;
  readonly expanded: boolean;
  readonly selected: boolean;
  readonly hasChildren: boolean;
  readonly onSelect: (folder: NoteFolder) => void;
  readonly onToggle: (folder: NoteFolder) => void;
  readonly onRename?: (folder: NoteFolder) => void;
  readonly onCreateChild?: (folder: NoteFolder) => void;
  readonly onDelete?: (folder: NoteFolder) => void;
  readonly className?: string;
};

export const FolderItem = ({
  folder,
  depth,
  expanded,
  selected,
  hasChildren,
  onSelect,
  onToggle,
  onRename,
  onCreateChild,
  onDelete,
  className,
}: FolderItemProps): ReactElement => {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect(folder);
    } else if (event.key === 'ArrowRight' && hasChildren && !expanded) {
      event.preventDefault();
      onToggle(folder);
    } else if (event.key === 'ArrowLeft' && hasChildren && expanded) {
      event.preventDefault();
      onToggle(folder);
    }
  };

  const FolderIcon = expanded ? FolderOpen : Folder;

  return (
    <div
      role="treeitem"
      tabIndex={0}
      aria-expanded={hasChildren ? expanded : undefined}
      aria-selected={selected}
      aria-level={depth + 1}
      aria-label={folder.name}
      onClick={() => onSelect(folder)}
      onKeyDown={handleKeyDown}
      className={cn(
        'group flex h-8 items-center gap-1 rounded-md pr-1 text-left',
        'hover:bg-state-hover focus-visible:outline-none focus-visible:ds-focus-ring',
        selected && 'bg-state-selected text-text-primary',
        className,
      )}
      style={{ paddingLeft: 4 + depth * 12 }}
    >
      {hasChildren ? (
        <button
          type="button"
          aria-label={expanded ? `Collapse ${folder.name}` : `Expand ${folder.name}`}
          className="flex size-5 shrink-0 items-center justify-center rounded text-text-muted hover:text-text-primary"
          onClick={(event) => {
            event.stopPropagation();
            onToggle(folder);
          }}
        >
          {expanded ? (
            <ChevronDown className="size-3.5" aria-hidden />
          ) : (
            <ChevronRight className="size-3.5" aria-hidden />
          )}
        </button>
      ) : (
        <span className="size-5 shrink-0" aria-hidden />
      )}
      <FolderIcon className="size-3.5 shrink-0 text-text-muted" aria-hidden />
      <Text as="span" variant="body-sm" className="min-w-0 flex-1 truncate">
        {folder.name}
      </Text>
      {onRename || onCreateChild || onDelete ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-label={`Folder actions for ${folder.name}`}
              className="size-6 p-0 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
              onClick={(event) => event.stopPropagation()}
            >
              <MoreHorizontal className="size-3.5" aria-hidden />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(event) => event.stopPropagation()}>
            {onCreateChild ? (
              <DropdownMenuItem onSelect={() => onCreateChild(folder)}>
                <Plus aria-hidden />
                New subfolder
              </DropdownMenuItem>
            ) : null}
            {onRename ? (
              <DropdownMenuItem onSelect={() => onRename(folder)}>
                <Pencil aria-hidden />
                Rename
              </DropdownMenuItem>
            ) : null}
            {onDelete ? (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-danger focus:text-danger"
                  onSelect={() => onDelete(folder)}
                >
                  <Trash2 aria-hidden />
                  Delete
                </DropdownMenuItem>
              </>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </div>
  );
};

export type { FolderItemProps };
