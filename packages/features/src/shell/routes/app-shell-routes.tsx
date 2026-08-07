import type { ReactElement, ReactNode } from 'react';
import { Route } from 'react-router-dom';

import { ProtectedRoute } from '@features/auth/guards/protected-route';
import { AuthenticatedLayout } from '@features/shell/layouts/authenticated-layout';
import { ModulePlaceholderPage } from '@features/shell/pages/placeholder-page';
import { APP_ROUTES } from '@features/shell/types';

/**
 * Protected shell host that renders AuthenticatedLayout + Outlet for nested module routes.
 */
export const AuthenticatedAppShell = (): ReactElement => {
  return (
    <ProtectedRoute>
      <AuthenticatedLayout />
    </ProtectedRoute>
  );
};

/**
 * Nested module route elements for the authenticated shell.
 * Spread as children of a layout Route (Fragment children are discovered by React Router).
 *
 * @example
 * ```tsx
 * <Route element={<AuthenticatedAppShell />}>
 *   {AppShellRoutes}
 * </Route>
 * ```
 */
export const AppShellRoutes: ReactNode = (
  <>
    <Route path={APP_ROUTES.dashboard} element={<ModulePlaceholderPage />} />
    <Route path={APP_ROUTES.projects} element={<ModulePlaceholderPage />} />
    <Route path={APP_ROUTES.tasks} element={<ModulePlaceholderPage />} />
    <Route path={APP_ROUTES.kanban} element={<ModulePlaceholderPage />} />
    <Route path={APP_ROUTES.calendar} element={<ModulePlaceholderPage />} />
    <Route path={APP_ROUTES.analytics} element={<ModulePlaceholderPage />} />
    <Route path={APP_ROUTES.aiWorkspace} element={<ModulePlaceholderPage />} />
    <Route path={APP_ROUTES.developerWorkspace} element={<ModulePlaceholderPage />} />
    <Route path={APP_ROUTES.settings} element={<ModulePlaceholderPage />} />
  </>
);
