import { ChevronsUpDown } from 'lucide-react';
import type { ReactElement } from 'react';
import { useMemo } from 'react';

import { useWorkspaceUiStore } from '@features/shell/store/workspace-ui-store';
import { WorkspaceSwitcherMenu } from '@features/workspace/components/workspace-switcher-menu';
import { getWorkspaceInitials } from '@features/workspace/services/workspace-service';
import { useWorkspaceStore } from '@features/workspace/store/workspace-store';
import { toast } from '@shared/ui/feedback/toast';
import { Icon } from '@shared/ui/icons/icon';
import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@shared/ui/overlays/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@shared/ui/overlays/tooltip';
import { Avatar, AvatarFallback } from '@shared/ui/primitives/avatar';
import { Button } from '@shared/ui/primitives/button';
import { Text } from '@shared/ui/typography/text';

type WorkspaceSwitcherProps = {
  readonly collapsed: boolean;
  readonly className?: string;
};

export const WorkspaceSwitcher = ({
  collapsed,
  className,
}: WorkspaceSwitcherProps): ReactElement => {
  const uiOptions = useWorkspaceUiStore((state) => state.options);
  const activeWorkspace = useWorkspaceUiStore((state) => state.activeWorkspace);
  const currentWorkspace = useWorkspaceStore((state) => state.currentWorkspace);
  const switchWorkspace = useWorkspaceStore((state) => state.switchWorkspace);

  const current = useMemo(() => {
    if (activeWorkspace) {
      return activeWorkspace;
    }
    if (currentWorkspace) {
      return {
        id: currentWorkspace.id,
        name: currentWorkspace.name,
        initials: getWorkspaceInitials(currentWorkspace.name),
        role: currentWorkspace.role,
      };
    }
    return uiOptions[0] ?? null;
  }, [activeWorkspace, currentWorkspace, uiOptions]);

  const trigger = (
    <Button
      type="button"
      variant="ghost"
      size="md"
      aria-label={current ? `Workspace: ${current.name}` : 'Select workspace'}
      className={cn(
        'h-10 w-full justify-start gap-2 px-2 text-text-primary',
        collapsed && 'justify-center px-0',
        className,
      )}
    >
      <Avatar size="sm" className="shrink-0">
        <AvatarFallback initials={current?.initials ?? 'WS'} />
      </Avatar>
      {!collapsed ? (
        <>
          <Stack gap={2} className="min-w-0 flex-1 items-start">
            <Text as="span" variant="body-sm" truncate className="w-full text-left font-medium">
              {current?.name ?? 'No workspace'}
            </Text>
            {current?.role ? (
              <Text as="span" variant="caption" muted truncate className="w-full text-left">
                {current.role}
              </Text>
            ) : null}
          </Stack>
          <Icon icon={ChevronsUpDown} size="dense" decorative className="text-text-muted" />
        </>
      ) : null}
    </Button>
  );

  return (
    <DropdownMenu>
      {collapsed ? (
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={8}>
              {current?.name ?? 'Workspace'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      )}
      <DropdownMenuContent align="start" className="w-[240px]">
        <WorkspaceSwitcherMenu
          onSwitch={async (id) => {
            try {
              await switchWorkspace(id);
            } catch (error) {
              toast.error(error instanceof Error ? error.message : 'Could not switch workspace.');
            }
          }}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export type { WorkspaceSwitcherProps };
