import { Archive, Columns3, MoreHorizontal, Pencil, Shrink, Trash2 } from 'lucide-react';
import type { ReactElement } from 'react';

import { COLUMN_WIDTH_LABELS } from '@features/kanban/constants';
import type { ColumnWidthPreset, KanbanColumn } from '@features/kanban/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@shared/ui/overlays/dropdown-menu';
import { IconButton } from '@shared/ui/primitives/icon-button';

type ColumnMenuProps = {
  readonly column: KanbanColumn;
  readonly onRename?: (columnId: string) => void;
  readonly onToggleCollapse?: (columnId: string) => void;
  readonly onArchive?: (columnId: string) => void;
  readonly onDelete?: (columnId: string) => void;
  readonly onWidthChange?: (columnId: string, width: ColumnWidthPreset) => void;
  readonly onWipChange?: (columnId: string) => void;
  readonly disabled?: boolean;
};

export const ColumnMenu = ({
  column,
  onRename,
  onToggleCollapse,
  onArchive,
  onDelete,
  onWidthChange,
  onWipChange,
  disabled = false,
}: ColumnMenuProps): ReactElement => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton
          type="button"
          size="sm"
          variant="ghost"
          disabled={disabled}
          aria-label={`Column menu for ${column.name}`}
        >
          <MoreHorizontal aria-hidden="true" />
        </IconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[200px]">
        <DropdownMenuLabel>{column.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {onRename ? (
          <DropdownMenuItem
            disabled={column.isSystem && false}
            onSelect={() => onRename(column.id)}
          >
            <Pencil aria-hidden="true" className="size-4" />
            Rename
          </DropdownMenuItem>
        ) : null}

        {onToggleCollapse ? (
          <DropdownMenuItem onSelect={() => onToggleCollapse(column.id)}>
            <Shrink aria-hidden="true" className="size-4" />
            {column.collapsed ? 'Expand' : 'Collapse'}
          </DropdownMenuItem>
        ) : null}

        {onWipChange ? (
          <DropdownMenuItem onSelect={() => onWipChange(column.id)}>
            <Columns3 aria-hidden="true" className="size-4" />
            {column.wipLimit != null ? `WIP limit (${column.wipLimit})` : 'Set WIP limit'}
          </DropdownMenuItem>
        ) : null}

        {onWidthChange ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Width</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={column.widthPreset}
              onValueChange={(value) => onWidthChange(column.id, value as ColumnWidthPreset)}
            >
              {(Object.keys(COLUMN_WIDTH_LABELS) as ColumnWidthPreset[]).map((preset) => (
                <DropdownMenuRadioItem key={preset} value={preset}>
                  {COLUMN_WIDTH_LABELS[preset]}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </>
        ) : null}

        <DropdownMenuSeparator />

        {onArchive ? (
          <DropdownMenuItem disabled={column.isSystem} onSelect={() => onArchive(column.id)}>
            <Archive aria-hidden="true" className="size-4" />
            Archive
          </DropdownMenuItem>
        ) : null}

        {onDelete ? (
          <DropdownMenuItem
            disabled={column.isSystem}
            className="text-danger focus:bg-danger-bg"
            onSelect={() => onDelete(column.id)}
          >
            <Trash2 aria-hidden="true" className="size-4" />
            Delete
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export type { ColumnMenuProps };
