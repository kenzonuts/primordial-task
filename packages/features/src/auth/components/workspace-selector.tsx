import type { KeyboardEvent, ReactElement } from 'react';

import { WorkspaceCard } from '@features/auth/components/workspace-card';
import type { AuthWorkspace } from '@features/auth/types';
import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import { Button } from '@shared/ui/primitives/button';

type WorkspaceSelectorProps = {
  readonly workspaces: readonly AuthWorkspace[];
  readonly selectedId: string | null;
  readonly onSelect: (workspaceId: string) => void;
  readonly onContinue: () => void;
  readonly loading?: boolean;
  readonly className?: string;
  readonly continueLabel?: string;
};

export const WorkspaceSelector = ({
  workspaces,
  selectedId,
  onSelect,
  onContinue,
  loading = false,
  className,
  continueLabel = 'Continue',
}: WorkspaceSelectorProps): ReactElement => {
  const canContinue = Boolean(selectedId) && !loading;

  const handleGroupKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (workspaces.length === 0) {
      return;
    }

    const available = workspaces.filter((workspace) => !workspace.unavailable);
    if (available.length === 0) {
      return;
    }

    const currentIndex = available.findIndex((workspace) => workspace.id === selectedId);
    let nextIndex = currentIndex;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % available.length;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      nextIndex = currentIndex <= 0 ? available.length - 1 : currentIndex - 1;
    } else if (event.key === 'Enter' && selectedId) {
      event.preventDefault();
      onContinue();
      return;
    } else {
      return;
    }

    onSelect(available[nextIndex]!.id);
  };

  return (
    <Stack gap={32} className={cn('w-full', className)}>
      <div
        role="radiogroup"
        aria-label="Workspaces"
        className="grid grid-cols-1 gap-16 md:grid-cols-2 xl:grid-cols-3"
        onKeyDown={handleGroupKeyDown}
      >
        {workspaces.map((workspace) => (
          <WorkspaceCard
            key={workspace.id}
            workspace={workspace}
            selected={selectedId === workspace.id}
            onSelect={onSelect}
            onActivate={() => onContinue()}
          />
        ))}
      </div>

      <Button
        type="button"
        variant="primary"
        size="lg"
        loading={loading}
        disabled={!canContinue}
        onClick={onContinue}
        className="w-full max-w-[240px] self-end"
      >
        {continueLabel}
      </Button>
    </Stack>
  );
};

export type { WorkspaceSelectorProps };
