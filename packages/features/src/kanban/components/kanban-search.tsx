import type { ChangeEvent, ReactElement, Ref } from 'react';
import { forwardRef, useEffect, useRef } from 'react';

import { KANBAN_SEARCH_DEBOUNCE_MS } from '@features/kanban/constants';
import { SearchInput } from '@shared/ui/composites/search-input';
import { cn } from '@shared/ui/lib/cn';

type KanbanSearchProps = {
  readonly value: string;
  readonly onChange: (value: string) => void;
  /** Called after debounce (default 150ms). Wire to search store debouncedQuery. */
  readonly onDebouncedChange?: (value: string) => void;
  readonly debounceMs?: number;
  readonly placeholder?: string;
  readonly className?: string;
  readonly disabled?: boolean;
  readonly id?: string;
};

const KanbanSearchInner = (
  {
    value,
    onChange,
    onDebouncedChange,
    debounceMs = KANBAN_SEARCH_DEBOUNCE_MS,
    placeholder = 'Search board…',
    className,
    disabled = false,
    id = 'kanban-search',
  }: KanbanSearchProps,
  ref: Ref<HTMLInputElement>,
): ReactElement => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!onDebouncedChange) {
      return;
    }
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      onDebouncedChange(value);
    }, debounceMs);
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [value, debounceMs, onDebouncedChange]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'f') {
        const target = event.target as HTMLElement | null;
        if (target?.closest('[data-kanban-board]')) {
          event.preventDefault();
          const input =
            typeof ref === 'function'
              ? document.getElementById(id)
              : (ref?.current ?? document.getElementById(id));
          if (input instanceof HTMLInputElement) {
            input.focus();
            input.select();
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [id, ref]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onChange(event.target.value);
  };

  return (
    <SearchInput
      ref={ref}
      id={id}
      value={value}
      onChange={handleChange}
      onClear={() => onChange('')}
      placeholder={placeholder}
      disabled={disabled}
      aria-label="Search board tasks"
      className={cn('w-full max-w-[280px]', className)}
    />
  );
};

export const KanbanSearch = forwardRef<HTMLInputElement, KanbanSearchProps>(KanbanSearchInner);
KanbanSearch.displayName = 'KanbanSearch';

export type { KanbanSearchProps };
