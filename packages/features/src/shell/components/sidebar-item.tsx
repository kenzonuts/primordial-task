import type { LucideIcon } from 'lucide-react';
import {
  CalendarDays,
  ChartColumn,
  CheckSquare,
  Columns3,
  FolderKanban,
  LayoutDashboard,
  Settings,
  Sparkles,
  Terminal,
} from 'lucide-react';
import type { ReactElement } from 'react';
import { NavLink } from 'react-router-dom';

import type { NavigationItem } from '@features/shell/types';
import { Icon } from '@shared/ui/icons/icon';
import { cn } from '@shared/ui/lib/cn';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@shared/ui/overlays/tooltip';
import { Text } from '@shared/ui/typography/text';

const NAVIGATION_ICONS: Record<string, LucideIcon> = {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Columns3,
  CalendarDays,
  ChartColumn,
  Sparkles,
  Terminal,
  Settings,
};

type SidebarItemProps = {
  readonly item: NavigationItem;
  readonly collapsed: boolean;
  readonly className?: string;
};

export const SidebarItem = ({ item, collapsed, className }: SidebarItemProps): ReactElement => {
  const IconComponent = NAVIGATION_ICONS[item.icon] ?? LayoutDashboard;

  const link = (
    <NavLink
      to={item.path}
      end={item.path === '/dashboard'}
      aria-label={collapsed ? item.label : undefined}
      title={collapsed ? undefined : item.description}
      className={({ isActive }) =>
        cn(
          'group flex h-8 w-full items-center gap-3 rounded-md px-2.5',
          'text-text-secondary ds-transition-fast',
          'hover:bg-state-hover hover:text-text-primary',
          'focus-visible:outline-none focus-visible:ds-focus-ring',
          'active:bg-state-pressed',
          collapsed && 'justify-center px-0',
          isActive && 'bg-state-selected text-text-primary',
          className,
        )
      }
    >
      <Icon icon={IconComponent} size="navigation" decorative className="text-current" />
      {!collapsed ? (
        <Text as="span" variant="body-sm" className="truncate text-current">
          {item.label}
        </Text>
      ) : null}
    </NavLink>
  );

  if (!collapsed) {
    return link;
  }

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          {item.label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export type { SidebarItemProps };
