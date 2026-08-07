import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthLayout } from '@features/auth/components/auth-layout';
import { AuthenticationAlert } from '@features/auth/components/authentication-alert';
import { AuthenticationLoader } from '@features/auth/components/authentication-loader';
import { BrandSection } from '@features/auth/components/brand-section';
import { resolvePostAuthPath } from '@features/auth/lib/post-auth-navigation';
import { useAuthStore } from '@features/auth/store/auth-store';
import { AUTH_ROUTES } from '@features/auth/types';
import { Button } from '@shared/ui/primitives/button';

type CheckPhase = 'checking' | 'refreshing' | 'expired' | 'failed';

export const AuthCheckScreen = (): React.ReactElement => {
  const navigate = useNavigate();
  const restoreSession = useAuthStore((state) => state.restoreSession);
  const selectWorkspace = useAuthStore((state) => state.selectWorkspace);
  const clearError = useAuthStore((state) => state.clearError);
  const error = useAuthStore((state) => state.error);
  const [phase, setPhase] = useState<CheckPhase>('checking');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const run = async (): Promise<void> => {
      setPhase('checking');
      clearError();

      const refreshTimer = window.setTimeout(() => {
        if (!cancelled) {
          setPhase('refreshing');
        }
      }, 700);

      try {
        const result = await restoreSession();
        window.clearTimeout(refreshTimer);
        if (cancelled) {
          return;
        }

        if (result === 'unauthenticated') {
          navigate(AUTH_ROUTES.welcome, { replace: true });
          return;
        }

        if (result === 'expired') {
          setPhase('expired');
          return;
        }

        const { requiresEmailVerification, workspaces, intentPath, selectedWorkspaceId } =
          useAuthStore.getState();

        if (requiresEmailVerification) {
          navigate(AUTH_ROUTES.verifyEmail, { replace: true });
          return;
        }

        if (workspaces.length === 1 && workspaces[0]) {
          await selectWorkspace(workspaces[0].id);
          if (cancelled) {
            return;
          }
          navigate(AUTH_ROUTES.dashboard, { replace: true });
          return;
        }

        navigate(
          resolvePostAuthPath({
            requiresEmailVerification,
            workspaces,
            intentPath,
            selectedWorkspaceId,
          }),
          { replace: true },
        );
      } catch {
        window.clearTimeout(refreshTimer);
        if (!cancelled) {
          setPhase('failed');
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [attempt, clearError, navigate, restoreSession, selectWorkspace]);

  useEffect(() => {
    if (phase === 'expired' || phase === 'failed') {
      document.getElementById('auth-check-sign-in-again')?.focus();
    }
  }, [phase]);

  const statusLabel = phase === 'refreshing' ? 'Restoring secure session' : 'Checking your session';
  const showRecovery = phase === 'expired' || phase === 'failed';
  const alertMessage =
    phase === 'expired'
      ? 'Your session expired. Sign in again to continue.'
      : (error ?? 'We could not verify your session.');

  return (
    <AuthLayout>
      <div className="flex w-full max-w-[360px] flex-col items-center text-center">
        <BrandSection size="md" showName />
        <h1 className="sr-only">Checking authentication</h1>

        <div className="mt-6 flex w-full flex-col items-center gap-3">
          {showRecovery ? (
            <>
              <AuthenticationAlert variant="danger" className="w-full text-left">
                {alertMessage}
              </AuthenticationAlert>
              <Button
                id="auth-check-sign-in-again"
                type="button"
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => {
                  navigate(phase === 'expired' ? AUTH_ROUTES.sessionExpired : AUTH_ROUTES.login, {
                    replace: true,
                  });
                }}
              >
                Sign in again
              </Button>
              {phase === 'failed' ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  onClick={() => {
                    setAttempt((value) => value + 1);
                  }}
                >
                  Retry
                </Button>
              ) : null}
            </>
          ) : (
            <AuthenticationLoader status={statusLabel} />
          )}
        </div>
      </div>
    </AuthLayout>
  );
};
