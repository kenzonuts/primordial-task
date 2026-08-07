import { CalendarDays, FolderPlus, Plus, Sparkles } from 'lucide-react';
import type { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDashboardStore } from '@features/dashboard/store/dashboard-store';
import { APP_ROUTES } from '@features/shell/types';
import { useWorkspaceContext } from '@features/workspace/context/workspace-context';
import { toast } from '@shared/ui/feedback/toast';
import { Icon } from '@shared/ui/icons/icon';
import { Inline } from '@shared/ui/layout/inline';
import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import { Button } from '@shared/ui/primitives/button';
import { Heading } from '@shared/ui/typography/heading';
import { Text } from '@shared/ui/typography/text';

type DashboardHeaderProps = {
  readonly greeting?: string;
  readonly dateLabel?: string;
  readonly workspaceName?: string;
  readonly summaryLine?: string;
  readonly lastSyncLabel?: string;
  readonly className?: string;
};

const showComingSoon = (label: string): void => {
  toast.message(`${label} — Coming soon`);
};

export const DashboardHeader = ({
  greeting,
  dateLabel,
  workspaceName,
  summaryLine,
  lastSyncLabel,
  className,
}: DashboardHeaderProps): ReactElement => {
  const navigate = useNavigate();
  const { currentWorkspace } = useWorkspaceContext();
  const summary = useDashboardStore((state) => state.summary);

  const resolvedGreeting = greeting ?? summary?.greeting ?? 'Welcome back.';
  const resolvedDate = dateLabel ?? summary?.dateLabel ?? '';
  const resolvedWorkspace =
    workspaceName ?? summary?.workspaceName ?? currentWorkspace?.name ?? 'Workspace';
  const resolvedSummary =
    summaryLine ?? summary?.summaryLine ?? 'Your workspace overview will appear here.';
  const resolvedSync = lastSyncLabel ?? summary?.lastSyncLabel ?? 'Sync pending';

  return (
    <Inline
      gap={16}
      align="start"
      justify="between"
      className={cn('w-full min-w-0 flex-wrap', className)}
    >
      <Stack gap={8} className="min-w-0 flex-1">
        <Heading level={1} className="truncate">
          {resolvedGreeting}
        </Heading>
        <Inline gap={8} align="center" wrap className="min-w-0">
          {resolvedDate ? (
            <Text as="p" variant="body-md" muted>
              {resolvedDate}
            </Text>
          ) : null}
          {resolvedDate ? (
            <Text as="span" variant="body-md" muted aria-hidden="true">
              ·
            </Text>
          ) : null}
          <Text as="p" variant="body-md" className="truncate font-medium">
            {resolvedWorkspace}
          </Text>
        </Inline>
        <Text as="p" variant="body-md" muted className="max-w-[720px]">
          {resolvedSummary}
        </Text>
        <Text as="p" variant="caption" muted>
          {resolvedSync}
        </Text>
      </Stack>

      <Inline gap={8} align="center" wrap className="shrink-0">
        <Button
          type="button"
          variant="primary"
          size="md"
          leftIcon={<Icon icon={Plus} size="dense" decorative />}
          onClick={() => {
            showComingSoon('New Task');
          }}
        >
          New Task
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="md"
          leftIcon={<Icon icon={FolderPlus} size="dense" decorative />}
          onClick={() => {
            showComingSoon('New Project');
          }}
        >
          New Project
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="md"
          leftIcon={<Icon icon={Sparkles} size="dense" decorative />}
          onClick={() => {
            showComingSoon('Ask AI');
          }}
        >
          Ask AI
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="md"
          leftIcon={<Icon icon={CalendarDays} size="dense" decorative />}
          onClick={() => {
            void navigate(APP_ROUTES.calendar);
          }}
        >
          Calendar
        </Button>
      </Inline>
    </Inline>
  );
};

export type { DashboardHeaderProps };
