import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { BrandSection } from '@features/auth/components/brand-section';
import { useAuthStore } from '@features/auth/store/auth-store';
import { AUTH_ROUTES } from '@features/auth/types';
import { Button } from '@shared/ui/primitives/button';
import { Text } from '@shared/ui/typography/text';

export const DashboardPlaceholderScreen = (): React.ReactElement => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async (): Promise<void> => {
    setIsSigningOut(true);
    try {
      await logout();
      navigate(AUTH_ROUTES.welcome, { replace: true });
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <div className="flex min-h-dvh w-full flex-col bg-bg-app px-8 py-8">
      <header className="mx-auto flex w-full max-w-[720px] items-center justify-between">
        <BrandSection size="sm" showName />
        <Button
          type="button"
          variant="ghost"
          size="md"
          loading={isSigningOut}
          onClick={() => {
            void handleSignOut();
          }}
        >
          Sign Out
        </Button>
      </header>

      <main className="mx-auto mt-16 flex w-full max-w-[720px] flex-col gap-3">
        <Text as="h1" variant="h1">
          Dashboard
        </Text>
        <Text as="p" variant="body-lg" muted>
          Authentication complete. Dashboard arrives in a later phase.
        </Text>
      </main>
    </div>
  );
};
