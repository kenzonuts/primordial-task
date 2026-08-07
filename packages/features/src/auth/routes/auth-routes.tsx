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
import { AuthenticatedLayout } from '@features/shell/layouts/authenticated-layout';
import { ModulePlaceholderPage } from '@features/shell/pages/placeholder-page';
import { APP_ROUTES } from '@features/shell/types';

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
        <Route path={APP_ROUTES.dashboard} element={<ModulePlaceholderPage />} />
        <Route path={APP_ROUTES.projects} element={<ModulePlaceholderPage />} />
        <Route path={APP_ROUTES.tasks} element={<ModulePlaceholderPage />} />
        <Route path={APP_ROUTES.kanban} element={<ModulePlaceholderPage />} />
        <Route path={APP_ROUTES.calendar} element={<ModulePlaceholderPage />} />
        <Route path={APP_ROUTES.analytics} element={<ModulePlaceholderPage />} />
        <Route path={APP_ROUTES.aiWorkspace} element={<ModulePlaceholderPage />} />
        <Route path={APP_ROUTES.developerWorkspace} element={<ModulePlaceholderPage />} />
        <Route path={APP_ROUTES.settings} element={<ModulePlaceholderPage />} />
      </Route>

      <Route path="*" element={<Navigate to={AUTH_ROUTES.splash} replace />} />
    </Routes>
  );
};
