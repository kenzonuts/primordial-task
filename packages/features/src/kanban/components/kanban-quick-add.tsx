import { Plus } from 'lucide-react';
import type { FormEvent, KeyboardEvent, ReactElement } from 'react';
import { useId, useState } from 'react';

import { Inline } from '@shared/ui/layout/inline';
import { cn } from '@shared/ui/lib/cn';
import { Button } from '@shared/ui/primitives/button';
import { Input } from '@shared/ui/primitives/input';

type KanbanQuickAddProps = {
  readonly columnId: string;
  readonly onAdd: (columnId: string, title: string) => void | Promise<void>;
  readonly placeholder?: string;
  readonly disabled?: boolean;
  readonly loading?: boolean;
  readonly className?: string;
};

export const KanbanQuickAdd = ({
  columnId,
  onAdd,
  placeholder = 'Add task…',
  disabled = false,
  loading = false,
  className,
}: KanbanQuickAddProps): ReactElement => {
  const inputId = useId();
  const [title, setTitle] = useState('');
  const [expanded, setExpanded] = useState(false);
  const canSubmit = title.trim().length > 0 && !disabled && !loading;

  const submit = async (): Promise<void> => {
    const trimmed = title.trim();
    if (!trimmed || disabled || loading) {
      return;
    }
    await onAdd(columnId, trimmed);
    setTitle('');
  };

  const handleSubmit = (event: FormEvent): void => {
    event.preventDefault();
    void submit();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void submit();
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      setTitle('');
      setExpanded(false);
    }
  };

  if (!expanded) {
    return (
      <Button
        type="button"
        size="sm"
        variant="ghost"
        disabled={disabled}
        className={cn('w-full justify-start text-text-muted', className)}
        onClick={() => setExpanded(true)}
      >
        <Plus aria-hidden="true" className="size-3.5" />
        Add task
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn('w-full', className)} aria-label="Quick add task">
      <Inline gap={6} align="center" className="w-full">
        <Input
          id={inputId}
          value={title}
          size="sm"
          autoFocus
          disabled={disabled || loading}
          placeholder={placeholder}
          aria-label="Task title"
          className="min-w-0 flex-1"
          onChange={(event) => setTitle(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            if (!title.trim()) {
              setExpanded(false);
            }
          }}
        />
        <Button
          type="submit"
          size="sm"
          variant="secondary"
          disabled={!canSubmit}
          loading={loading}
          aria-label="Create task"
        >
          Add
        </Button>
      </Inline>
    </form>
  );
};

export type { KanbanQuickAddProps };
