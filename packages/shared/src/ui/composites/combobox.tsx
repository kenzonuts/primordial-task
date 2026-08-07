import { Check, ChevronsUpDown } from 'lucide-react';
import {
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
  useId,
  useState,
} from 'react';

import { cn } from '@shared/ui/lib/cn';
import { Popover, PopoverContent, PopoverTrigger } from '@shared/ui/overlays/popover';
import { Input } from '@shared/ui/primitives/input';

type ComboboxOption = {
  readonly value: string;
  readonly label: ReactNode;
  readonly disabled?: boolean;
};

type ComboboxProps = {
  readonly options: readonly ComboboxOption[];
  readonly value?: string;
  readonly defaultValue?: string;
  readonly onValueChange?: (value: string) => void;
  readonly open?: boolean;
  readonly defaultOpen?: boolean;
  readonly onOpenChange?: (open: boolean) => void;
  readonly placeholder?: string;
  readonly emptyMessage?: string;
  readonly disabled?: boolean;
  readonly className?: string;
  readonly inputProps?: Omit<ComponentPropsWithoutRef<typeof Input>, 'value' | 'onChange'>;
  readonly 'aria-label'?: string;
};

export const Combobox = ({
  options,
  value: valueProp,
  defaultValue = '',
  onValueChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  placeholder = 'Select…',
  emptyMessage = 'No results',
  disabled = false,
  className,
  inputProps,
  'aria-label': ariaLabel = 'Combobox',
}: ComboboxProps): ReactElement => {
  const listboxId = useId();
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const [query, setQuery] = useState('');

  const open = openProp ?? uncontrolledOpen;
  const value = valueProp ?? uncontrolledValue;

  const setOpen = (next: boolean): void => {
    if (openProp === undefined) {
      setUncontrolledOpen(next);
    }
    onOpenChange?.(next);
  };

  const setValue = (next: string): void => {
    if (valueProp === undefined) {
      setUncontrolledValue(next);
    }
    onValueChange?.(next);
  };

  const selected = options.find((option) => option.value === value);
  const filtered = options.filter((option) => {
    if (!query) {
      return true;
    }
    const labelText = typeof option.label === 'string' ? option.label : option.value;
    return labelText.toLowerCase().includes(query.toLowerCase());
  });

  const handleSelect = (next: string): void => {
    setValue(next);
    setQuery('');
    setOpen(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'ArrowDown' || event.key === 'Enter') {
      setOpen(true);
    }
    if (event.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-label={ariaLabel}
          disabled={disabled}
          className={cn(
            'flex h-8 w-full items-center justify-between gap-2 rounded-md border border-border-default',
            'bg-surface-input px-3 text-left text-sm text-text-primary ds-transition-fast',
            'hover:border-border-strong focus-visible:outline-none focus-visible:ds-focus-ring',
            'disabled:cursor-not-allowed disabled:opacity-[var(--opacity-disabled)]',
            className,
          )}
        >
          <span className={cn('truncate', !selected && 'text-text-placeholder')}>
            {selected?.label ?? placeholder}
          </span>
          <ChevronsUpDown className="size-4 shrink-0 text-text-muted" aria-hidden="true" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-2" align="start">
        <Input
          size="sm"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Filter…"
          aria-autocomplete="list"
          aria-controls={listboxId}
          {...inputProps}
        />
        <ul
          id={listboxId}
          role="listbox"
          aria-label={ariaLabel}
          className="mt-2 max-h-60 overflow-y-auto"
        >
          {filtered.length === 0 ? (
            <li className="px-2 py-3 text-center text-sm text-text-muted">{emptyMessage}</li>
          ) : (
            filtered.map((option) => {
              const isSelected = option.value === value;
              return (
                <li key={option.value} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    disabled={option.disabled}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm',
                      'outline-none focus-visible:ds-focus-ring',
                      'hover:bg-state-hover disabled:opacity-[var(--opacity-disabled)]',
                      isSelected && 'bg-state-selected',
                    )}
                    onClick={() => handleSelect(option.value)}
                  >
                    <span className="min-w-0 flex-1 truncate">{option.label}</span>
                    {isSelected ? (
                      <Check className="size-4 shrink-0 text-text-primary" aria-hidden="true" />
                    ) : null}
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </PopoverContent>
    </Popover>
  );
};

export type { ComboboxProps, ComboboxOption };
