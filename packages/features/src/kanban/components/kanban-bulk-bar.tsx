import { Archive, FolderInput, Pin, Star, Tags, Trash2, UserRound, X } from 'lucide-react';
import type { ReactElement } from 'react';

import { TASK_PRIORITY_LABELS, TASK_STATUS_LABELS } from '@features/task/constants';
import {
  TASK_PRIORITIES,
  TASK_STATUSES,
  type TaskPriority,
  type TaskStatus,
} from '@features/task/types';
import { Inline } from '@shared/ui/layout/inline';
import { cn } from '@shared/ui/lib/cn';
import { Button } from '@shared/ui/primitives/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/ui/primitives/select';
import { Text } from '@shared/ui/typography/text';

type KanbanBulkBarProps = {
  readonly selectionCount: number;
  readonly onClearSelection?: () => void;
  readonly onMove?: () => void;
  readonly onArchive?: () => void;
  readonly onDelete?: () => void;
  readonly onAssign?: () => void;
  readonly onPriorityChange?: (priority: TaskPriority) => void;
  readonly onStatusChange?: (status: TaskStatus) => void;
  readonly onLabels?: () => void;
  readonly onPin?: () => void;
  readonly onFavorite?: () => void;
  readonly disabled?: boolean;
  readonly className?: string;
};

export const KanbanBulkBar = ({
  selectionCount,
  onClearSelection,
  onMove,
  onArchive,
  onDelete,
  onAssign,
  onPriorityChange,
  onStatusChange,
  onLabels,
  onPin,
  onFavorite,
  disabled = false,
  className,
}: KanbanBulkBarProps): ReactElement | null => {
  if (selectionCount <= 0) {
    return null;
  }

  return (
    <div
      role="toolbar"
      aria-label="Bulk board actions"
      className={cn(
        'flex flex-wrap items-center gap-8 rounded-lg border border-border-strong bg-surface-elevated px-3 py-2',
        className,
      )}
    >
      <Text as="span" variant="body-sm" className="font-medium">
        {selectionCount} selected
      </Text>

      <Inline gap={4} align="center" className="flex-wrap">
        {onMove ? (
          <Button type="button" size="sm" variant="ghost" disabled={disabled} onClick={onMove}>
            <FolderInput aria-hidden="true" className="size-3.5" />
            Move
          </Button>
        ) : null}

        {onArchive ? (
          <Button type="button" size="sm" variant="ghost" disabled={disabled} onClick={onArchive}>
            <Archive aria-hidden="true" className="size-3.5" />
            Archive
          </Button>
        ) : null}

        {onDelete ? (
          <Button
            type="button"
            size="sm"
            variant="destructive"
            disabled={disabled}
            onClick={onDelete}
          >
            <Trash2 aria-hidden="true" className="size-3.5" />
            Delete
          </Button>
        ) : null}

        {onAssign ? (
          <Button type="button" size="sm" variant="ghost" disabled={disabled} onClick={onAssign}>
            <UserRound aria-hidden="true" className="size-3.5" />
            Assign
          </Button>
        ) : null}

        {onPriorityChange ? (
          <Select
            disabled={disabled}
            onValueChange={(value) => onPriorityChange(value as TaskPriority)}
          >
            <SelectTrigger size="sm" aria-label="Bulk set priority" className="w-[130px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              {TASK_PRIORITIES.map((priority) => (
                <SelectItem key={priority} value={priority}>
                  {TASK_PRIORITY_LABELS[priority]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}

        {onStatusChange ? (
          <Select
            disabled={disabled}
            onValueChange={(value) => onStatusChange(value as TaskStatus)}
          >
            <SelectTrigger size="sm" aria-label="Bulk set status" className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {TASK_STATUSES.filter((status) => status !== 'archived').map((status) => (
                <SelectItem key={status} value={status}>
                  {TASK_STATUS_LABELS[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}

        {onLabels ? (
          <Button type="button" size="sm" variant="ghost" disabled={disabled} onClick={onLabels}>
            <Tags aria-hidden="true" className="size-3.5" />
            Labels
          </Button>
        ) : null}

        {onPin ? (
          <Button type="button" size="sm" variant="ghost" disabled={disabled} onClick={onPin}>
            <Pin aria-hidden="true" className="size-3.5" />
            Pin
          </Button>
        ) : null}

        {onFavorite ? (
          <Button type="button" size="sm" variant="ghost" disabled={disabled} onClick={onFavorite}>
            <Star aria-hidden="true" className="size-3.5" />
            Favorite
          </Button>
        ) : null}
      </Inline>

      {onClearSelection ? (
        <Button
          type="button"
          size="sm"
          variant="ghost"
          disabled={disabled}
          className="ml-auto"
          aria-label="Clear selection"
          onClick={onClearSelection}
        >
          <X aria-hidden="true" className="size-3.5" />
          Clear
        </Button>
      ) : null}
    </div>
  );
};

export type { KanbanBulkBarProps };
