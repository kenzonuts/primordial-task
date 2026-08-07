import { useEffect, type ReactElement, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { AuthLayout } from '@features/auth/components/auth-layout';
import { AuthenticationLoader } from '@features/auth/components/authentication-loader';
import { useAuthStore } from '@features/auth/store/auth-store';
import { AUTH_ROUTES } from '@features/auth/types';

interface ProtectedRouteProps {
  readonly children: ReactNode;
}

/**
 * Requires an authenticated session. Guests are sent to welcome with intent preserved.
 */
export const ProtectedRoute = ({ children }: ProtectedRouteProps): ReactElement => {
  const location = useLocation();
  const status = useAuthStore((state) => state.status);
  const requiresEmailVerification = useAuthStore((state) => state.requiresEmailVerification);
  const setIntentPath = useAuthStore((state) => state.setIntentPath);

  const isAuthenticated = status === 'authenticated';

  useEffect(() => {
    if (status !== 'session_restoring' && status !== 'idle' && !isAuthenticated) {
      const intent = `${location.pathname}${location.search}`;
      if (intent !== AUTH_ROUTES.welcome && intent !== AUTH_ROUTES.login) {
        setIntentPath(intent);
      }
    }
  }, [isAuthenticated, location.pathname, location.search, setIntentPath, status]);

  if (status === 'idle') {
    return <Navigate to={AUTH_ROUTES.authCheck} replace />;
  }

  if (status === 'session_restoring') {
    return (
      <AuthLayout>
        <AuthenticationLoader status="Checking your session" />
      </AuthLayout>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={AUTH_ROUTES.welcome} replace />;
  }

  if (requiresEmailVerification) {
    return <Navigate to={AUTH_ROUTES.verifyEmail} replace />;
  }

  return <>{children}</>;
};
