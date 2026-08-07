import type { ReactElement } from 'react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { WorkspaceAvatar } from '@features/workspace/components/workspace-avatar';
import { useWorkspaceStore } from '@features/workspace/store/workspace-store';
import { WORKSPACE_ROUTES } from '@features/workspace/types';
import { Inline } from '@shared/ui/layout/inline';
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
} from '@shared/ui/overlays/dropdown-menu';
import { Text } from '@shared/ui/typography/text';

type WorkspaceSwitcherMenuProps = {
  readonly onSwitch?: (workspaceId: string) => void | Promise<void>;
  readonly showManageLinks?: boolean;
};

export const WorkspaceSwitcherMenu = ({
  onSwitch,
  showManageLinks = true,
}: WorkspaceSwitcherMenuProps): ReactElement => {
  const navigate = useNavigate();
  const workspaces = useWorkspaceStore((state) => state.workspaces);
  const currentWorkspace = useWorkspaceStore((state) => state.currentWorkspace);
  const preferences = useWorkspaceStore((state) => state.preferences);
  const switchWorkspace = useWorkspaceStore((state) => state.switchWorkspace);

  const ordered = useMemo(() => {
    const visible = workspaces.filter(
      (workspace) => preferences.showArchivedInSwitcher || !workspace.archivedAt,
    );
    return [...visible].sort((left, right) => {
      if (left.isFavorite !== right.isFavorite) {
        return Number(right.isFavorite) - Number(left.isFavorite);
      }
      return right.lastUsedAt - left.lastUsedAt;
    });
  }, [workspaces, preferences.showArchivedInSwitcher]);

  const handleSwitch = async (id: string): Promise<void> => {
    if (onSwitch) {
      await onSwitch(id);
      return;
    }
    await switchWorkspace(id);
  };

  return (
    <>
      <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
      {ordered.length === 0 ? (
        <DropdownMenuItem disabled>No workspaces available</DropdownMenuItem>
      ) : (
        <DropdownMenuRadioGroup
          value={currentWorkspace?.id ?? ''}
          onValueChange={(id) => {
            void handleSwitch(id);
          }}
        >
          {ordered.map((workspace) => (
            <DropdownMenuRadioItem key={workspace.id} value={workspace.id}>
              <Inline gap={8} align="center" className="min-w-0">
                <WorkspaceAvatar
                  name={workspace.name}
                  color={workspace.color}
                  logoUrl={workspace.logoUrl}
                  size="xs"
                  showRing={false}
                />
                <Text as="span" variant="body-sm" truncate>
                  {workspace.name}
                </Text>
              </Inline>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      )}

      {showManageLinks ? (
        <>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => {
              navigate(WORKSPACE_ROUTES.list);
            }}
          >
            Manage workspaces
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              navigate(WORKSPACE_ROUTES.create);
            }}
          >
            Create workspace
          </DropdownMenuItem>
        </>
      ) : null}
    </>
  );
};

export type { WorkspaceSwitcherMenuProps };
