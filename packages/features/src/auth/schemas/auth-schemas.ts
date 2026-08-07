import { z } from 'zod';

export const emailSchema = z
  .string()
  .trim()
  .min(1, 'Enter your email.')
  .email('Enter a valid email address.');

export const passwordSchema = z
  .string()
  .min(1, 'Enter your password.')
  .min(8, 'Use at least 8 characters.');

export const confirmPasswordSchema = z.string().min(1, 'Confirm your password.');

export const fullNameSchema = z
  .string()
  .trim()
  .min(1, 'Enter your full name.')
  .min(2, 'Enter at least 2 characters.');

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Enter your password.'),
  rememberMe: z.boolean(),
});

export const registerSchema = z
  .object({
    fullName: fullNameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
    acceptTerms: z.boolean(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })
  .refine((values) => values.acceptTerms, {
    message: 'Accept the terms to create an account.',
    path: ['acceptTerms'],
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const verificationCodeSchema = z.object({
  code: z
    .string()
    .trim()
    .length(6, 'Enter the 6-digit verification code.')
    .regex(/^\d{6}$/, 'Enter a valid verification code.'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type VerificationCodeFormValues = z.infer<typeof verificationCodeSchema>;

export type PasswordStrength = 'empty' | 'weak' | 'acceptable' | 'strong';

export const evaluatePasswordStrength = (password: string): PasswordStrength => {
  if (!password) {
    return 'empty';
  }

  if (password.length < 8) {
    return 'weak';
  }

  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  const variety = [hasLetter, hasNumber, hasSymbol].filter(Boolean).length;

  if (password.length >= 12 && variety === 3) {
    return 'strong';
  }

  if (variety >= 2) {
    return 'acceptable';
  }

  return 'weak';
};
