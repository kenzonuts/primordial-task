import type { ReactElement } from 'react';

import { getWorkspaceInitials } from '@features/workspace/services/workspace-service';
import { cn } from '@shared/ui/lib/cn';
import { Avatar, AvatarFallback, AvatarImage } from '@shared/ui/primitives/avatar';

type WorkspaceLogoSize = 'md' | 'lg' | 'xl';

type WorkspaceLogoProps = {
  readonly name: string;
  readonly color: string;
  readonly logoUrl?: string;
  readonly size?: WorkspaceLogoSize;
  readonly className?: string;
};

const sizeClasses: Record<WorkspaceLogoSize, string> = {
  md: 'size-12 text-base',
  lg: 'size-14 text-lg',
  xl: 'size-16 text-xl',
};

export const WorkspaceLogo = ({
  name,
  color,
  logoUrl,
  size = 'lg',
  className,
}: WorkspaceLogoProps): ReactElement => {
  const initials = getWorkspaceInitials(name);

  return (
    <span
      className={cn('inline-flex shrink-0 rounded-xl p-[3px]', className)}
      style={{ backgroundColor: color }}
      aria-hidden="true"
    >
      <Avatar
        className={cn(
          'rounded-[10px] bg-surface-elevated [&_img]:rounded-[10px]',
          sizeClasses[size],
        )}
      >
        {logoUrl ? <AvatarImage src={logoUrl} alt="" /> : null}
        <AvatarFallback
          initials={initials}
          className="rounded-[10px] bg-surface-card font-semibold text-text-primary"
        />
      </Avatar>
    </span>
  );
};

export type { WorkspaceLogoProps, WorkspaceLogoSize };
