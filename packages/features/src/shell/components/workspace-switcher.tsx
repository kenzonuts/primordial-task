import { ChevronsUpDown } from 'lucide-react';
import type { ReactElement } from 'react';
import { useMemo } from 'react';

import { useAuthStore } from '@features/auth/store/auth-store';
import { useWorkspaceUiStore } from '@features/shell/store/workspace-ui-store';
import type { ShellWorkspaceOption } from '@features/shell/types';
import { Icon } from '@shared/ui/icons/icon';
import { Inline } from '@shared/ui/layout/inline';
import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
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

const toShellOption = (workspace: {
  readonly id: string;
  readonly name: string;
  readonly initials: string;
  readonly role: string;
}): ShellWorkspaceOption => ({
  id: workspace.id,
  name: workspace.name,
  initials: workspace.initials,
  role: workspace.role,
});

export const WorkspaceSwitcher = ({
  collapsed,
  className,
}: WorkspaceSwitcherProps): ReactElement => {
  const uiOptions = useWorkspaceUiStore((state) => state.options);
  const activeWorkspace = useWorkspaceUiStore((state) => state.activeWorkspace);
  const setActiveWorkspace = useWorkspaceUiStore((state) => state.setActiveWorkspace);
  const authWorkspaces = useAuthStore((state) => state.workspaces);
  const selectedWorkspaceId = useAuthStore((state) => state.selectedWorkspaceId);

  const options = useMemo(() => {
    if (uiOptions.length > 0) {
      return uiOptions;
    }
    return authWorkspaces.map(toShellOption);
  }, [authWorkspaces, uiOptions]);

  const current = useMemo(() => {
    if (activeWorkspace) {
      return activeWorkspace;
    }
    const fromAuth =
      options.find((workspace) => workspace.id === selectedWorkspaceId) ?? options[0] ?? null;
    return fromAuth;
  }, [activeWorkspace, options, selectedWorkspaceId]);

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
          <Stack gap={0} className="min-w-0 flex-1 items-start">
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
        <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
        {options.length === 0 ? (
          <DropdownMenuItem disabled>No workspaces available</DropdownMenuItem>
        ) : (
          <DropdownMenuRadioGroup
            value={current?.id ?? ''}
            onValueChange={(id) => {
              const next = options.find((workspace) => workspace.id === id) ?? null;
              setActiveWorkspace(next);
            }}
          >
            {options.map((workspace) => (
              <DropdownMenuRadioItem key={workspace.id} value={workspace.id}>
                <Inline gap={8} align="center" className="min-w-0">
                  <Avatar size="xs">
                    <AvatarFallback initials={workspace.initials} />
                  </Avatar>
                  <Text as="span" variant="body-sm" truncate>
                    {workspace.name}
                  </Text>
                </Inline>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>Manage workspace</DropdownMenuItem>
        <DropdownMenuItem disabled>Invite member</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export type { WorkspaceSwitcherProps };
