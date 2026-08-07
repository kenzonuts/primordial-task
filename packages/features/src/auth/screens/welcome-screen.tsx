import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthLayout } from '@features/auth/components/auth-layout';
import { AuthenticationAlert } from '@features/auth/components/authentication-alert';
import { BrandSection } from '@features/auth/components/brand-section';
import { OAuthButton } from '@features/auth/components/oauth-button';
import { OrDivider } from '@features/auth/components/or-divider';
import { resolvePostAuthPath } from '@features/auth/lib/post-auth-navigation';
import { useAuthStore } from '@features/auth/store/auth-store';
import { AUTH_ROUTES, type OAuthProvider } from '@features/auth/types';
import { Button } from '@shared/ui/primitives/button';
import { Text } from '@shared/ui/typography/text';

export const WelcomeScreen = (): React.ReactElement => {
  const navigate = useNavigate();
  const startOAuth = useAuthStore((state) => state.startOAuth);
  const selectWorkspace = useAuthStore((state) => state.selectWorkspace);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  const [oauthLoading, setOauthLoading] = useState<OAuthProvider | null>(null);

  const handleOAuth = async (provider: OAuthProvider): Promise<void> => {
    clearError();
    setOauthLoading(provider);
    try {
      await startOAuth(provider);
      const { requiresEmailVerification, workspaces, intentPath, selectedWorkspaceId } =
        useAuthStore.getState();

      if (!requiresEmailVerification && workspaces.length === 1 && workspaces[0]) {
        await selectWorkspace(workspaces[0].id);
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
      // Error is stored in the auth store for the alert.
    } finally {
      setOauthLoading(null);
    }
  };

  return (
    <AuthLayout>
      <div className="flex w-full max-w-[520px] flex-col items-center text-center">
        <BrandSection size="lg" showName={false} />
        <Text as="h1" variant="display" className="mt-6">
          Primordial Task
        </Text>
        <Text as="p" variant="body-lg" muted className="mt-3 max-w-[420px]">
          An AI-powered developer workspace for focused teams.
        </Text>

        <div className="mt-10 flex w-full max-w-[360px] flex-col gap-3">
          {error ? (
            <AuthenticationAlert variant="danger" className="text-left">
              {error}
            </AuthenticationAlert>
          ) : null}

          <Button
            type="button"
            variant="primary"
            size="lg"
            className="w-full"
            onClick={() => {
              clearError();
              navigate(AUTH_ROUTES.login);
            }}
          >
            Sign In
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={() => {
              clearError();
              navigate(AUTH_ROUTES.register);
            }}
          >
            Create Account
          </Button>

          <OrDivider className="my-2" />

          <div className="flex flex-col gap-3">
            <OAuthButton
              provider="google"
              loading={oauthLoading === 'google'}
              disabled={oauthLoading !== null}
              onClick={() => {
                void handleOAuth('google');
              }}
            />
            <OAuthButton
              provider="github"
              loading={oauthLoading === 'github'}
              disabled={oauthLoading !== null}
              onClick={() => {
                void handleOAuth('github');
              }}
            />
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};
