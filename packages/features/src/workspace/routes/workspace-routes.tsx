import type { ReactNode } from 'react';
import { Route } from 'react-router-dom';

import {
  WorkspaceCreatePage,
  WorkspaceEditPage,
  WorkspaceListPage,
  WorkspaceOverviewPage,
  WorkspaceSettingsPage,
} from '@features/workspace/pages';
import { WORKSPACE_ROUTES } from '@features/workspace/types';

/**
 * Nested workspace management routes for the authenticated shell.
 * Spread as children of AuthenticatedLayout Route alongside AppShellRoutes.
 */
export const WorkspaceRoutes: ReactNode = (
  <>
    <Route path={WORKSPACE_ROUTES.list} element={<WorkspaceListPage />} />
    <Route path={WORKSPACE_ROUTES.create} element={<WorkspaceCreatePage />} />
    <Route path={WORKSPACE_ROUTES.detail} element={<WorkspaceOverviewPage />} />
    <Route path={WORKSPACE_ROUTES.edit} element={<WorkspaceEditPage />} />
    <Route path={WORKSPACE_ROUTES.settings} element={<WorkspaceSettingsPage />} />
  </>
);
