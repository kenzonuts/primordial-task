import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import type { FormEvent, ReactElement } from 'react';
import { useState } from 'react';

import { checklistProgress } from '@features/task/services/task-service';
import type { TaskChecklistItem } from '@features/task/types';
import { Inline } from '@shared/ui/layout/inline';
import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import { Button } from '@shared/ui/primitives/button';
import { Checkbox } from '@shared/ui/primitives/checkbox';
import { IconButton } from '@shared/ui/primitives/icon-button';
import { Input } from '@shared/ui/primitives/input';
import { Progress } from '@shared/ui/primitives/progress';
import { Text } from '@shared/ui/typography/text';

type TaskChecklistProps = {
  readonly items: readonly TaskChecklistItem[];
  readonly onAdd?: (title: string) => void;
  readonly onToggle?: (itemId: string, completed: boolean) => void;
  readonly onEdit?: (itemId: string, title: string) => void;
  readonly onDelete?: (itemId: string) => void;
  readonly onMoveUp?: (itemId: string) => void;
  readonly onMoveDown?: (itemId: string) => void;
  readonly disabled?: boolean;
  readonly className?: string;
};

export const TaskChecklist = ({
  items,
  onAdd,
  onToggle,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  disabled = false,
  className,
}: TaskChecklistProps): ReactElement => {
  const [draft, setDraft] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const completed = items.filter((item) => item.completed).length;
  const progress = checklistProgress(completed, items.length);
  const sorted = [...items].sort((a, b) => a.orderIndex - b.orderIndex);

  const handleAdd = (event: FormEvent): void => {
    event.preventDefault();
    const title = draft.trim();
    if (!title || !onAdd) {
      return;
    }
    onAdd(title);
    setDraft('');
  };

  const startEdit = (item: TaskChecklistItem): void => {
    setEditingId(item.id);
    setEditingTitle(item.title);
  };

  const commitEdit = (): void => {
    if (!editingId || !onEdit) {
      setEditingId(null);
      return;
    }
    const title = editingTitle.trim();
    if (title) {
      onEdit(editingId, title);
    }
    setEditingId(null);
  };

  return (
    <Stack gap={12} className={cn('w-full', className)}>
      <Inline gap={8} align="center" justify="between" className="w-full">
        <Text as="span" variant="body-sm" className="font-medium">
          Checklist
        </Text>
        <Text as="span" variant="caption" muted>
          {completed}/{items.length}
        </Text>
      </Inline>

      {items.length > 0 ? (
        <Progress value={progress} size="thin" aria-label={`Checklist ${progress}% complete`} />
      ) : null}

      <ul aria-label="Checklist items" className="flex flex-col gap-4">
        {sorted.map((item, index) => {
          const isEditing = editingId === item.id;
          return (
            <li
              key={item.id}
              className="flex items-center gap-8 rounded-md border border-border-subtle bg-surface-elevated px-2 py-1.5"
            >
              <Checkbox
                checked={item.completed}
                disabled={disabled || !onToggle}
                aria-label={`Mark ${item.title} ${item.completed ? 'incomplete' : 'complete'}`}
                onCheckedChange={(value) => {
                  onToggle?.(item.id, value === true);
                }}
              />

              {isEditing ? (
                <Input
                  value={editingTitle}
                  size="md"
                  disabled={disabled}
                  aria-label="Edit checklist item"
                  className="min-w-0 flex-1"
                  onChange={(event) => setEditingTitle(event.target.value)}
                  onBlur={commitEdit}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      commitEdit();
                    }
                    if (event.key === 'Escape') {
                      setEditingId(null);
                    }
                  }}
                  autoFocus
                />
              ) : (
                <button
                  type="button"
                  disabled={disabled || !onEdit}
                  className={cn(
                    'min-w-0 flex-1 truncate text-left text-sm outline-none',
                    'focus-visible:ds-focus-ring rounded-sm',
                    item.completed && 'text-text-muted line-through',
                  )}
                  onClick={() => {
                    if (onEdit) {
                      startEdit(item);
                    }
                  }}
                >
                  {item.title}
                </button>
              )}

              <Inline gap={2} align="center" className="shrink-0">
                {onMoveUp ? (
                  <IconButton
                    type="button"
                    size="sm"
                    variant="ghost"
                    disabled={disabled || index === 0}
                    aria-label={`Move ${item.title} up`}
                    onClick={() => onMoveUp(item.id)}
                  >
                    <ArrowUp aria-hidden="true" />
                  </IconButton>
                ) : null}
                {onMoveDown ? (
                  <IconButton
                    type="button"
                    size="sm"
                    variant="ghost"
                    disabled={disabled || index === sorted.length - 1}
                    aria-label={`Move ${item.title} down`}
                    onClick={() => onMoveDown(item.id)}
                  >
                    <ArrowDown aria-hidden="true" />
                  </IconButton>
                ) : null}
                {onDelete ? (
                  <IconButton
                    type="button"
                    size="sm"
                    variant="ghost"
                    disabled={disabled}
                    aria-label={`Delete ${item.title}`}
                    onClick={() => onDelete(item.id)}
                  >
                    <Trash2 aria-hidden="true" />
                  </IconButton>
                ) : null}
              </Inline>
            </li>
          );
        })}
      </ul>

      {onAdd ? (
        <form onSubmit={handleAdd} className="flex items-center gap-8">
          <Input
            value={draft}
            size="md"
            disabled={disabled}
            placeholder="Add checklist item…"
            aria-label="New checklist item"
            className="min-w-0 flex-1"
            onChange={(event) => setDraft(event.target.value)}
          />
          <Button
            type="submit"
            size="sm"
            variant="secondary"
            disabled={disabled || draft.trim().length === 0}
            aria-label="Add checklist item"
          >
            <Plus aria-hidden="true" className="size-4" />
            Add
          </Button>
        </form>
      ) : null}
    </Stack>
  );
};

export type { TaskChecklistProps };
