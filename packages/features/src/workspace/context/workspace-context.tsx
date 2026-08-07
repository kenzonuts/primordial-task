import type { PropsWithChildren, ReactElement } from 'react';
import { createContext, useContext, useEffect, useMemo } from 'react';

import { hasWorkspacePermission } from '@features/workspace/rbac';
import { useWorkspaceStore } from '@features/workspace/store/workspace-store';
import type { Workspace, WorkspacePermission, WorkspaceRole } from '@features/workspace/types';

export interface WorkspaceContextValue {
  readonly currentWorkspace: Workspace | null;
  readonly role: WorkspaceRole | null;
  readonly initialized: boolean;
  readonly status: 'idle' | 'loading' | 'ready' | 'error';
  readonly can: (permission: WorkspacePermission) => boolean;
  readonly switchWorkspace: (id: string) => Promise<Workspace>;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export const WorkspaceProvider = ({ children }: PropsWithChildren): ReactElement => {
  const currentWorkspace = useWorkspaceStore((state) => state.currentWorkspace);
  const initialized = useWorkspaceStore((state) => state.initialized);
  const status = useWorkspaceStore((state) => state.status);
  const initialize = useWorkspaceStore((state) => state.initialize);
  const switchWorkspace = useWorkspaceStore((state) => state.switchWorkspace);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  const value = useMemo<WorkspaceContextValue>(
    () => ({
      currentWorkspace,
      role: currentWorkspace?.role ?? null,
      initialized,
      status,
      can: (permission) => {
        if (!currentWorkspace) {
          return false;
        }
        return hasWorkspacePermission(currentWorkspace.role, permission);
      },
      switchWorkspace,
    }),
    [currentWorkspace, initialized, status, switchWorkspace],
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
};

export const useWorkspaceContext = (): WorkspaceContextValue => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspaceContext must be used within WorkspaceProvider');
  }
  return context;
};
