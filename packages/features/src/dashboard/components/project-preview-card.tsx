import type { ReactElement } from 'react';

import type { DashboardProjectPreview } from '@features/dashboard/types';
import { Inline } from '@shared/ui/layout/inline';
import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import { Badge } from '@shared/ui/primitives/badge';
import { Progress } from '@shared/ui/primitives/progress';
import { Text } from '@shared/ui/typography/text';

type ProjectPreviewCardProps = {
  readonly project: DashboardProjectPreview;
  readonly onOpen?: (projectId: string) => void;
  readonly className?: string;
};

const statusBadge = (
  status: DashboardProjectPreview['status'],
): { readonly label: string; readonly variant: 'neutral' | 'warning' | 'danger' | 'success' } => {
  switch (status) {
    case 'at_risk':
      return { label: 'At risk', variant: 'warning' };
    case 'blocked':
      return { label: 'Blocked', variant: 'danger' };
    case 'on_track':
    default:
      return { label: 'On track', variant: 'neutral' };
  }
};

export const ProjectPreviewCard = ({
  project,
  onOpen,
  className,
}: ProjectPreviewCardProps): ReactElement => {
  const status = statusBadge(project.status);
  const progressLabel = `${Math.round(project.progress)}% complete`;

  return (
    <div
      role={onOpen ? 'button' : undefined}
      tabIndex={onOpen ? 0 : undefined}
      className={cn(
        'w-full rounded-md px-1.5 py-2 outline-none ds-transition-fast',
        onOpen && 'cursor-pointer hover:bg-state-hover focus-visible:ds-focus-ring',
        className,
      )}
      onClick={
        onOpen
          ? () => {
              onOpen(project.id);
            }
          : undefined
      }
      onKeyDown={
        onOpen
          ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onOpen(project.id);
              }
            }
          : undefined
      }
    >
      <Stack gap={8}>
        <Inline gap={8} align="center" justify="between" className="w-full min-w-0">
          <Text as="p" variant="body-sm" truncate className="min-w-0 font-medium">
            {project.name}
          </Text>
          <Badge variant={status.variant} size="sm" className="shrink-0">
            {status.label}
          </Badge>
        </Inline>

        <Stack gap={4}>
          <Inline gap={8} align="center" justify="between" className="w-full">
            <Text as="span" variant="caption" muted className="tabular-nums">
              {Math.round(project.progress)}%
            </Text>
            <Text as="span" variant="caption" muted>
              {project.updatedLabel}
            </Text>
          </Inline>
          <Progress value={project.progress} size="thin" aria-label={progressLabel} />
        </Stack>
      </Stack>
    </div>
  );
};

export type { ProjectPreviewCardProps };
