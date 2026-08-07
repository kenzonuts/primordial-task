import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { AuthCard } from '@features/auth/components/auth-card';
import { AuthHeader } from '@features/auth/components/auth-header';
import { AuthLayout } from '@features/auth/components/auth-layout';
import { AuthenticationAlert } from '@features/auth/components/authentication-alert';
import { EmailField } from '@features/auth/components/email-field';
import { OAuthButton } from '@features/auth/components/oauth-button';
import { OrDivider } from '@features/auth/components/or-divider';
import { PasswordField } from '@features/auth/components/password-field';
import { RememberMeRow } from '@features/auth/components/remember-me-row';
import { resolvePostAuthPath } from '@features/auth/lib/post-auth-navigation';
import { loginSchema, type LoginFormValues } from '@features/auth/schemas/auth-schemas';
import { useAuthStore } from '@features/auth/store/auth-store';
import { AUTH_ROUTES, type OAuthProvider } from '@features/auth/types';
import { Form } from '@shared/ui/forms';
import { Button } from '@shared/ui/primitives/button';

export const LoginScreen = (): React.ReactElement => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const startOAuth = useAuthStore((state) => state.startOAuth);
  const selectWorkspace = useAuthStore((state) => state.selectWorkspace);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  const alertRef = useRef<HTMLDivElement>(null);
  const [oauthLoading, setOauthLoading] = useState<OAuthProvider | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    mode: 'onBlur',
  });

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    if (error) {
      alertRef.current?.focus();
    }
  }, [error]);

  const navigateAfterAuth = async (): Promise<void> => {
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
  };

  const onSubmit = handleSubmit(async (values) => {
    clearError();
    try {
      await login(values);
      await navigateAfterAuth();
    } catch {
      // Store holds the form-level error message.
    }
  });

  const handleOAuth = async (provider: OAuthProvider): Promise<void> => {
    clearError();
    setOauthLoading(provider);
    try {
      await startOAuth(provider);
      await navigateAfterAuth();
    } catch {
      // Store holds the form-level error message.
    } finally {
      setOauthLoading(null);
    }
  };

  const rememberMe = watch('rememberMe');
  const isBusy = isSubmitting || oauthLoading !== null;

  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader
          title="Welcome back."
          description="Let's continue building great products."
          onBack={() => {
            clearError();
            navigate(AUTH_ROUTES.welcome);
          }}
          backLabel="Back to welcome"
        />

        <Form {...form}>
          <form className="mt-8 flex flex-col gap-4" onSubmit={onSubmit} noValidate>
            {error ? (
              <AuthenticationAlert ref={alertRef} variant="danger">
                {error}
              </AuthenticationAlert>
            ) : null}

            <EmailField disabled={isBusy} autoFocus />
            <PasswordField
              name="password"
              label="Password"
              autoComplete="current-password"
              disabled={isBusy}
            />

            <RememberMeRow
              checked={rememberMe}
              disabled={isBusy}
              onCheckedChange={(checked) => {
                setValue('rememberMe', checked, { shouldDirty: true });
              }}
              onForgotPassword={() => {
                clearError();
                navigate(AUTH_ROUTES.forgotPassword);
              }}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="mt-2 w-full"
              loading={isSubmitting}
              disabled={isBusy}
            >
              {isSubmitting ? 'Signing in' : 'Sign In'}
            </Button>

            <OrDivider className="my-2" />

            <div className="flex flex-col gap-3">
              <OAuthButton
                provider="google"
                loading={oauthLoading === 'google'}
                disabled={isBusy}
                onClick={() => {
                  void handleOAuth('google');
                }}
              />
              <OAuthButton
                provider="github"
                loading={oauthLoading === 'github'}
                disabled={isBusy}
                onClick={() => {
                  void handleOAuth('github');
                }}
              />
            </div>
          </form>
        </Form>
      </AuthCard>
    </AuthLayout>
  );
};
