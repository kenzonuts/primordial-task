import type { ReactElement } from 'react';

import { PROJECT_HEALTH_LABELS, PROJECT_STATUS_LABELS } from '@features/project/constants';
import type { ProjectHealth, ProjectStatus } from '@features/project/types';
import { Inline } from '@shared/ui/layout/inline';
import { cn } from '@shared/ui/lib/cn';
import { Badge, type BadgeProps } from '@shared/ui/primitives/badge';

type ProjectStatusBadgeProps = {
  readonly status: ProjectStatus;
  readonly health?: ProjectHealth;
  readonly showHealthCue?: boolean;
  readonly size?: BadgeProps['size'];
  readonly className?: string;
};

const healthVariant = (health: ProjectHealth): BadgeProps['variant'] => {
  if (health === 'critical') {
    return 'danger';
  }
  if (health === 'at_risk') {
    return 'warning';
  }
  return 'neutral';
};

export const ProjectStatusBadge = ({
  status,
  health,
  showHealthCue = true,
  size = 'sm',
  className,
}: ProjectStatusBadgeProps): ReactElement => {
  const needsHealthCue =
    showHealthCue && health !== undefined && (health === 'at_risk' || health === 'critical');

  return (
    <Inline gap={4} align="center" className={cn('shrink-0', className)}>
      <Badge variant="neutral" size={size}>
        {PROJECT_STATUS_LABELS[status]}
      </Badge>
      {needsHealthCue && health ? (
        <Badge variant={healthVariant(health)} size={size}>
          {PROJECT_HEALTH_LABELS[health]}
        </Badge>
      ) : null}
    </Inline>
  );
};

export type { ProjectStatusBadgeProps };
