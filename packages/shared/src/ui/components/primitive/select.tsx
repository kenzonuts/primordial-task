import type { ReactNode, SelectHTMLAttributes } from 'react';
import { useId } from 'react';

import { cn } from '@ui/lib/cn';

export interface SelectOption {
  readonly label: string;
  readonly value: string;
  readonly disabled?: boolean;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  readonly label?: string;
  readonly options: SelectOption[];
  readonly error?: string;
}

export const Select = ({
  label,
  options,
  className,
  id,
  error,
  ...props
}: SelectProps): ReactNode => {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  return (
    <label htmlFor={fieldId} className="flex w-full flex-col gap-1.5">
      {label ? <span className="text-xs font-[560] text-text-primary">{label}</span> : null}
      <select
        id={fieldId}
        className={cn(
          'h-[34px] w-full rounded-sm border bg-input px-3 text-sm text-text-primary outline-none transition-colors duration-[120ms] ease-[cubic-bezier(0.2,0,0,1)]',
          error ? 'border-danger' : 'border-border-default hover:border-border-strong',
          'focus-visible:border-border-strong focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-app',
          className,
        )}
        aria-invalid={Boolean(error)}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <span className="text-xs text-danger">{error}</span> : null}
    </label>
  );
};

interface ComboboxProps {
  readonly label?: string;
  readonly value: string;
  readonly options: SelectOption[];
  readonly onChange: (value: string) => void;
  readonly placeholder?: string;
}

export const Combobox = ({
  label,
  value,
  options,
  onChange,
  placeholder,
}: ComboboxProps): ReactNode => {
  const listId = useId();

  return (
    <label className="flex w-full flex-col gap-1.5">
      {label ? <span className="text-xs font-[560] text-text-primary">{label}</span> : null}
      <input
        role="combobox"
        aria-expanded="false"
        aria-controls={listId}
        aria-autocomplete="list"
        list={listId}
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
        }}
        placeholder={placeholder}
        className="h-[34px] w-full rounded-sm border border-border-default bg-input px-3 text-sm text-text-primary outline-none transition-colors duration-[120ms] ease-[cubic-bezier(0.2,0,0,1)] hover:border-border-strong focus-visible:border-border-strong focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-app"
      />
      <datalist id={listId}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </datalist>
    </label>
  );
};
