import type { ReactElement } from 'react';

import type { WorkspaceFilterKey } from '@features/workspace/types';
import { Inline } from '@shared/ui/layout/inline';
import { cn } from '@shared/ui/lib/cn';
import { Button } from '@shared/ui/primitives/button';

type WorkspaceFilterProps = {
  readonly value: WorkspaceFilterKey;
  readonly onChange: (value: WorkspaceFilterKey) => void;
  readonly className?: string;
  readonly disabled?: boolean;
};

const FILTER_OPTIONS: ReadonlyArray<{
  readonly value: WorkspaceFilterKey;
  readonly label: string;
}> = [
  { value: 'all', label: 'All' },
  { value: 'favorites', label: 'Favorites' },
  { value: 'owned', label: 'Owned' },
  { value: 'archived', label: 'Archived' },
];

export const WorkspaceFilter = ({
  value,
  onChange,
  className,
  disabled = false,
}: WorkspaceFilterProps): ReactElement => {
  return (
    <Inline
      gap={4}
      align="center"
      role="group"
      aria-label="Filter workspaces"
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

export type { WorkspaceFilterProps };
