import { PanelRight } from 'lucide-react';
import type { ReactElement } from 'react';

import { useAuthStore } from '@features/auth/store/auth-store';
import { GlobalSearchButton } from '@features/shell/components/global-search-button';
import { NotificationButton } from '@features/shell/components/notification-button';
import { QuickActions } from '@features/shell/components/quick-actions';
import { ShellBreadcrumb } from '@features/shell/components/shell-breadcrumb';
import { ThemeIndicator } from '@features/shell/components/theme-indicator';
import { UserMenu } from '@features/shell/components/user-menu';
import { useUtilityPanelStore } from '@features/shell/store/utility-panel-store';
import { useWorkspaceUiStore } from '@features/shell/store/workspace-ui-store';
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
import { Text } from '@shared/ui/typography/text';

type TopNavigationProps = {
  readonly className?: string;
};

export const TopNavigation = ({ className }: TopNavigationProps): ReactElement => {
  const activeWorkspace = useWorkspaceUiStore((state) => state.activeWorkspace);
  const authWorkspaces = useAuthStore((state) => state.workspaces);
  const selectedWorkspaceId = useAuthStore((state) => state.selectedWorkspaceId);
  const utilityOpen = useUtilityPanelStore((state) => state.open);
  const toggleUtility = useUtilityPanelStore((state) => state.toggle);

  const workspaceName =
    activeWorkspace?.name ??
    authWorkspaces.find((workspace) => workspace.id === selectedWorkspaceId)?.name ??
    authWorkspaces[0]?.name ??
    'Workspace';

  return (
    <header
      className={cn(
        'sticky top-0 z-[var(--z-nav)] flex h-12 shrink-0 items-center gap-3',
        'border-b border-border-subtle bg-surface-nav px-4',
        className,
      )}
    >
      <Inline gap={12} align="center" className="min-w-0 flex-1">
        <Text
          as="span"
          variant="body-sm"
          truncate
          className="max-w-[200px] shrink-0 font-medium text-text-primary"
          title={workspaceName}
        >
          {workspaceName}
        </Text>
        <ShellBreadcrumb className="min-w-0" />
      </Inline>

      <Inline gap={8} align="center" className="shrink-0">
        <GlobalSearchButton />
        <QuickActions />
        <NotificationButton />
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <IconButton
                variant={utilityOpen ? 'selected' : 'ghost'}
                size="md"
                aria-label={utilityOpen ? 'Hide utility panel' : 'Show utility panel'}
                aria-pressed={utilityOpen}
                onClick={toggleUtility}
              >
                <Icon icon={PanelRight} size="navigation" decorative />
              </IconButton>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={8}>
              {utilityOpen ? 'Hide panel' : 'Show panel'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <ThemeIndicator />
        <UserMenu />
      </Inline>
    </header>
  );
};

export type { TopNavigationProps };
