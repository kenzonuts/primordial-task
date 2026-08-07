import type { ReactElement, ReactNode } from 'react';

import { ProjectProgressCard } from '@features/project/components/project-progress-card';
import { ProjectStatistics } from '@features/project/components/project-statistics';
import {
  PLACEHOLDER_PROJECT_ACTIVITY,
  PLACEHOLDER_PROJECT_DEADLINES,
  PLACEHOLDER_PROJECT_STATS,
} from '@features/project/services/project-service';
import type {
  Project,
  ProjectActivityItem,
  ProjectDeadlineItem,
  ProjectMember,
  ProjectStatistic,
} from '@features/project/types';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/composites/card';
import { Inline } from '@shared/ui/layout/inline';
import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import { Badge } from '@shared/ui/primitives/badge';
import { Text } from '@shared/ui/typography/text';

type ProjectOverviewProps = {
  readonly project: Project;
  readonly stats?: readonly ProjectStatistic[];
  readonly members?: readonly ProjectMember[];
  readonly activity?: readonly ProjectActivityItem[];
  readonly deadlines?: readonly ProjectDeadlineItem[];
  readonly membersAction?: ReactNode;
  readonly className?: string;
};

const priorityVariant = (
  priority: ProjectDeadlineItem['priority'],
): 'neutral' | 'warning' | 'danger' => {
  if (priority === 'high') {
    return 'danger';
  }
  if (priority === 'medium') {
    return 'warning';
  }
  return 'neutral';
};

export const ProjectOverview = ({
  project,
  stats = PLACEHOLDER_PROJECT_STATS,
  members = [],
  activity = PLACEHOLDER_PROJECT_ACTIVITY,
  deadlines = PLACEHOLDER_PROJECT_DEADLINES,
  membersAction,
  className,
}: ProjectOverviewProps): ReactElement => {
  return (
    <Stack gap={24} className={cn('w-full', className)}>
      <ProjectStatistics stats={stats} />

      <div className="grid grid-cols-1 gap-16 xl:grid-cols-3">
        <Stack gap={16} className="xl:col-span-1">
          <ProjectProgressCard progress={project.progress} title="Overall progress" size="large" />

          <Card>
            <CardHeader>
              <Inline gap={8} align="center" justify="between" className="w-full">
                <CardTitle>Members</CardTitle>
                {membersAction}
              </Inline>
            </CardHeader>
            <CardContent>
              {members.length === 0 ? (
                <Text as="p" variant="caption" muted>
                  Member management will appear here.
                </Text>
              ) : (
                <Stack gap={8} role="list" aria-label="Project members">
                  {members.map((member) => (
                    <Inline
                      key={member.id}
                      gap={8}
                      align="center"
                      justify="between"
                      role="listitem"
                      className="w-full"
                    >
                      <div className="min-w-0">
                        <Text as="span" variant="body-sm" truncate className="font-medium">
                          {member.fullName}
                        </Text>
                        <Text as="span" variant="caption" muted truncate>
                          {member.email}
                        </Text>
                      </div>
                      <Badge variant="neutral" size="sm" className="capitalize">
                        {member.role}
                      </Badge>
                    </Inline>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Stack>

        <Stack gap={16} className="xl:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Recent activity</CardTitle>
            </CardHeader>
            <CardContent>
              <Stack gap={12} role="list" aria-label="Recent activity">
                {activity.map((item) => (
                  <Stack key={item.id} gap={2} role="listitem">
                    <Text as="p" variant="body-sm">
                      <span className="font-medium text-text-primary">{item.actor}</span>{' '}
                      <span className="text-text-secondary">{item.action}</span>{' '}
                      <span className="text-text-primary">{item.target}</span>
                    </Text>
                    <Text as="span" variant="caption" muted>
                      {item.timestampLabel}
                    </Text>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Stack>

        <Stack gap={16} className="xl:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming deadlines</CardTitle>
            </CardHeader>
            <CardContent>
              <Stack gap={12} role="list" aria-label="Upcoming deadlines">
                {deadlines.map((item) => (
                  <Inline
                    key={item.id}
                    gap={8}
                    align="center"
                    justify="between"
                    role="listitem"
                    className="w-full"
                  >
                    <Stack gap={2} className="min-w-0">
                      <Text as="span" variant="body-sm" truncate className="font-medium">
                        {item.title}
                      </Text>
                      <Text as="span" variant="caption" muted>
                        Due {item.dueLabel}
                      </Text>
                    </Stack>
                    <Badge
                      variant={priorityVariant(item.priority)}
                      size="sm"
                      className="capitalize"
                    >
                      {item.priority}
                    </Badge>
                  </Inline>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </div>
    </Stack>
  );
};

export type { ProjectOverviewProps };
