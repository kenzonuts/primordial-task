import { X } from 'lucide-react';
import type { ReactElement } from 'react';

import { TaskDetailPanel } from '@features/task/components/task-detail-panel';
import { Inline } from '@shared/ui/layout/inline';
import { cn } from '@shared/ui/lib/cn';
import { IconButton } from '@shared/ui/primitives/icon-button';
import { Text } from '@shared/ui/typography/text';

type KanbanDetailPanelProps = {
  readonly workspaceId: string;
  readonly taskId: string | null;
  readonly open: boolean;
  readonly onClose: () => void;
  readonly className?: string;
};

/**
 * Inline board detail panel. Loads Phase 9 TaskDetail via shared TaskDetailPanel.
 * `workspaceId` is accepted for API symmetry with board pages; TaskDetailPanel
 * resolves the active workspace from TaskProvider.
 */
export const KanbanDetailPanel = ({
  workspaceId,
  taskId,
  open,
  onClose,
  className,
}: KanbanDetailPanelProps): ReactElement | null => {
  if (!open) {
    return null;
  }

  return (
    <aside
      role="complementary"
      aria-label="Task detail"
      className={cn(
        'flex h-full w-[400px] shrink-0 flex-col border-l border-border-subtle bg-surface-panel',
        className,
      )}
      data-workspace-id={workspaceId}
    >
      <Inline
        gap={8}
        align="center"
        justify="between"
        className="h-12 shrink-0 border-b border-border-subtle px-3"
      >
        <Text as="h2" variant="body-sm" className="font-medium">
          Task detail
        </Text>
        <IconButton
          type="button"
          size="sm"
          variant="ghost"
          aria-label="Close detail"
          onClick={onClose}
        >
          <X aria-hidden="true" />
        </IconButton>
      </Inline>

      <div className="min-h-0 flex-1 overflow-hidden">
        <TaskDetailPanel
          taskId={taskId}
          onClose={onClose}
          compact
          className="h-full p-4"
          emptyTitle="No task selected"
          emptyDescription="Select a card on the board to inspect its details."
        />
      </div>
    </aside>
  );
};

export type { KanbanDetailPanelProps };
