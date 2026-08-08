import type { ReactNode } from 'react';
import { Navigate, Route } from 'react-router-dom';

import {
  AnalyticsOverviewPage,
  AnalyticsProjectsPage,
  AnalyticsReportsPage,
  AnalyticsShell,
  AnalyticsTasksPage,
  AnalyticsTeamPage,
  AnalyticsTimePage,
  AnalyticsWorkspacePage,
} from '@features/analytics/pages';
import { ANALYTICS_ROUTES } from '@features/analytics/types';

/**
 * Nested analytics routes for the authenticated shell.
 * Spread as children of AuthenticatedLayout Route alongside AppShellRoutes.
 */
export const AnalyticsRoutes: ReactNode = (
  <Route path={ANALYTICS_ROUTES.root} element={<AnalyticsShell />}>
    <Route index element={<Navigate to={ANALYTICS_ROUTES.overview} replace />} />
    <Route path="overview" element={<AnalyticsOverviewPage />} />
    <Route path="workspace" element={<AnalyticsWorkspacePage />} />
    <Route path="projects" element={<AnalyticsProjectsPage />} />
    <Route path="tasks" element={<AnalyticsTasksPage />} />
    <Route path="team" element={<AnalyticsTeamPage />} />
    <Route path="time" element={<AnalyticsTimePage />} />
    <Route path="reports" element={<AnalyticsReportsPage />} />
  </Route>
);
