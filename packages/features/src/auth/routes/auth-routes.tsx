import type { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { GuestRoute } from '@features/auth/guards/guest-route';
import { ProtectedRoute } from '@features/auth/guards/protected-route';
import { AuthCheckScreen } from '@features/auth/screens/auth-check-screen';
import { ForgotPasswordScreen } from '@features/auth/screens/forgot-password-screen';
import { LoginScreen } from '@features/auth/screens/login-screen';
import { RegisterScreen } from '@features/auth/screens/register-screen';
import { SessionExpiredScreen } from '@features/auth/screens/session-expired-screen';
import { SplashScreen } from '@features/auth/screens/splash-screen';
import { VerifyEmailScreen } from '@features/auth/screens/verify-email-screen';
import { WelcomeScreen } from '@features/auth/screens/welcome-screen';
import { WorkspaceSelectionScreen } from '@features/auth/screens/workspace-selection-screen';
import { AUTH_ROUTES } from '@features/auth/types';
import { CalendarRoutes } from '@features/calendar/routes/calendar-routes';
import { KanbanRoutes } from '@features/kanban/routes/kanban-routes';
import { NotesRoutes } from '@features/notes/routes/notes-routes';
import { ProjectRoutes } from '@features/project/routes/project-routes';
import { AuthenticatedLayout } from '@features/shell/layouts/authenticated-layout';
import { AppShellRoutes } from '@features/shell/routes/app-shell-routes';
import { TaskRoutes } from '@features/task/routes/task-routes';
import { WorkspaceRoutes } from '@features/workspace/routes/workspace-routes';

/**
 * Top-level auth route tree for Primordial Task.
 */
export const AuthRouter = (): ReactElement => {
  return (
    <Routes>
      <Route path={AUTH_ROUTES.splash} element={<SplashScreen />} />
      <Route path={AUTH_ROUTES.authCheck} element={<AuthCheckScreen />} />

      <Route
        path={AUTH_ROUTES.welcome}
        element={
          <GuestRoute>
            <WelcomeScreen />
          </GuestRoute>
        }
      />
      <Route
        path={AUTH_ROUTES.login}
        element={
          <GuestRoute>
            <LoginScreen />
          </GuestRoute>
        }
      />
      <Route
        path={AUTH_ROUTES.register}
        element={
          <GuestRoute>
            <RegisterScreen />
          </GuestRoute>
        }
      />
      <Route
        path={AUTH_ROUTES.forgotPassword}
        element={
          <GuestRoute>
            <ForgotPasswordScreen />
          </GuestRoute>
        }
      />

      <Route path={AUTH_ROUTES.verifyEmail} element={<VerifyEmailScreen />} />
      <Route path={AUTH_ROUTES.sessionExpired} element={<SessionExpiredScreen />} />

      <Route
        path={AUTH_ROUTES.workspaces}
        element={
          <ProtectedRoute>
            <WorkspaceSelectionScreen />
          </ProtectedRoute>
        }
      />

      <Route
        element={
          <ProtectedRoute>
            <AuthenticatedLayout />
          </ProtectedRoute>
        }
      >
        {AppShellRoutes}
        {WorkspaceRoutes}
        {ProjectRoutes}
        {TaskRoutes}
        {KanbanRoutes}
        {CalendarRoutes}
        {NotesRoutes}
      </Route>

      <Route path="*" element={<Navigate to={AUTH_ROUTES.splash} replace />} />
    </Routes>
  );
};
