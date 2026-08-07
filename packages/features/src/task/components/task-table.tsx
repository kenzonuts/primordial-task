import { Pin, Star } from 'lucide-react';
import type { ReactElement } from 'react';

import { TaskPriorityBadge } from '@features/task/components/task-priority-badge';
import { TaskStatusBadge } from '@features/task/components/task-status-badge';
import { formatTaskDueDate } from '@features/task/services/task-service';
import type { Task } from '@features/task/types';
import { Inline } from '@shared/ui/layout/inline';
import { cn } from '@shared/ui/lib/cn';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@shared/ui/overlays/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@shared/ui/primitives/avatar';
import { Checkbox } from '@shared/ui/primitives/checkbox';
import { IconButton } from '@shared/ui/primitives/icon-button';
import { Text } from '@shared/ui/typography/text';

type TaskTableProps = {
  readonly tasks: readonly Task[];
  readonly selectedIds?: ReadonlySet<string> | readonly string[];
  readonly onOpen: (taskId: string) => void;
  readonly onSelectChange?: (taskId: string, selected: boolean) => void;
  readonly onSelectAllChange?: (selected: boolean) => void;
  readonly onToggleFavorite: (taskId: string) => void;
  readonly onTogglePinned: (taskId: string) => void;
  readonly className?: string;
};

const hasId = (
  collection: ReadonlySet<string> | readonly string[] | undefined,
  id: string,
): boolean => {
  if (!collection) {
    return false;
  }
  if (collection instanceof Set) {
    return collection.has(id);
  }
  return collection.includes(id);
};

const personInitials = (fullName: string): string => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return '?';
  }
  if (parts.length === 1) {
    return parts[0]!.slice(0, 2).toUpperCase();
  }
  return `${parts[0]![0] ?? ''}${parts[1]![0] ?? ''}`.toUpperCase();
};

export const TaskTable = ({
  tasks,
  selectedIds,
  onOpen,
  onSelectChange,
  onSelectAllChange,
  onToggleFavorite,
  onTogglePinned,
  className,
}: TaskTableProps): ReactElement => {
  const selectable = onSelectChange !== undefined;
  const selectedCount = tasks.filter((task) => hasId(selectedIds, task.id)).length;
  const allSelected = tasks.length > 0 && selectedCount === tasks.length;
  const someSelected = selectedCount > 0 && selectedCount < tasks.length;

  return (
    <div
      className={cn('w-full overflow-x-auto rounded-lg border border-border-default', className)}
    >
      <table className="w-full min-w-[720px] border-collapse text-left" aria-label="Tasks">
        <thead className="bg-surface-elevated">
          <tr className="border-b border-border-subtle">
            {selectable ? (
              <th scope="col" className="w-12 px-3 py-2.5">
                <Checkbox
                  checked={allSelected ? true : someSelected ? 'indeterminate' : false}
                  aria-label="Select all tasks"
                  onCheckedChange={(value) => {
                    onSelectAllChange?.(value === true);
                  }}
                />
              </th>
            ) : null}
            <th scope="col" className="px-3 py-2.5">
              <Text
                as="span"
                variant="caption"
                muted
                className="font-medium uppercase tracking-wide"
              >
                Title
              </Text>
            </th>
            <th scope="col" className="hidden px-3 py-2.5 md:table-cell">
              <Text
                as="span"
                variant="caption"
                muted
                className="font-medium uppercase tracking-wide"
              >
                Project
              </Text>
            </th>
            <th scope="col" className="hidden px-3 py-2.5 lg:table-cell">
              <Text
                as="span"
                variant="caption"
                muted
                className="font-medium uppercase tracking-wide"
              >
                Assignee
              </Text>
            </th>
            <th scope="col" className="px-3 py-2.5">
              <Text
                as="span"
                variant="caption"
                muted
                className="font-medium uppercase tracking-wide"
              >
                Priority
              </Text>
            </th>
            <th scope="col" className="px-3 py-2.5">
              <Text
                as="span"
                variant="caption"
                muted
                className="font-medium uppercase tracking-wide"
              >
                Status
              </Text>
            </th>
            <th scope="col" className="hidden px-3 py-2.5 xl:table-cell">
              <Text
                as="span"
                variant="caption"
                muted
                className="font-medium uppercase tracking-wide"
              >
                Due
              </Text>
            </th>
            <th scope="col" className="w-24 px-3 py-2.5">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            const selected = hasId(selectedIds, task.id);
            const isArchived = task.archivedAt !== null;

            return (
              <tr
                key={task.id}
                data-selected={selected || undefined}
                data-archived={isArchived || undefined}
                className={cn(
                  'border-b border-border-subtle last:border-b-0 ds-transition-fast',
                  'hover:bg-state-hover cursor-pointer',
                  selected && 'bg-state-selected',
                  isArchived && 'opacity-80',
                )}
                onClick={() => onOpen(task.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onOpen(task.id);
                  }
                }}
                tabIndex={0}
                aria-selected={selected}
              >
                {selectable ? (
                  <td className="px-3 py-2.5" onClick={(event) => event.stopPropagation()}>
                    <Checkbox
                      checked={selected}
                      aria-label={`Select ${task.title}`}
                      onCheckedChange={(value) => {
                        onSelectChange(task.id, value === true);
                      }}
                    />
                  </td>
                ) : null}
                <td className="px-3 py-2.5">
                  <Text as="span" variant="body-sm" truncate className="font-medium">
                    {task.title}
                  </Text>
                </td>
                <td className="hidden px-3 py-2.5 md:table-cell">
                  <Text as="span" variant="caption" muted truncate>
                    {task.projectName}
                  </Text>
                </td>
                <td className="hidden px-3 py-2.5 lg:table-cell">
                  {task.assignee ? (
                    <Inline gap={6} align="center">
                      <Avatar size="xs">
                        {task.assignee.avatarUrl ? (
                          <AvatarImage src={task.assignee.avatarUrl} alt="" />
                        ) : null}
                        <AvatarFallback initials={personInitials(task.assignee.fullName)} />
                      </Avatar>
                      <Text as="span" variant="caption" muted truncate>
                        {task.assignee.fullName}
                      </Text>
                    </Inline>
                  ) : (
                    <Text as="span" variant="caption" muted>
                      Unassigned
                    </Text>
                  )}
                </td>
                <td className="px-3 py-2.5">
                  <TaskPriorityBadge priority={task.priority} />
                </td>
                <td className="px-3 py-2.5">
                  <TaskStatusBadge status={task.status} />
                </td>
                <td className="hidden px-3 py-2.5 xl:table-cell">
                  <Text as="span" variant="caption" muted>
                    {formatTaskDueDate(task.dueDate)}
                  </Text>
                </td>
                <td className="px-3 py-2.5" onClick={(event) => event.stopPropagation()}>
                  <TooltipProvider delayDuration={300}>
                    <Inline gap={4} align="center" justify="end">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <IconButton
                            type="button"
                            size="sm"
                            variant={task.isFavorite ? 'selected' : 'ghost'}
                            aria-label={
                              task.isFavorite
                                ? `Remove ${task.title} from favorites`
                                : `Add ${task.title} to favorites`
                            }
                            aria-pressed={task.isFavorite}
                            onClick={() => onToggleFavorite(task.id)}
                            className={cn(task.isFavorite && 'text-warning hover:text-warning')}
                          >
                            <Star
                              className={cn(task.isFavorite && 'fill-current')}
                              aria-hidden="true"
                            />
                          </IconButton>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          {task.isFavorite ? 'Remove favorite' : 'Add favorite'}
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <IconButton
                            type="button"
                            size="sm"
                            variant={task.isPinned ? 'selected' : 'ghost'}
                            aria-label={task.isPinned ? `Unpin ${task.title}` : `Pin ${task.title}`}
                            aria-pressed={task.isPinned}
                            onClick={() => onTogglePinned(task.id)}
                          >
                            <Pin
                              className={cn(task.isPinned && 'fill-current')}
                              aria-hidden="true"
                            />
                          </IconButton>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          {task.isPinned ? 'Unpin task' : 'Pin task'}
                        </TooltipContent>
                      </Tooltip>
                    </Inline>
                  </TooltipProvider>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export type { TaskTableProps };
