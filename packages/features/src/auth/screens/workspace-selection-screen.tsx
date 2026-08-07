import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthenticationAlert } from '@features/auth/components/authentication-alert';
import { BrandSection } from '@features/auth/components/brand-section';
import { WorkspaceSelector } from '@features/auth/components/workspace-selector';
import { getUserInitials } from '@features/auth/lib/post-auth-navigation';
import { useAuthStore } from '@features/auth/store/auth-store';
import { AUTH_ROUTES } from '@features/auth/types';
import { EmptyState } from '@shared/ui/composites/empty-state';
import { Avatar, AvatarFallback, AvatarImage } from '@shared/ui/primitives/avatar';
import { Button } from '@shared/ui/primitives/button';
import { Skeleton } from '@shared/ui/primitives/skeleton';
import { Text } from '@shared/ui/typography/text';

export const WorkspaceSelectionScreen = (): React.ReactElement => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const workspaces = useAuthStore((state) => state.workspaces);
  const selectWorkspace = useAuthStore((state) => state.selectWorkspace);
  const logout = useAuthStore((state) => state.logout);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isContinuing, setIsContinuing] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsLoadingList(false);
    }, 280);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  const handleContinue = async (workspaceId: string): Promise<void> => {
    clearError();
    setIsContinuing(true);
    try {
      await selectWorkspace(workspaceId);
      navigate(AUTH_ROUTES.dashboard, { replace: true });
    } catch {
      // Store holds the alert message.
    } finally {
      setIsContinuing(false);
    }
  };

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
    <div className="flex min-h-dvh w-full flex-col bg-bg-app px-8 py-8 max-md:px-6">
      <header className="mx-auto flex h-16 w-full max-w-[1040px] items-center justify-between gap-4">
        <BrandSection size="sm" showName />
        <div className="flex items-center gap-3">
          <Avatar size="md" aria-label={user?.fullName ?? 'Account'}>
            {user?.avatarUrl ? <AvatarImage src={user.avatarUrl} alt="" /> : null}
            <AvatarFallback initials={getUserInitials(user?.fullName)} />
          </Avatar>
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
        </div>
      </header>

      <main className="mx-auto mt-10 w-full max-w-[1040px] flex-1">
        <Text as="h1" variant="h1">
          Choose a workspace.
        </Text>
        <Text as="p" variant="body-lg" muted className="mt-2">
          Select where you want to continue.
        </Text>

        {error ? (
          <AuthenticationAlert variant="danger" className="mt-6">
            {error}
          </AuthenticationAlert>
        ) : null}

        <div className="mt-6">
          {isLoadingList ? (
            <div
              className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
              role="status"
              aria-live="polite"
              aria-label="Loading workspaces"
            >
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-[132px] w-full rounded-lg" />
              ))}
            </div>
          ) : workspaces.length === 0 ? (
            <EmptyState
              title="No workspaces available."
              description="You are signed in, but this account is not connected to a workspace."
              action={
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={() => {
                    void handleSignOut();
                  }}
                >
                  Sign Out
                </Button>
              }
            />
          ) : (
            <WorkspaceSelector
              workspaces={workspaces}
              selectedId={selectedId}
              loading={isContinuing}
              onSelect={setSelectedId}
              onContinue={() => {
                if (selectedId) {
                  void handleContinue(selectedId);
                }
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
};
