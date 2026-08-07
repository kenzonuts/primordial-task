import { useEffect, type ReactElement } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { CommandPalette } from '@features/shell/components/command-palette';
import { Sidebar } from '@features/shell/components/sidebar';
import { TopNavigation } from '@features/shell/components/top-navigation';
import { UtilityPanel } from '@features/shell/components/utility-panel';
import { useCommandPaletteShortcut } from '@features/shell/hooks/use-command-palette-shortcut';
import { findNavigationItem } from '@features/shell/navigation';
import { useNavigationStore } from '@features/shell/store/navigation-store';
import { useUtilityPanelStore } from '@features/shell/store/utility-panel-store';
import { useWorkspaceUiStore } from '@features/shell/store/workspace-ui-store';
import type { ShellWorkspaceOption } from '@features/shell/types';
import { WorkspaceProvider } from '@features/workspace/context/workspace-context';
import { WORKSPACE_ROLE_LABELS } from '@features/workspace/rbac';
import { getWorkspaceInitials } from '@features/workspace/services/workspace-service';
import { useWorkspaceStore } from '@features/workspace/store/workspace-store';

/**
 * Persistent authenticated application chrome.
 * Sidebar, top navigation, main outlet, and utility panel stay mounted across module routes.
 */
export const AuthenticatedLayout = (): ReactElement => {
  const location = useLocation();
  const workspaces = useWorkspaceStore((state) => state.workspaces);
  const currentWorkspace = useWorkspaceStore((state) => state.currentWorkspace);
  const initialize = useWorkspaceStore((state) => state.initialize);
  const setOptions = useWorkspaceUiStore((state) => state.setOptions);
  const setActiveWorkspace = useWorkspaceUiStore((state) => state.setActiveWorkspace);
  const setActivePath = useNavigationStore((state) => state.setActivePath);
  const setBreadcrumbs = useNavigationStore((state) => state.setBreadcrumbs);
  const panelOpen = useUtilityPanelStore((state) => state.open);

  useCommandPaletteShortcut();

  useEffect(() => {
    void initialize();
  }, [initialize]);

  useEffect(() => {
    const options: ShellWorkspaceOption[] = workspaces
      .filter((workspace) => !workspace.archivedAt)
      .map((workspace) => ({
        id: workspace.id,
        name: workspace.name,
        initials: getWorkspaceInitials(workspace.name),
        role: WORKSPACE_ROLE_LABELS[workspace.role],
      }));

    setOptions(options);

    const active =
      options.find((option) => option.id === currentWorkspace?.id) ?? options[0] ?? null;
    setActiveWorkspace(active);
  }, [workspaces, currentWorkspace, setOptions, setActiveWorkspace]);

  useEffect(() => {
    const item = findNavigationItem(location.pathname);
    if (!item) {
      return;
    }

    setActivePath(item.path);
    setBreadcrumbs([{ label: item.label, path: item.path }]);
  }, [location.pathname, setActivePath, setBreadcrumbs]);

  return (
    <WorkspaceProvider>
      <div className="flex h-screen overflow-hidden bg-bg-app">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopNavigation />
          <div className="flex min-h-0 flex-1">
            <main className="flex-1 overflow-auto" id="main-content">
              <Outlet />
            </main>
            {panelOpen ? <UtilityPanel /> : null}
          </div>
        </div>
        <CommandPalette />
      </div>
    </WorkspaceProvider>
  );
};
