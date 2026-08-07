import { Search, X } from 'lucide-react';
import { type ChangeEvent, type ReactElement, useState } from 'react';

import { cn } from '@shared/ui/lib/cn';
import { IconButton } from '@shared/ui/primitives/icon-button';
import { Input, type InputProps } from '@shared/ui/primitives/input';

type SearchInputProps = Omit<InputProps, 'leading' | 'trailing' | 'type'> & {
  readonly onClear?: () => void;
  readonly clearable?: boolean;
  readonly clearLabel?: string;
};

export const SearchInput = ({
  className,
  value,
  defaultValue,
  onChange,
  onClear,
  clearable = true,
  clearLabel = 'Clear search',
  placeholder = 'Search…',
  ...props
}: SearchInputProps): ReactElement => {
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(() => String(defaultValue ?? ''));
  const currentValue = isControlled ? String(value) : uncontrolledValue;
  const hasValue = currentValue.length > 0;

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (!isControlled) {
      setUncontrolledValue(event.target.value);
    }
    onChange?.(event);
  };

  const handleClear = (): void => {
    if (!isControlled) {
      setUncontrolledValue('');
    }
    onClear?.();
    if (onChange) {
      const event = {
        target: { value: '' },
        currentTarget: { value: '' },
      } as ChangeEvent<HTMLInputElement>;
      onChange(event);
    }
  };

  return (
    <Input
      type="search"
      role="searchbox"
      value={currentValue}
      onChange={handleChange}
      placeholder={placeholder}
      className={cn(className)}
      leading={<Search aria-hidden="true" />}
      trailing={
        clearable && hasValue ? (
          <IconButton
            type="button"
            size="sm"
            variant="ghost"
            aria-label={clearLabel}
            className="-mr-1 size-6"
            onClick={handleClear}
          >
            <X />
          </IconButton>
        ) : undefined
      }
      {...props}
    />
  );
};

export type { SearchInputProps };
