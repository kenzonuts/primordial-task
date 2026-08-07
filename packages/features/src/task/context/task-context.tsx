import type { PropsWithChildren, ReactElement } from 'react';
import { createContext, useContext, useEffect, useMemo } from 'react';

import { useProjectContext } from '@features/project/context/project-context';
import { useTaskPreferenceStore } from '@features/task/store/task-preference-store';
import { useTaskStore } from '@features/task/store/task-store';
import type { Task } from '@features/task/types';
import { useWorkspaceContext } from '@features/workspace/context/workspace-context';

export interface TaskContextValue {
  readonly workspaceId: string | null;
  readonly projectId: string | null;
  readonly tasks: readonly Task[];
  readonly status: 'idle' | 'loading' | 'ready' | 'error';
  readonly loadTasks: () => Promise<void>;
}

const TaskContext = createContext<TaskContextValue | null>(null);

/**
 * Provides workspace-scoped task engine access for shell and future modules.
 */
export const TaskProvider = ({ children }: PropsWithChildren): ReactElement => {
  const { currentWorkspace } = useWorkspaceContext();
  const { currentProject } = useProjectContext();
  const tasks = useTaskStore((state) => state.tasks);
  const status = useTaskStore((state) => state.status);
  const loadTasks = useTaskStore((state) => state.loadTasks);
  const loadPreferences = useTaskPreferenceStore((state) => state.loadPreferences);
  const workspaceId = currentWorkspace?.id ?? null;
  const projectId = currentProject?.id ?? null;

  useEffect(() => {
    if (!workspaceId) {
      return;
    }
    void loadTasks(workspaceId);
    void loadPreferences();
  }, [workspaceId, loadTasks, loadPreferences]);

  const value = useMemo<TaskContextValue>(
    () => ({
      workspaceId,
      projectId,
      tasks,
      status,
      loadTasks: async () => {
        if (!workspaceId) {
          return;
        }
        await loadTasks(workspaceId);
      },
    }),
    [workspaceId, projectId, tasks, status, loadTasks],
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTaskContext = (): TaskContextValue => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within TaskProvider');
  }
  return context;
};
