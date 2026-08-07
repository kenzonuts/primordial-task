import { Box, Code2, FolderKanban, Layers, Rocket, Sparkles, type LucideIcon } from 'lucide-react';
import type { ReactElement } from 'react';

import { PROJECT_ICONS } from '@features/project/constants';
import { getProjectInitials } from '@features/project/services/project-service';
import { Icon } from '@shared/ui/icons/icon';
import { cn } from '@shared/ui/lib/cn';
import { Avatar, AvatarFallback } from '@shared/ui/primitives/avatar';

type ProjectAvatarSize = 'xs' | 'sm' | 'md' | 'lg';

type ProjectAvatarProps = {
  readonly name: string;
  readonly color: string;
  readonly icon?: string;
  readonly size?: ProjectAvatarSize;
  readonly className?: string;
  readonly showRing?: boolean;
};

const PROJECT_ICON_MAP: Record<(typeof PROJECT_ICONS)[number], LucideIcon> = {
  FolderKanban,
  Box,
  Layers,
  Code2,
  Sparkles,
  Rocket,
};

const resolveProjectIcon = (icon?: string): LucideIcon | null => {
  if (!icon) {
    return null;
  }
  if ((PROJECT_ICONS as readonly string[]).includes(icon)) {
    return PROJECT_ICON_MAP[icon as (typeof PROJECT_ICONS)[number]];
  }
  return null;
};

const iconSizeByAvatar: Record<ProjectAvatarSize, 'dense' | 'default' | 'navigation'> = {
  xs: 'dense',
  sm: 'dense',
  md: 'default',
  lg: 'navigation',
};

export const ProjectAvatar = ({
  name,
  color,
  icon,
  size = 'md',
  className,
  showRing = true,
}: ProjectAvatarProps): ReactElement => {
  const initials = getProjectInitials(name);
  const IconComponent = resolveProjectIcon(icon);

  return (
    <span
      className={cn('inline-flex shrink-0 rounded-full', showRing && 'p-[2px]', className)}
      style={showRing ? { backgroundColor: color } : undefined}
      aria-hidden="true"
    >
      <Avatar size={size} className="bg-surface-elevated">
        <AvatarFallback
          initials={IconComponent ? undefined : initials}
          className="bg-surface-card text-text-primary"
          style={{ color }}
        >
          {IconComponent ? (
            <Icon icon={IconComponent} size={iconSizeByAvatar[size]} decorative />
          ) : null}
        </AvatarFallback>
      </Avatar>
    </span>
  );
};

export type { ProjectAvatarProps, ProjectAvatarSize };
export { resolveProjectIcon, PROJECT_ICON_MAP };
