export const AUTH_ROUTES = {
  splash: '/',
  authCheck: '/auth-check',
  welcome: '/welcome',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  verifyEmail: '/verify-email',
  workspaces: '/select-workspace',
  dashboard: '/dashboard',
  sessionExpired: '/session-expired',
} as const;

export type AuthRoutePath = (typeof AUTH_ROUTES)[keyof typeof AUTH_ROUTES];

export type AuthStatus =
  'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'session_restoring' | 'error';

export type AuthCheckPhase = 'checking' | 'refreshing' | 'expired' | 'failed' | 'ready';

export type OAuthProvider = 'google' | 'github';

export interface AuthUser {
  readonly id: string;
  readonly email: string;
  readonly fullName: string;
  readonly avatarUrl?: string;
  readonly emailVerified: boolean;
}

export interface AuthSession {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly expiresAt: number;
  readonly rememberMe: boolean;
}

export interface AuthWorkspace {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly memberCount: number;
  readonly lastActivityAt: number;
  readonly initials: string;
  readonly unavailable?: boolean;
}

export interface LoginCredentials {
  readonly email: string;
  readonly password: string;
  readonly rememberMe: boolean;
}

export interface RegisterCredentials {
  readonly fullName: string;
  readonly email: string;
  readonly password: string;
  readonly acceptTerms: boolean;
}

export interface AuthResult {
  readonly user: AuthUser;
  readonly session: AuthSession;
  readonly workspaces: AuthWorkspace[];
  readonly requiresEmailVerification: boolean;
}

export interface AuthService {
  restoreSession(): Promise<AuthResult | null>;
  refreshSession(): Promise<AuthResult | null>;
  login(credentials: LoginCredentials): Promise<AuthResult>;
  register(credentials: RegisterCredentials): Promise<AuthResult>;
  requestPasswordReset(email: string): Promise<void>;
  verifyEmail(code: string): Promise<AuthResult>;
  resendVerificationCode(): Promise<void>;
  listWorkspaces(): Promise<AuthWorkspace[]>;
  selectWorkspace(workspaceId: string): Promise<void>;
  logout(): Promise<void>;
  startOAuth(provider: OAuthProvider): Promise<AuthResult>;
}
