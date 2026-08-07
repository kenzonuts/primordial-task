import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthCard } from '@features/auth/components/auth-card';
import { AuthHeader } from '@features/auth/components/auth-header';
import { AuthLayout } from '@features/auth/components/auth-layout';
import { AuthenticationAlert } from '@features/auth/components/authentication-alert';
import { VerificationCodeInput } from '@features/auth/components/verification-code-input';
import { resolvePostAuthPath } from '@features/auth/lib/post-auth-navigation';
import { useAuthStore } from '@features/auth/store/auth-store';
import { AUTH_ROUTES } from '@features/auth/types';
import { Button } from '@shared/ui/primitives/button';
import { Text } from '@shared/ui/typography/text';

const RESEND_COOLDOWN_SECONDS = 30;

export const VerifyEmailScreen = (): React.ReactElement => {
  const navigate = useNavigate();
  const pendingEmail = useAuthStore((state) => state.pendingEmail);
  const verifyEmail = useAuthStore((state) => state.verifyEmail);
  const resendVerificationCode = useAuthStore((state) => state.resendVerificationCode);
  const selectWorkspace = useAuthStore((state) => state.selectWorkspace);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const alertRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (error) {
      alertRef.current?.focus();
    }
  }, [error]);

  useEffect(() => {
    if (cooldown <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setCooldown((value) => Math.max(0, value - 1));
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [cooldown]);

  const navigateAfterVerification = async (): Promise<void> => {
    const { workspaces, intentPath, selectedWorkspaceId } = useAuthStore.getState();

    if (workspaces.length === 1 && workspaces[0]) {
      await selectWorkspace(workspaces[0].id);
      navigate(AUTH_ROUTES.dashboard, { replace: true });
      return;
    }

    navigate(
      resolvePostAuthPath({
        requiresEmailVerification: false,
        workspaces,
        intentPath,
        selectedWorkspaceId,
      }),
      { replace: true },
    );
  };

  const handleVerify = async (): Promise<void> => {
    clearError();
    setIsVerifying(true);
    try {
      await verifyEmail(code);
      await navigateAfterVerification();
    } catch {
      // Store holds the form-level error message.
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async (): Promise<void> => {
    if (cooldown > 0 || isResending) {
      return;
    }

    clearError();
    setIsResending(true);
    try {
      await resendVerificationCode();
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch {
      // Store holds the error message.
    } finally {
      setIsResending(false);
    }
  };

  const canVerify = code.length === 6 && !isVerifying;

  return (
    <AuthLayout>
      <AuthCard maxWidth={420}>
        <AuthHeader
          title="Verify your email."
          description={
            pendingEmail
              ? `Enter the 6-digit code sent to ${pendingEmail}.`
              : 'Enter the 6-digit code sent to your email.'
          }
        />

        <div className="mt-8 flex flex-col gap-6">
          {error ? (
            <AuthenticationAlert ref={alertRef} variant="danger">
              {error}
            </AuthenticationAlert>
          ) : null}

          <VerificationCodeInput
            value={code}
            onChange={(next) => {
              clearError();
              setCode(next);
            }}
            disabled={isVerifying}
            autoFocus
          />

          <Button
            type="button"
            variant="primary"
            size="lg"
            className="w-full"
            loading={isVerifying}
            disabled={!canVerify}
            onClick={() => {
              void handleVerify();
            }}
          >
            {isVerifying ? 'Verifying' : 'Verify'}
          </Button>

          <div className="flex flex-col items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="md"
              disabled={cooldown > 0 || isResending || isVerifying}
              loading={isResending}
              onClick={() => {
                void handleResend();
              }}
            >
              {cooldown > 0 ? `Resend Code (${cooldown}s)` : 'Resend Code'}
            </Button>
            {cooldown > 0 ? (
              <Text as="p" variant="caption" muted role="status" aria-live="polite">
                You can resend a new code in {cooldown} seconds.
              </Text>
            ) : null}

            <Button
              type="button"
              variant="ghost"
              size="md"
              disabled={isVerifying}
              onClick={() => {
                clearError();
                navigate(AUTH_ROUTES.register);
              }}
            >
              Use a different email
            </Button>
          </div>
        </div>
      </AuthCard>
    </AuthLayout>
  );
};
