import type { PropsWithChildren, ReactElement } from 'react';
import { createContext, useContext, useEffect, useMemo } from 'react';

import { useKanbanBoardStore } from '@features/kanban/store/board-store';
import { useKanbanPreferencesStore } from '@features/kanban/store/layout-store';
import type { KanbanBoard } from '@features/kanban/types';
import { useWorkspaceContext } from '@features/workspace/context/workspace-context';

export interface KanbanContextValue {
  readonly workspaceId: string | null;
  readonly boards: readonly KanbanBoard[];
  readonly currentBoard: KanbanBoard | null;
  readonly status: 'idle' | 'loading' | 'ready' | 'error';
  readonly loadBoards: () => Promise<void>;
}

const KanbanContext = createContext<KanbanContextValue | null>(null);

export const KanbanProvider = ({ children }: PropsWithChildren): ReactElement => {
  const { currentWorkspace } = useWorkspaceContext();
  const workspaceId = currentWorkspace?.id ?? null;
  const boards = useKanbanBoardStore((state) => state.boards);
  const currentBoard = useKanbanBoardStore((state) => state.currentBoard);
  const status = useKanbanBoardStore((state) => state.status);
  const loadBoards = useKanbanBoardStore((state) => state.loadBoards);
  const loadPreferences = useKanbanPreferencesStore((state) => state.loadPreferences);

  useEffect(() => {
    if (!workspaceId) {
      return;
    }
    void loadBoards(workspaceId);
    void loadPreferences();
  }, [workspaceId, loadBoards, loadPreferences]);

  const value = useMemo<KanbanContextValue>(
    () => ({
      workspaceId,
      boards,
      currentBoard,
      status,
      loadBoards: async () => {
        if (!workspaceId) {
          return;
        }
        await loadBoards(workspaceId);
      },
    }),
    [workspaceId, boards, currentBoard, status, loadBoards],
  );

  return <KanbanContext.Provider value={value}>{children}</KanbanContext.Provider>;
};

export const useKanbanContext = (): KanbanContextValue => {
  const context = useContext(KanbanContext);
  if (!context) {
    throw new Error('useKanbanContext must be used within KanbanProvider');
  }
  return context;
};
