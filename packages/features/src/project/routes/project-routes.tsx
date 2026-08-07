import type { ReactNode } from 'react';
import { Route } from 'react-router-dom';

import {
  ProjectCreatePage,
  ProjectEditPage,
  ProjectListPage,
  ProjectOverviewPage,
  ProjectSettingsPage,
} from '@features/project/pages';
import { PROJECT_ROUTES } from '@features/project/types';

/**
 * Nested project management routes for the authenticated shell.
 * Spread as children of AuthenticatedLayout Route alongside AppShellRoutes.
 */
export const ProjectRoutes: ReactNode = (
  <>
    <Route path={PROJECT_ROUTES.list} element={<ProjectListPage />} />
    <Route path={PROJECT_ROUTES.create} element={<ProjectCreatePage />} />
    <Route path={PROJECT_ROUTES.detail} element={<ProjectOverviewPage />} />
    <Route path={PROJECT_ROUTES.edit} element={<ProjectEditPage />} />
    <Route path={PROJECT_ROUTES.settings} element={<ProjectSettingsPage />} />
  </>
);
