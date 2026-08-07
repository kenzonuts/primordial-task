import { Bell } from 'lucide-react';
import type { ReactElement } from 'react';

import { useUtilityPanelStore } from '@features/shell/store/utility-panel-store';
import { Icon } from '@shared/ui/icons/icon';
import { cn } from '@shared/ui/lib/cn';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@shared/ui/overlays/tooltip';
import { IconButton } from '@shared/ui/primitives/icon-button';

type NotificationButtonProps = {
  readonly className?: string;
};

export const NotificationButton = ({ className }: NotificationButtonProps): ReactElement => {
  const setMode = useUtilityPanelStore((state) => state.setMode);

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <IconButton
            variant="ghost"
            size="md"
            aria-label="Notifications"
            className={cn(className)}
            onClick={() => setMode('notifications')}
          >
            <Icon icon={Bell} size="navigation" decorative />
          </IconButton>
        </TooltipTrigger>
        <TooltipContent side="bottom" sideOffset={8}>
          Notifications
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export type { NotificationButtonProps };
