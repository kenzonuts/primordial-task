export { AUTH_ROUTES } from '@features/auth/types';
export type {
  AuthCheckPhase,
  AuthResult,
  AuthRoutePath,
  AuthSession,
  AuthStatus,
  AuthUser,
  AuthWorkspace,
  LoginCredentials,
  OAuthProvider,
  RegisterCredentials,
} from '@features/auth/types';

export {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  verificationCodeSchema,
  evaluatePasswordStrength,
} from '@features/auth/schemas/auth-schemas';
export type {
  LoginFormValues,
  RegisterFormValues,
  ForgotPasswordFormValues,
  VerificationCodeFormValues,
  PasswordStrength,
} from '@features/auth/schemas/auth-schemas';

export { useAuthStore } from '@features/auth/store/auth-store';

export { AuthRouter } from '@features/auth/routes/auth-routes';
export { ProtectedRoute, GuestRoute } from '@features/auth/guards';

export {
  SplashScreen,
  AuthCheckScreen,
  WelcomeScreen,
  LoginScreen,
  RegisterScreen,
  ForgotPasswordScreen,
  VerifyEmailScreen,
  WorkspaceSelectionScreen,
  SessionExpiredScreen,
  DashboardPlaceholderScreen,
} from '@features/auth/screens';

export { resolvePostAuthPath, getUserInitials } from '@features/auth/lib/post-auth-navigation';
