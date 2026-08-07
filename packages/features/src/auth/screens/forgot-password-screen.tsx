import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { AuthCard } from '@features/auth/components/auth-card';
import { AuthHeader } from '@features/auth/components/auth-header';
import { AuthLayout } from '@features/auth/components/auth-layout';
import { AuthenticationAlert } from '@features/auth/components/authentication-alert';
import { EmailField } from '@features/auth/components/email-field';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from '@features/auth/schemas/auth-schemas';
import { useAuthStore } from '@features/auth/store/auth-store';
import { AUTH_ROUTES } from '@features/auth/types';
import { Form } from '@shared/ui/forms';
import { Button } from '@shared/ui/primitives/button';
import { Text } from '@shared/ui/typography/text';

export const ForgotPasswordScreen = (): React.ReactElement => {
  const navigate = useNavigate();
  const requestPasswordReset = useAuthStore((state) => state.requestPasswordReset);
  const pendingEmail = useAuthStore((state) => state.pendingEmail);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  const [submitted, setSubmitted] = useState(false);
  const confirmationHeadingRef = useRef<HTMLHeadingElement>(null);
  const alertRef = useRef<HTMLDivElement>(null);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onBlur',
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    if (submitted) {
      confirmationHeadingRef.current?.focus();
    }
  }, [submitted]);

  useEffect(() => {
    if (error) {
      alertRef.current?.focus();
    }
  }, [error]);

  const onSubmit = handleSubmit(async (values) => {
    clearError();
    try {
      await requestPasswordReset(values.email);
      setSubmitted(true);
    } catch {
      // Store holds the form-level error message.
    }
  });

  return (
    <AuthLayout>
      <AuthCard maxWidth={420}>
        {submitted ? (
          <div className="flex flex-col gap-4 text-center" role="status" aria-live="polite">
            <AuthHeader
              title={
                <span ref={confirmationHeadingRef} tabIndex={-1}>
                  Check your email.
                </span>
              }
              description={
                pendingEmail
                  ? `If an account exists for ${pendingEmail}, reset instructions are on the way.`
                  : 'If an account exists for that address, reset instructions are on the way.'
              }
              onBack={() => {
                clearError();
                navigate(AUTH_ROUTES.login);
              }}
              backLabel="Back to sign in"
            />
            <Text as="p" variant="body-sm" muted>
              You can close this window and return once you have reset your password.
            </Text>
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
              Back to Sign In
            </Button>
          </div>
        ) : (
          <>
            <AuthHeader
              title="Reset your password."
              description="Enter your email and we will send reset instructions."
              onBack={() => {
                clearError();
                navigate(AUTH_ROUTES.login);
              }}
              backLabel="Back to sign in"
            />

            <Form {...form}>
              <form className="mt-8 flex flex-col gap-4" onSubmit={onSubmit} noValidate>
                {error ? (
                  <AuthenticationAlert ref={alertRef} variant="danger">
                    {error}
                  </AuthenticationAlert>
                ) : null}

                <EmailField disabled={isSubmitting} autoFocus />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="mt-2 w-full"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending link' : 'Send Reset Link'}
                </Button>
              </form>
            </Form>
          </>
        )}
      </AuthCard>
    </AuthLayout>
  );
};
