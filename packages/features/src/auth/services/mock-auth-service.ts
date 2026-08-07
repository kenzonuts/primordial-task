import type {
  AuthResult,
  AuthService,
  AuthSession,
  AuthUser,
  AuthWorkspace,
  LoginCredentials,
  OAuthProvider,
  RegisterCredentials,
} from '@features/auth/types';

const STORAGE_KEY = 'primordial-auth-session';
const PENDING_EMAIL_KEY = 'primordial-auth-pending-email';

interface StoredAuthState {
  readonly user: AuthUser;
  readonly session: AuthSession;
  readonly workspaces: AuthWorkspace[];
  readonly requiresEmailVerification: boolean;
  readonly selectedWorkspaceId?: string;
}

const delay = async (ms: number): Promise<void> => {
  await new Promise((resolve) => {
    globalThis.setTimeout(resolve, ms);
  });
};

const createId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `id-${Date.now()}`;
};

const createSession = (rememberMe: boolean): AuthSession => {
  const now = Date.now();
  return {
    accessToken: `access-${createId()}`,
    refreshToken: `refresh-${createId()}`,
    expiresAt: now + (rememberMe ? 1000 * 60 * 60 * 24 * 30 : 1000 * 60 * 60 * 8),
    rememberMe,
  };
};

const defaultWorkspaces = (fullName: string): AuthWorkspace[] => {
  const initials = fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

  return [
    {
      id: 'ws-personal',
      name: `${fullName.split(' ')[0] ?? 'Personal'} Workspace`,
      role: 'Owner',
      memberCount: 1,
      lastActivityAt: Date.now() - 1000 * 60 * 30,
      initials: initials || 'PT',
    },
    {
      id: 'ws-team',
      name: 'Primordial Studio',
      role: 'Admin',
      memberCount: 12,
      lastActivityAt: Date.now() - 1000 * 60 * 60 * 5,
      initials: 'PS',
    },
  ];
};

const readStoredState = (): StoredAuthState | null => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as StoredAuthState;
  } catch {
    return null;
  }
};

const writeStoredState = (state: StoredAuthState | null): void => {
  if (!state) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const toResult = (state: StoredAuthState): AuthResult => ({
  user: state.user,
  session: state.session,
  workspaces: state.workspaces,
  requiresEmailVerification: state.requiresEmailVerification,
});

export class MockAuthService implements AuthService {
  async restoreSession(): Promise<AuthResult | null> {
    await delay(400);
    const stored = readStoredState();
    if (!stored) {
      return null;
    }

    if (stored.session.expiresAt <= Date.now()) {
      return null;
    }

    return toResult(stored);
  }

  async refreshSession(): Promise<AuthResult | null> {
    await delay(350);
    const stored = readStoredState();
    if (!stored) {
      return null;
    }

    if (stored.session.expiresAt <= Date.now() - 1000 * 60 * 60) {
      writeStoredState(null);
      return null;
    }

    const refreshed: StoredAuthState = {
      ...stored,
      session: createSession(stored.session.rememberMe),
    };
    writeStoredState(refreshed);
    return toResult(refreshed);
  }

  async login(credentials: LoginCredentials): Promise<AuthResult> {
    await delay(500);

    if (credentials.password === 'wrong-password') {
      throw new Error('The email or password is incorrect.');
    }

    const fullName = credentials.email.split('@')[0]?.replace(/\./g, ' ') ?? 'User';
    const user: AuthUser = {
      id: createId(),
      email: credentials.email.trim().toLowerCase(),
      fullName: fullName.replace(/\b\w/g, (char) => char.toUpperCase()),
      emailVerified: true,
    };

    const state: StoredAuthState = {
      user,
      session: createSession(credentials.rememberMe),
      workspaces: defaultWorkspaces(user.fullName),
      requiresEmailVerification: false,
    };

    writeStoredState(state);
    return toResult(state);
  }

  async register(credentials: RegisterCredentials): Promise<AuthResult> {
    await delay(600);

    if (credentials.email.trim().toLowerCase() === 'exists@primordial.dev') {
      throw new Error('An account with this email may already exist.');
    }

    const user: AuthUser = {
      id: createId(),
      email: credentials.email.trim().toLowerCase(),
      fullName: credentials.fullName.trim(),
      emailVerified: false,
    };

    const state: StoredAuthState = {
      user,
      session: createSession(true),
      workspaces: defaultWorkspaces(user.fullName),
      requiresEmailVerification: true,
    };

    writeStoredState(state);
    window.localStorage.setItem(PENDING_EMAIL_KEY, user.email);
    return toResult(state);
  }

  async requestPasswordReset(email: string): Promise<void> {
    await delay(450);
    window.localStorage.setItem(PENDING_EMAIL_KEY, email.trim().toLowerCase());
  }

  async verifyEmail(code: string): Promise<AuthResult> {
    await delay(450);
    const stored = readStoredState();
    if (!stored) {
      throw new Error('We could not verify your session.');
    }

    if (code !== '123456') {
      throw new Error('Enter a valid verification code.');
    }

    const next: StoredAuthState = {
      ...stored,
      user: { ...stored.user, emailVerified: true },
      requiresEmailVerification: false,
    };
    writeStoredState(next);
    return toResult(next);
  }

  async resendVerificationCode(): Promise<void> {
    await delay(300);
  }

  async listWorkspaces(): Promise<AuthWorkspace[]> {
    await delay(300);
    return readStoredState()?.workspaces ?? [];
  }

  async selectWorkspace(workspaceId: string): Promise<void> {
    await delay(200);
    const stored = readStoredState();
    if (!stored) {
      throw new Error('We could not verify your session.');
    }

    writeStoredState({
      ...stored,
      selectedWorkspaceId: workspaceId,
    });
  }

  async logout(): Promise<void> {
    await delay(150);
    writeStoredState(null);
    window.localStorage.removeItem(PENDING_EMAIL_KEY);
  }

  async startOAuth(provider: OAuthProvider): Promise<AuthResult> {
    await delay(500);
    const fullName = provider === 'google' ? 'Google User' : 'GitHub User';
    const user: AuthUser = {
      id: createId(),
      email: `${provider}@primordial.dev`,
      fullName,
      emailVerified: true,
    };

    const state: StoredAuthState = {
      user,
      session: createSession(true),
      workspaces: defaultWorkspaces(fullName),
      requiresEmailVerification: false,
    };

    writeStoredState(state);
    return toResult(state);
  }
}

export const createAuthService = (): AuthService => new MockAuthService();
