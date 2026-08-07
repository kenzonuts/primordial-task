import { ROUTES } from '@core/app/constants';
import { AUTH_ROUTES } from '@features/auth/types';
import type { AuthWorkspace } from '@features/auth/types';

export interface PostAuthNavigationInput {
  readonly requiresEmailVerification: boolean;
  readonly workspaces: readonly AuthWorkspace[];
  readonly intentPath?: string | null;
  readonly selectedWorkspaceId?: string | null;
}

/**
 * Resolves where to send the user after a successful auth step.
 * Single workspace → dashboard. Multiple → shell workspace list.
 * Callers that need to auto-select a single workspace should do so before navigating to dashboard.
 */
export const resolvePostAuthPath = ({
  requiresEmailVerification,
  workspaces,
  intentPath,
  selectedWorkspaceId,
}: PostAuthNavigationInput): string => {
  if (requiresEmailVerification) {
    return AUTH_ROUTES.verifyEmail;
  }

  if (intentPath && intentPath !== AUTH_ROUTES.splash && intentPath !== AUTH_ROUTES.authCheck) {
    return intentPath;
  }

  if (selectedWorkspaceId) {
    return AUTH_ROUTES.dashboard;
  }

  if (workspaces.length === 1) {
    return AUTH_ROUTES.dashboard;
  }

  return ROUTES.workspaces;
};

export const getUserInitials = (fullName: string | undefined | null): string => {
  if (!fullName?.trim()) {
    return 'PT';
  }

  return (
    fullName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('') || 'PT'
  );
};
