import type { ReactElement } from 'react';

import type { ProjectFilterKey } from '@features/project/types';
import { Inline } from '@shared/ui/layout/inline';
import { cn } from '@shared/ui/lib/cn';
import { Button } from '@shared/ui/primitives/button';

type ProjectFilterProps = {
  readonly value: ProjectFilterKey;
  readonly onChange: (value: ProjectFilterKey) => void;
  readonly className?: string;
  readonly disabled?: boolean;
};

const FILTER_OPTIONS: ReadonlyArray<{
  readonly value: ProjectFilterKey;
  readonly label: string;
}> = [
  { value: 'all', label: 'All' },
  { value: 'favorites', label: 'Favorites' },
  { value: 'pinned', label: 'Pinned' },
  { value: 'active', label: 'Active' },
  { value: 'archived', label: 'Archived' },
];

export const ProjectFilter = ({
  value,
  onChange,
  className,
  disabled = false,
}: ProjectFilterProps): ReactElement => {
  return (
    <Inline
      gap={4}
      align="center"
      role="group"
      aria-label="Filter projects"
      className={cn('rounded-md border border-border-subtle bg-surface-elevated p-1', className)}
    >
      {FILTER_OPTIONS.map((option) => {
        const isActive = value === option.value;
        return (
          <Button
            key={option.value}
            type="button"
            size="sm"
            variant={isActive ? 'secondary' : 'ghost'}
            disabled={disabled}
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
            className={cn('h-7 px-2.5', isActive && 'bg-state-selected text-text-primary')}
          >
            {option.label}
          </Button>
        );
      })}
    </Inline>
  );
};

export type { ProjectFilterProps };
