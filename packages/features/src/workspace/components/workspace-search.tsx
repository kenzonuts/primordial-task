import type { ChangeEvent, ReactElement } from 'react';

import { SearchInput } from '@shared/ui/composites/search-input';
import { cn } from '@shared/ui/lib/cn';

type WorkspaceSearchProps = {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly placeholder?: string;
  readonly className?: string;
  readonly disabled?: boolean;
  readonly id?: string;
};

export const WorkspaceSearch = ({
  value,
  onChange,
  placeholder = 'Search workspaces…',
  className,
  disabled = false,
  id = 'workspace-search',
}: WorkspaceSearchProps): ReactElement => {
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
      aria-label="Search workspaces"
      className={cn('w-full max-w-[320px]', className)}
    />
  );
};

export type { WorkspaceSearchProps };
