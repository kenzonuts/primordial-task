import { PanelLeft, PanelLeftClose } from 'lucide-react';
import type { ReactElement } from 'react';

import { useSidebarStore } from '@features/shell/store/sidebar-store';
import { Icon } from '@shared/ui/icons/icon';
import { cn } from '@shared/ui/lib/cn';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@shared/ui/overlays/tooltip';
import { IconButton } from '@shared/ui/primitives/icon-button';

type SidebarFooterProps = {
  readonly className?: string;
};

export const SidebarFooter = ({ className }: SidebarFooterProps): ReactElement => {
  const collapsed = useSidebarStore((state) => state.collapsed);
  const toggleCollapsed = useSidebarStore((state) => state.toggleCollapsed);
  const label = collapsed ? 'Expand sidebar' : 'Collapse sidebar';

  return (
    <div
      className={cn(
        'flex shrink-0 items-center border-t border-border-subtle p-3',
        collapsed ? 'justify-center' : 'justify-end',
        className,
      )}
    >
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <IconButton
              variant="ghost"
              size="md"
              aria-label={label}
              aria-pressed={collapsed}
              onClick={toggleCollapsed}
            >
              <Icon icon={collapsed ? PanelLeft : PanelLeftClose} size="navigation" decorative />
            </IconButton>
          </TooltipTrigger>
          <TooltipContent side={collapsed ? 'right' : 'top'} sideOffset={8}>
            {label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export type { SidebarFooterProps };
