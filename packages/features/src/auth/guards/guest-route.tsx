import type { ReactElement, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { AuthLayout } from '@features/auth/components/auth-layout';
import { AuthenticationLoader } from '@features/auth/components/authentication-loader';
import { resolvePostAuthPath } from '@features/auth/lib/post-auth-navigation';
import { useAuthStore } from '@features/auth/store/auth-store';
import { AUTH_ROUTES } from '@features/auth/types';

interface GuestRouteProps {
  readonly children: ReactNode;
}

/**
 * Allows only unauthenticated users. Authenticated users are redirected onward.
 */
export const GuestRoute = ({ children }: GuestRouteProps): ReactElement => {
  const status = useAuthStore((state) => state.status);
  const requiresEmailVerification = useAuthStore((state) => state.requiresEmailVerification);
  const workspaces = useAuthStore((state) => state.workspaces);
  const selectedWorkspaceId = useAuthStore((state) => state.selectedWorkspaceId);
  const intentPath = useAuthStore((state) => state.intentPath);

  if (status === 'session_restoring') {
    return (
      <AuthLayout>
        <AuthenticationLoader status="Checking your session" />
      </AuthLayout>
    );
  }

  if (status === 'authenticated') {
    if (requiresEmailVerification) {
      return <Navigate to={AUTH_ROUTES.verifyEmail} replace />;
    }

    return (
      <Navigate
        to={resolvePostAuthPath({
          requiresEmailVerification: false,
          workspaces,
          intentPath,
          selectedWorkspaceId,
        })}
        replace
      />
    );
  }

  return <>{children}</>;
};
