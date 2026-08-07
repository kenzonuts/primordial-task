import { Plus } from 'lucide-react';
import type { FormEvent, KeyboardEvent, ReactElement } from 'react';
import { useState } from 'react';

import { Inline } from '@shared/ui/layout/inline';
import { cn } from '@shared/ui/lib/cn';
import { Button } from '@shared/ui/primitives/button';
import { Input } from '@shared/ui/primitives/input';

type QuickCreateTaskProps = {
  readonly onCreate: (title: string) => void | Promise<void>;
  readonly placeholder?: string;
  readonly disabled?: boolean;
  readonly loading?: boolean;
  readonly className?: string;
};

export const QuickCreateTask = ({
  onCreate,
  placeholder = 'Quick create task…',
  disabled = false,
  loading = false,
  className,
}: QuickCreateTaskProps): ReactElement => {
  const [title, setTitle] = useState('');
  const canSubmit = title.trim().length > 0 && !disabled && !loading;

  const submit = async (): Promise<void> => {
    const trimmed = title.trim();
    if (!trimmed || disabled || loading) {
      return;
    }
    await onCreate(trimmed);
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
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('min-w-[240px] max-w-[420px] flex-1', className)}
      aria-label="Quick create task"
    >
      <Inline gap={8} align="center" className="w-full">
        <Input
          value={title}
          size="md"
          disabled={disabled || loading}
          placeholder={placeholder}
          aria-label="Task title"
          className="min-w-0 flex-1"
          onChange={(event) => setTitle(event.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button
          type="submit"
          size="sm"
          variant="secondary"
          disabled={!canSubmit}
          loading={loading}
          aria-label="Create task"
        >
          <Plus aria-hidden="true" className="size-4" />
          Add
        </Button>
      </Inline>
    </form>
  );
};

export type { QuickCreateTaskProps };
