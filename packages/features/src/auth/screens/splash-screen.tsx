import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthLayout } from '@features/auth/components/auth-layout';
import { AuthenticationLoader } from '@features/auth/components/authentication-loader';
import { BrandSection } from '@features/auth/components/brand-section';
import { AUTH_ROUTES } from '@features/auth/types';
import { Button } from '@shared/ui/primitives/button';
import { Text } from '@shared/ui/typography/text';

const MIN_DISPLAY_MS = 600;
const STATUS_SWAP_MS = 320;
const TIMEOUT_MS = 8000;

type SplashPhase = 'opening' | 'checking' | 'timeout';

export const SplashScreen = (): React.ReactElement => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<SplashPhase>('opening');
  const [attempt, setAttempt] = useState(0);
  const navigatedRef = useRef(false);

  useEffect(() => {
    navigatedRef.current = false;
    setPhase('opening');

    const statusTimer = window.setTimeout(() => {
      setPhase((current) => (current === 'timeout' ? current : 'checking'));
    }, STATUS_SWAP_MS);

    const navigateTimer = window.setTimeout(() => {
      if (navigatedRef.current) {
        return;
      }
      navigatedRef.current = true;
      navigate(AUTH_ROUTES.authCheck, { replace: true });
    }, MIN_DISPLAY_MS);

    const timeoutTimer = window.setTimeout(() => {
      if (navigatedRef.current) {
        return;
      }
      setPhase('timeout');
    }, TIMEOUT_MS);

    return () => {
      window.clearTimeout(statusTimer);
      window.clearTimeout(navigateTimer);
      window.clearTimeout(timeoutTimer);
    };
  }, [attempt, navigate]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    window.addEventListener('keydown', onKeyDown, true);
    return () => {
      window.removeEventListener('keydown', onKeyDown, true);
    };
  }, []);

  const statusLabel =
    phase === 'opening'
      ? 'Opening Primordial Task'
      : phase === 'checking'
        ? 'Checking session'
        : 'Primordial Task is taking longer than expected';

  return (
    <AuthLayout version="0.1.0">
      <div className="flex w-full max-w-[320px] flex-col items-center text-center">
        <BrandSection size="lg" showName />
        <h1 className="sr-only">Primordial Task</h1>

        <div className="mt-8 flex w-full flex-col items-center gap-3">
          {phase === 'timeout' ? (
            <>
              <Text
                as="p"
                variant="body-md"
                muted
                role="status"
                aria-live="polite"
                className="text-center"
              >
                {statusLabel}
              </Text>
              <Button
                type="button"
                variant="ghost"
                size="lg"
                onClick={() => {
                  navigatedRef.current = false;
                  setAttempt((value) => value + 1);
                }}
              >
                Retry
              </Button>
            </>
          ) : (
            <AuthenticationLoader label={statusLabel} />
          )}
        </div>
      </div>
    </AuthLayout>
  );
};
