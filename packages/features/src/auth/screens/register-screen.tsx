import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { AuthCard } from '@features/auth/components/auth-card';
import { AuthHeader } from '@features/auth/components/auth-header';
import { AuthLayout } from '@features/auth/components/auth-layout';
import { AuthenticationAlert } from '@features/auth/components/authentication-alert';
import { EmailField } from '@features/auth/components/email-field';
import { OAuthButton } from '@features/auth/components/oauth-button';
import { OrDivider } from '@features/auth/components/or-divider';
import { PasswordField } from '@features/auth/components/password-field';
import { resolvePostAuthPath } from '@features/auth/lib/post-auth-navigation';
import { registerSchema, type RegisterFormValues } from '@features/auth/schemas/auth-schemas';
import { useAuthStore } from '@features/auth/store/auth-store';
import { AUTH_ROUTES, type OAuthProvider } from '@features/auth/types';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@shared/ui/forms';
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@shared/ui/overlays/modal';
import { Button } from '@shared/ui/primitives/button';
import { Checkbox } from '@shared/ui/primitives/checkbox';
import { Input } from '@shared/ui/primitives/input';

export const RegisterScreen = (): React.ReactElement => {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const startOAuth = useAuthStore((state) => state.startOAuth);
  const selectWorkspace = useAuthStore((state) => state.selectWorkspace);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  const alertRef = useRef<HTMLDivElement>(null);
  const [oauthLoading, setOauthLoading] = useState<OAuthProvider | null>(null);
  const [confirmLeaveOpen, setConfirmLeaveOpen] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
    mode: 'onBlur',
  });

  const {
    handleSubmit,
    setFocus,
    formState: { isSubmitting, isDirty },
  } = form;

  useEffect(() => {
    setFocus('fullName');
  }, [setFocus]);

  useEffect(() => {
    if (error) {
      alertRef.current?.focus();
    }
  }, [error]);

  const leaveToWelcome = (): void => {
    clearError();
    navigate(AUTH_ROUTES.welcome);
  };

  const requestLeave = (): void => {
    if (isDirty && !isSubmitting) {
      setConfirmLeaveOpen(true);
      return;
    }
    leaveToWelcome();
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== 'Escape' || isSubmitting) {
        return;
      }
      event.preventDefault();
      if (isDirty) {
        setConfirmLeaveOpen(true);
        return;
      }
      leaveToWelcome();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
    // leaveToWelcome closes over stable navigate/clearError
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional
  }, [isDirty, isSubmitting]);

  const navigateAfterAuth = async (): Promise<void> => {
    const { requiresEmailVerification, workspaces, intentPath, selectedWorkspaceId } =
      useAuthStore.getState();

    if (requiresEmailVerification) {
      navigate(AUTH_ROUTES.verifyEmail, { replace: true });
      return;
    }

    if (workspaces.length === 1 && workspaces[0]) {
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
      await register(values);
      navigate(AUTH_ROUTES.verifyEmail, { replace: true });
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

  const isBusy = isSubmitting || oauthLoading !== null;

  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader
          title="Create your account."
          description="Start building in a focused developer workspace."
          onBack={requestLeave}
          backLabel="Back to welcome"
        />

        <Form {...form}>
          <form className="mt-7 flex flex-col gap-4" onSubmit={onSubmit} noValidate>
            {error ? (
              <AuthenticationAlert ref={alertRef} variant="danger" tabIndex={-1}>
                {error}
              </AuthenticationAlert>
            ) : null}

            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      size="lg"
                      autoComplete="name"
                      disabled={isBusy}
                      placeholder="Ada Lovelace"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <EmailField name="email" disabled={isBusy} />
            <PasswordField
              name="password"
              label="Password"
              autoComplete="new-password"
              showStrength
              disabled={isBusy}
            />
            <PasswordField
              name="confirmPassword"
              label="Confirm password"
              autoComplete="new-password"
              disabled={isBusy}
            />

            <Controller
              control={form.control}
              name="acceptTerms"
              render={({ field, fieldState }) => (
                <FormItem>
                  <div className="flex items-start gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked === true);
                        }}
                        disabled={isBusy}
                        aria-invalid={Boolean(fieldState.error) || undefined}
                      />
                    </FormControl>
                    <FormLabel className="font-normal leading-5">
                      I agree to the Terms of Service and Privacy Policy.
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="mt-2 w-full"
              loading={isSubmitting}
              disabled={isBusy}
            >
              {isSubmitting ? 'Creating account' : 'Create Account'}
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

      <Modal open={confirmLeaveOpen} onOpenChange={setConfirmLeaveOpen}>
        <ModalContent size="sm">
          <ModalHeader>
            <ModalTitle>Discard account details?</ModalTitle>
            <ModalDescription>
              You have unsaved information on this form. Leave without creating an account?
            </ModalDescription>
          </ModalHeader>
          <ModalFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setConfirmLeaveOpen(false);
              }}
            >
              Keep editing
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                setConfirmLeaveOpen(false);
                leaveToWelcome();
              }}
            >
              Discard
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </AuthLayout>
  );
};
