import { useNavigate } from 'react-router-dom';

import { AuthLayout } from '@features/auth/components/auth-layout';
import { SessionExpiredDialog } from '@features/auth/components/session-expired-dialog';
import { useAuthStore } from '@features/auth/store/auth-store';
import { AUTH_ROUTES } from '@features/auth/types';

export const SessionExpiredScreen = (): React.ReactElement => {
  const navigate = useNavigate();
  const clearError = useAuthStore((state) => state.clearError);

  return (
    <AuthLayout>
      <h1 className="sr-only">Session expired</h1>
      <div className="flex w-full max-w-[420px] flex-col items-center">
        <SessionExpiredDialog
          open
          onSignInAgain={() => {
            clearError();
            navigate(AUTH_ROUTES.login, { replace: true });
          }}
        />
      </div>
    </AuthLayout>
  );
};
