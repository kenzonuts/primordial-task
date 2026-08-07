import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { ShellWorkspaceOption } from '@features/shell/types';

interface WorkspaceUiStoreState {
  readonly activeWorkspace: ShellWorkspaceOption | null;
  readonly options: readonly ShellWorkspaceOption[];
  setActiveWorkspace(workspace: ShellWorkspaceOption | null): void;
  setOptions(options: readonly ShellWorkspaceOption[]): void;
}

/** UI-only workspace selection for shell chrome. No CRUD. */
export const useWorkspaceUiStore = create<WorkspaceUiStoreState>()(
  persist(
    (set) => ({
      activeWorkspace: null,
      options: [],
      setActiveWorkspace: (workspace) => {
        set({ activeWorkspace: workspace });
      },
      setOptions: (options) => {
        set({ options });
      },
    }),
    {
      name: 'primordial-shell-workspace-ui',
      partialize: (state) => ({
        activeWorkspace: state.activeWorkspace,
      }),
    },
  ),
);
