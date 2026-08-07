import type { ReactElement, ReactNode } from 'react';

import { ProjectAvatar } from '@features/project/components/project-avatar';
import { ProjectCover } from '@features/project/components/project-cover';
import { ProjectStatusBadge } from '@features/project/components/project-status-badge';
import type { Project } from '@features/project/types';
import { Inline } from '@shared/ui/layout/inline';
import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import { Heading } from '@shared/ui/typography/heading';
import { Text } from '@shared/ui/typography/text';

type ProjectHeaderProps = {
  readonly project: Pick<
    Project,
    'name' | 'description' | 'color' | 'icon' | 'coverUrl' | 'status' | 'health'
  >;
  readonly actions?: ReactNode;
  readonly className?: string;
};

export const ProjectHeader = ({
  project,
  actions,
  className,
}: ProjectHeaderProps): ReactElement => {
  return (
    <div
      className={cn(
        'w-full overflow-hidden rounded-lg border border-border-default bg-surface-card',
        className,
      )}
    >
      <ProjectCover color={project.color} coverUrl={project.coverUrl} size="lg" />

      <Inline gap={16} align="start" justify="between" className="w-full px-4 py-4 sm:px-6">
        <Inline gap={16} align="start" className="min-w-0 flex-1">
          <div className="-mt-10">
            <ProjectAvatar
              name={project.name}
              color={project.color}
              icon={project.icon}
              size="lg"
              className="shadow-sm ring-2 ring-surface-card"
            />
          </div>
          <Stack gap={8} className="min-w-0 flex-1 pt-1">
            <Inline gap={8} align="center" className="min-w-0 flex-wrap">
              <Heading level={1} className="truncate">
                {project.name}
              </Heading>
              <ProjectStatusBadge status={project.status} health={project.health} size="md" />
            </Inline>
            {project.description ? (
              <Text as="p" variant="body-md" muted className="max-w-[720px]">
                {project.description}
              </Text>
            ) : null}
          </Stack>
        </Inline>
        {actions ? (
          <Inline gap={8} align="center" className="shrink-0">
            {actions}
          </Inline>
        ) : null}
      </Inline>
    </div>
  );
};

export type { ProjectHeaderProps };
