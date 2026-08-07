import type { ReactElement, ReactNode } from 'react';

import { RoleBadge } from '@features/workspace/components/role-badge';
import { getWorkspaceInitials } from '@features/workspace/services/workspace-service';
import type { WorkspaceMember } from '@features/workspace/types';
import { Inline } from '@shared/ui/layout/inline';
import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@shared/ui/overlays/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@shared/ui/primitives/avatar';
import { Badge } from '@shared/ui/primitives/badge';
import { Text } from '@shared/ui/typography/text';

type MemberCardProps = {
  readonly member: WorkspaceMember;
  readonly actions?: ReactNode;
  readonly className?: string;
};

const PRESENCE_LABEL: Record<WorkspaceMember['presence'], string> = {
  online: 'Online',
  away: 'Away',
  offline: 'Offline',
};

const PRESENCE_TONE: Record<WorkspaceMember['presence'], string> = {
  online: 'bg-success',
  away: 'bg-warning',
  offline: 'bg-text-muted',
};

const STATUS_LABEL: Record<WorkspaceMember['status'], string> = {
  active: 'Active',
  invited: 'Invited',
  suspended: 'Suspended',
};

export const MemberCard = ({ member, actions, className }: MemberCardProps): ReactElement => {
  const initials = getWorkspaceInitials(member.fullName);

  return (
    <div
      className={cn('rounded-lg border border-border-subtle bg-surface-card px-3 py-3', className)}
    >
      <Inline gap={12} align="center" justify="between" className="w-full">
        <Inline gap={12} align="center" className="min-w-0 flex-1">
          <span className="relative inline-flex shrink-0">
            <Avatar size="md">
              {member.avatarUrl ? <AvatarImage src={member.avatarUrl} alt="" /> : null}
              <AvatarFallback initials={initials} />
            </Avatar>
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    className={cn(
                      'absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-surface-card',
                      PRESENCE_TONE[member.presence],
                    )}
                    aria-label={PRESENCE_LABEL[member.presence]}
                    role="status"
                  />
                </TooltipTrigger>
                <TooltipContent side="top">{PRESENCE_LABEL[member.presence]}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </span>

          <Stack gap={2} className="min-w-0 flex-1">
            <Inline gap={8} align="center" className="min-w-0 flex-wrap">
              <Text as="span" variant="body-sm" truncate className="min-w-0 font-medium">
                {member.fullName}
              </Text>
              <RoleBadge role={member.role} />
              {member.status !== 'active' ? (
                <Badge variant="neutral" size="sm">
                  {STATUS_LABEL[member.status]}
                </Badge>
              ) : null}
            </Inline>
            <Text as="span" variant="caption" muted truncate>
              {member.email}
            </Text>
          </Stack>
        </Inline>

        {actions ? (
          <Inline gap={4} align="center" className="shrink-0">
            {actions}
          </Inline>
        ) : null}
      </Inline>
    </div>
  );
};

export type { MemberCardProps };
