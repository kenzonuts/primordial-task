import type { ReactNode } from 'react';
import { Route } from 'react-router-dom';

import {
  BoardCreatePage,
  BoardListPage,
  BoardOverviewPage,
  BoardPage,
  BoardSettingsPage,
} from '@features/kanban/pages';
import { KANBAN_ROUTES } from '@features/kanban/types';

/**
 * Nested kanban routes for the authenticated shell.
 * Spread as children of AuthenticatedLayout Route alongside AppShellRoutes.
 */
export const KanbanRoutes: ReactNode = (
  <>
    <Route path={KANBAN_ROUTES.list} element={<BoardListPage />} />
    <Route path={KANBAN_ROUTES.create} element={<BoardCreatePage />} />
    <Route path={KANBAN_ROUTES.board} element={<BoardPage />} />
    <Route path={KANBAN_ROUTES.overview} element={<BoardOverviewPage />} />
    <Route path={KANBAN_ROUTES.settings} element={<BoardSettingsPage />} />
  </>
);
