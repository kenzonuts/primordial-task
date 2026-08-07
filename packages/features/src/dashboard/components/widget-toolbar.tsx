import { ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import type { ReactElement } from 'react';

import { Icon } from '@shared/ui/icons/icon';
import { Inline } from '@shared/ui/layout/inline';
import { cn } from '@shared/ui/lib/cn';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@shared/ui/overlays/tooltip';
import { IconButton } from '@shared/ui/primitives/icon-button';

type WidgetToolbarProps = {
  readonly collapsed?: boolean;
  readonly refreshing?: boolean;
  readonly onRefresh?: () => void;
  readonly onToggleCollapsed?: () => void;
  readonly className?: string;
};

export const WidgetToolbar = ({
  collapsed = false,
  refreshing = false,
  onRefresh,
  onToggleCollapsed,
  className,
}: WidgetToolbarProps): ReactElement => {
  const collapseLabel = collapsed ? 'Expand widget' : 'Collapse widget';

  return (
    <TooltipProvider delayDuration={300}>
      <Inline gap={2} align="center" className={cn('shrink-0', className)}>
        {onRefresh ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <IconButton
                type="button"
                size="sm"
                variant="ghost"
                aria-label="Refresh widget"
                loading={refreshing}
                onClick={onRefresh}
              >
                <Icon icon={RefreshCw} size="dense" decorative />
              </IconButton>
            </TooltipTrigger>
            <TooltipContent side="top">Refresh</TooltipContent>
          </Tooltip>
        ) : null}

        {onToggleCollapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <IconButton
                type="button"
                size="sm"
                variant="ghost"
                aria-label={collapseLabel}
                aria-expanded={!collapsed}
                onClick={onToggleCollapsed}
              >
                <Icon icon={collapsed ? ChevronDown : ChevronUp} size="dense" decorative />
              </IconButton>
            </TooltipTrigger>
            <TooltipContent side="top">{collapsed ? 'Expand' : 'Collapse'}</TooltipContent>
          </Tooltip>
        ) : null}
      </Inline>
    </TooltipProvider>
  );
};

export type { WidgetToolbarProps };
