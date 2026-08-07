import type { ReactElement } from 'react';

import { useKanbanLayoutStore } from '@features/kanban/store/layout-store';
import { PanelContent } from '@features/shell/components/panel-content';
import { PanelHeader } from '@features/shell/components/panel-header';
import { ResizablePanel } from '@features/shell/components/resizable-panel';
import { useUtilityPanelStore } from '@features/shell/store/utility-panel-store';
import type { UtilityPanelMode } from '@features/shell/types';
import { TaskDetailPanel } from '@features/task/components/task-detail-panel';
import { Card, CardDescription, CardHeader, CardTitle } from '@shared/ui/composites/card';
import { cn } from '@shared/ui/lib/cn';
import { Text } from '@shared/ui/typography/text';

type UtilityPanelProps = {
  readonly className?: string;
};

type PanelCardSpec = {
  readonly mode: Exclude<UtilityPanelMode, 'placeholder' | 'task-details'>;
  readonly title: string;
  readonly description: string;
};

const PANEL_CARDS: readonly PanelCardSpec[] = [
  {
    mode: 'ai-summary',
    title: 'AI Summary',
    description: 'Daily overview and productivity signals.',
  },
  {
    mode: 'notifications',
    title: 'Notifications',
    description: 'Mentions, alerts, and workflow updates.',
  },
  {
    mode: 'activity',
    title: 'Activity',
    description: 'Recent changes across the workspace.',
  },
  {
    mode: 'inspector',
    title: 'Inspector',
    description: 'Properties and metadata for the current view.',
  },
] as const;

const MODE_TITLES: Record<UtilityPanelMode, string> = {
  placeholder: 'Utilities',
  'ai-summary': 'AI Summary',
  notifications: 'Notifications',
  'task-details': 'Task Details',
  activity: 'Activity',
  inspector: 'Inspector',
};

const PlaceholderCard = ({
  title,
  description,
  muted = false,
}: {
  readonly title: string;
  readonly description: string;
  readonly muted?: boolean;
}): ReactElement => {
  return (
    <Card variant="compact" className={cn(muted && 'opacity-70')}>
      <CardHeader className="mb-2">
        <CardTitle className="text-sm">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <Text as="p" variant="caption" muted>
        Coming soon
      </Text>
    </Card>
  );
};

export const UtilityPanel = ({ className }: UtilityPanelProps): ReactElement | null => {
  const mode = useUtilityPanelStore((state) => state.mode);
  const setOpen = useUtilityPanelStore((state) => state.setOpen);
  const detailTaskId = useKanbanLayoutStore((state) => state.detailTaskId);
  const closeDetail = useKanbanLayoutStore((state) => state.closeDetail);

  if (mode === 'task-details') {
    return (
      <ResizablePanel className={className} aria-label="Task details">
        <PanelHeader
          title={MODE_TITLES['task-details']}
          onClose={() => {
            closeDetail();
            setOpen(false);
          }}
        />
        <PanelContent className="overflow-hidden p-0">
          <TaskDetailPanel
            taskId={detailTaskId}
            compact
            className="h-full min-h-0 p-16"
            onClose={() => {
              closeDetail();
              setOpen(false);
            }}
            emptyTitle="No task selected"
            emptyDescription="Open a task card from Kanban or Tasks to inspect details here."
          />
        </PanelContent>
      </ResizablePanel>
    );
  }

  const visibleCards =
    mode === 'placeholder' ? PANEL_CARDS : PANEL_CARDS.filter((card) => card.mode === mode);

  return (
    <ResizablePanel className={className} aria-label="Utilities">
      <PanelHeader title={MODE_TITLES[mode]} onClose={() => setOpen(false)} />
      <PanelContent>
        {visibleCards.map((card) => (
          <PlaceholderCard
            key={card.mode}
            title={card.title}
            description={card.description}
            muted={mode === 'placeholder'}
          />
        ))}
      </PanelContent>
    </ResizablePanel>
  );
};

export type { UtilityPanelProps };
