import { create } from 'zustand';

import type { LoginFormValues, RegisterFormValues } from '@features/auth/schemas/auth-schemas';
import { createAuthService } from '@features/auth/services/mock-auth-service';
import { useSessionStore } from '@features/auth/store/session-store';
import { useUserStore } from '@features/auth/store/user-store';
import type {
  AuthResult,
  AuthStatus,
  AuthUser,
  AuthWorkspace,
  OAuthProvider,
} from '@features/auth/types';

const authService = createAuthService();

const syncFoundationStores = (result: AuthResult | null): void => {
  useUserStore.getState().setUser(result?.user ?? null);
  if (result?.session) {
    useSessionStore.getState().setSession(result.session);
  } else {
    useSessionStore.getState().clear();
  }
};

interface AuthStoreState {
  readonly status: AuthStatus;
  readonly user: AuthUser | null;
  readonly workspaces: AuthWorkspace[];
  readonly selectedWorkspaceId: string | null;
  readonly requiresEmailVerification: boolean;
  readonly error: string | null;
  readonly intentPath: string | null;
  readonly pendingEmail: string | null;
  setIntentPath(path: string | null): void;
  setPendingEmail(email: string | null): void;
  clearError(): void;
  restoreSession(): Promise<'authenticated' | 'unauthenticated' | 'expired'>;
  login(values: LoginFormValues): Promise<void>;
  register(values: RegisterFormValues): Promise<void>;
  requestPasswordReset(email: string): Promise<void>;
  verifyEmail(code: string): Promise<void>;
  resendVerificationCode(): Promise<void>;
  startOAuth(provider: OAuthProvider): Promise<void>;
  selectWorkspace(workspaceId: string): Promise<void>;
  logout(): Promise<void>;
}

export const useAuthStore = create<AuthStoreState>((set, get) => ({
  status: 'idle',
  user: null,
  workspaces: [],
  selectedWorkspaceId: null,
  requiresEmailVerification: false,
  error: null,
  intentPath: null,
  pendingEmail: null,

  setIntentPath: (path) => {
    set({ intentPath: path });
  },

  setPendingEmail: (email) => {
    set({ pendingEmail: email });
  },

  clearError: () => {
    set({ error: null });
  },

  restoreSession: async () => {
    set({ status: 'session_restoring', error: null });

    try {
      const restored = await authService.restoreSession();
      if (restored) {
        syncFoundationStores(restored);
        set({
          status: 'authenticated',
          user: restored.user,
          workspaces: restored.workspaces,
          requiresEmailVerification: restored.requiresEmailVerification,
          pendingEmail: restored.user.email,
          error: null,
        });
        return 'authenticated';
      }

      const refreshed = await authService.refreshSession();
      if (refreshed) {
        syncFoundationStores(refreshed);
        set({
          status: 'authenticated',
          user: refreshed.user,
          workspaces: refreshed.workspaces,
          requiresEmailVerification: refreshed.requiresEmailVerification,
          pendingEmail: refreshed.user.email,
          error: null,
        });
        return 'authenticated';
      }

      syncFoundationStores(null);
      set({
        status: 'unauthenticated',
        user: null,
        workspaces: [],
        selectedWorkspaceId: null,
        requiresEmailVerification: false,
      });
      return 'unauthenticated';
    } catch {
      useSessionStore.getState().markExpired();
      useUserStore.getState().clear();
      set({
        status: 'error',
        error: 'We could not verify your session.',
      });
      return 'expired';
    }
  },

  login: async (values) => {
    set({ status: 'loading', error: null });
    try {
      const result = await authService.login({
        email: values.email,
        password: values.password,
        rememberMe: values.rememberMe,
      });
      syncFoundationStores(result);
      set({
        status: 'authenticated',
        user: result.user,
        workspaces: result.workspaces,
        requiresEmailVerification: result.requiresEmailVerification,
        pendingEmail: result.user.email,
        error: null,
      });
    } catch (error) {
      set({
        status: 'unauthenticated',
        error: error instanceof Error ? error.message : 'The email or password is incorrect.',
      });
      throw error;
    }
  },

  register: async (values) => {
    set({ status: 'loading', error: null });
    try {
      const result = await authService.register({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        acceptTerms: values.acceptTerms,
      });
      syncFoundationStores(result);
      set({
        status: 'authenticated',
        user: result.user,
        workspaces: result.workspaces,
        requiresEmailVerification: result.requiresEmailVerification,
        pendingEmail: result.user.email,
        error: null,
      });
    } catch (error) {
      set({
        status: 'unauthenticated',
        error:
          error instanceof Error ? error.message : 'An account with this email may already exist.',
      });
      throw error;
    }
  },

  requestPasswordReset: async (email) => {
    set({ status: 'loading', error: null, pendingEmail: email });
    try {
      await authService.requestPasswordReset(email);
      set({ status: 'unauthenticated', error: null });
    } catch (error) {
      set({
        status: 'unauthenticated',
        error: error instanceof Error ? error.message : 'Connection failed.',
      });
      throw error;
    }
  },

  verifyEmail: async (code) => {
    set({ status: 'loading', error: null });
    try {
      const result = await authService.verifyEmail(code);
      syncFoundationStores(result);
      set({
        status: 'authenticated',
        user: result.user,
        workspaces: result.workspaces,
        requiresEmailVerification: false,
        error: null,
      });
    } catch (error) {
      set({
        status: get().user ? 'authenticated' : 'unauthenticated',
        error: error instanceof Error ? error.message : 'Enter a valid verification code.',
      });
      throw error;
    }
  },

  resendVerificationCode: async () => {
    await authService.resendVerificationCode();
  },

  startOAuth: async (provider) => {
    set({ status: 'loading', error: null });
    try {
      const result = await authService.startOAuth(provider);
      syncFoundationStores(result);
      set({
        status: 'authenticated',
        user: result.user,
        workspaces: result.workspaces,
        requiresEmailVerification: false,
        pendingEmail: result.user.email,
        error: null,
      });
    } catch (error) {
      set({
        status: 'unauthenticated',
        error: error instanceof Error ? error.message : 'Provider sign-in failed.',
      });
      throw error;
    }
  },

  selectWorkspace: async (workspaceId) => {
    set({ status: 'loading', error: null });
    try {
      await authService.selectWorkspace(workspaceId);
      set({
        status: 'authenticated',
        selectedWorkspaceId: workspaceId,
      });
    } catch (error) {
      set({
        status: 'authenticated',
        error: error instanceof Error ? error.message : 'This workspace is unavailable.',
      });
      throw error;
    }
  },

  logout: async () => {
    await authService.logout();
    syncFoundationStores(null);
    set({
      status: 'unauthenticated',
      user: null,
      workspaces: [],
      selectedWorkspaceId: null,
      requiresEmailVerification: false,
      pendingEmail: null,
      error: null,
      intentPath: null,
    });
  },
}));
