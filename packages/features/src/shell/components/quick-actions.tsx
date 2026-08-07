import { Plus } from 'lucide-react';
import type { ReactElement } from 'react';

import { toast } from '@shared/ui/feedback/toast';
import { Icon } from '@shared/ui/icons/icon';
import { cn } from '@shared/ui/lib/cn';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@shared/ui/overlays/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@shared/ui/overlays/tooltip';
import { IconButton } from '@shared/ui/primitives/icon-button';

type QuickActionsProps = {
  readonly className?: string;
};

const showComingSoon = (label: string): void => {
  toast.message(`${label} — Coming soon`);
};

export const QuickActions = ({ className }: QuickActionsProps): ReactElement => {
  return (
    <DropdownMenu>
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <IconButton
                variant="ghost"
                size="md"
                aria-label="Quick actions"
                aria-haspopup="menu"
                className={cn(className)}
              >
                <Icon icon={Plus} size="navigation" decorative />
              </IconButton>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom" sideOffset={8}>
            Quick create
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>Create</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => showComingSoon('New Task')}>New Task</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => showComingSoon('New Project')}>
          New Project
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export type { QuickActionsProps };
