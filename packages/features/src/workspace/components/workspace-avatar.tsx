import type { ReactElement } from 'react';

import { getWorkspaceInitials } from '@features/workspace/services/workspace-service';
import { cn } from '@shared/ui/lib/cn';
import { Avatar, AvatarFallback, AvatarImage } from '@shared/ui/primitives/avatar';

type WorkspaceAvatarSize = 'xs' | 'sm' | 'md' | 'lg';

type WorkspaceAvatarProps = {
  readonly name: string;
  readonly color: string;
  readonly logoUrl?: string;
  readonly size?: WorkspaceAvatarSize;
  readonly className?: string;
  readonly showRing?: boolean;
};

export const WorkspaceAvatar = ({
  name,
  color,
  logoUrl,
  size = 'md',
  className,
  showRing = true,
}: WorkspaceAvatarProps): ReactElement => {
  const initials = getWorkspaceInitials(name);

  return (
    <span
      className={cn('inline-flex shrink-0 rounded-full', showRing && 'p-[2px]', className)}
      style={showRing ? { backgroundColor: color } : undefined}
      aria-hidden="true"
    >
      <Avatar size={size} className="bg-surface-elevated">
        {logoUrl ? <AvatarImage src={logoUrl} alt="" /> : null}
        <AvatarFallback
          initials={initials}
          className="bg-surface-card text-text-primary"
          style={logoUrl ? undefined : { color }}
        />
      </Avatar>
    </span>
  );
};

export type { WorkspaceAvatarProps, WorkspaceAvatarSize };
