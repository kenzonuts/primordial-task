import type { PropsWithChildren, ReactElement } from 'react';
import { createContext, useContext, useEffect, useMemo } from 'react';

import { useProjectStore } from '@features/project/store/project-store';
import type { Project } from '@features/project/types';
import { useWorkspaceContext } from '@features/workspace/context/workspace-context';

export interface ProjectContextValue {
  readonly currentProject: Project | null;
  readonly workspaceId: string | null;
  readonly status: 'idle' | 'loading' | 'ready' | 'error';
  readonly setCurrentProject: (project: Project | null) => void;
  readonly loadProjects: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextValue | null>(null);

export const ProjectProvider = ({ children }: PropsWithChildren): ReactElement => {
  const { currentWorkspace } = useWorkspaceContext();
  const currentProject = useProjectStore((state) => state.currentProject);
  const status = useProjectStore((state) => state.status);
  const setCurrentProject = useProjectStore((state) => state.setCurrentProject);
  const loadProjects = useProjectStore((state) => state.loadProjects);
  const workspaceId = currentWorkspace?.id ?? null;

  useEffect(() => {
    if (!workspaceId) {
      return;
    }
    void loadProjects(workspaceId);
  }, [workspaceId, loadProjects]);

  const value = useMemo<ProjectContextValue>(
    () => ({
      currentProject,
      workspaceId,
      status,
      setCurrentProject,
      loadProjects: async () => {
        if (!workspaceId) {
          return;
        }
        await loadProjects(workspaceId);
      },
    }),
    [currentProject, workspaceId, status, setCurrentProject, loadProjects],
  );

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};

export const useProjectContext = (): ProjectContextValue => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjectContext must be used within ProjectProvider');
  }
  return context;
};
