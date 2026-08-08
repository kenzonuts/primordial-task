import type { ChangeEvent, ReactElement } from 'react';
import { useEffect } from 'react';

import { SEARCH_DEBOUNCE_MS } from '@features/calendar/constants';
import { SearchInput } from '@shared/ui/composites/search-input';
import { cn } from '@shared/ui/lib/cn';

type CalendarSearchProps = {
  readonly value: string;
  readonly onChange: (value: string) => void;
  /** Debounced callback (default 150ms). */
  readonly onDebouncedChange?: (value: string) => void;
  readonly debounceMs?: number;
  readonly placeholder?: string;
  readonly className?: string;
  readonly disabled?: boolean;
  readonly id?: string;
};

export const CalendarSearch = ({
  value,
  onChange,
  onDebouncedChange,
  debounceMs = SEARCH_DEBOUNCE_MS,
  placeholder = 'Search calendar…',
  className,
  disabled = false,
  id = 'calendar-search',
}: CalendarSearchProps): ReactElement => {
  useEffect(() => {
    const handleKeyDown = (event: globalThis.KeyboardEvent): void => {
      if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== 'f') {
        return;
      }
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        target.id !== id &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
      ) {
        return;
      }
      event.preventDefault();
      const node = document.getElementById(id);
      if (node instanceof HTMLInputElement) {
        node.focus();
        node.select();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [id]);

  useEffect(() => {
    if (!onDebouncedChange) {
      return;
    }
    const timer = globalThis.setTimeout(() => {
      onDebouncedChange(value);
    }, debounceMs);
    return () => globalThis.clearTimeout(timer);
  }, [value, debounceMs, onDebouncedChange]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onChange(event.target.value);
  };

  return (
    <SearchInput
      id={id}
      value={value}
      onChange={handleChange}
      onClear={() => onChange('')}
      placeholder={placeholder}
      disabled={disabled}
      aria-label="Search calendar"
      className={cn('w-full max-w-[280px]', className)}
    />
  );
};

export type { CalendarSearchProps };
