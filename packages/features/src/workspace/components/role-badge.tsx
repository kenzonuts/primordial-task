import type { ReactElement } from 'react';

import { WORKSPACE_ROLE_LABELS } from '@features/workspace/rbac';
import type { WorkspaceRole } from '@features/workspace/types';
import { cn } from '@shared/ui/lib/cn';
import { Badge } from '@shared/ui/primitives/badge';

type RoleBadgeProps = {
  readonly role: WorkspaceRole;
  readonly size?: 'sm' | 'md';
  readonly className?: string;
};

export const RoleBadge = ({ role, size = 'sm', className }: RoleBadgeProps): ReactElement => {
  return (
    <Badge variant="neutral" size={size} className={cn('shrink-0', className)}>
      {WORKSPACE_ROLE_LABELS[role]}
    </Badge>
  );
};

export type { RoleBadgeProps };
