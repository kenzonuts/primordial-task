import { describe, expect, it } from 'vitest';

import {
  evaluatePasswordStrength,
  loginSchema,
  registerSchema,
} from '@features/auth/schemas/auth-schemas';

describe('auth validation schemas', () => {
  it('validates login credentials', () => {
    const parsed = loginSchema.parse({
      email: 'dev@primordial.dev',
      password: 'secret-pass',
      rememberMe: true,
    });

    expect(parsed.email).toBe('dev@primordial.dev');
    expect(parsed.rememberMe).toBe(true);
  });

  it('rejects weak registration payloads', () => {
    const result = registerSchema.safeParse({
      fullName: 'A',
      email: 'bad',
      password: 'short',
      confirmPassword: 'different',
      acceptTerms: false,
    });

    expect(result.success).toBe(false);
  });

  it('evaluates password strength', () => {
    expect(evaluatePasswordStrength('')).toBe('empty');
    expect(evaluatePasswordStrength('abcdefg')).toBe('weak');
    expect(evaluatePasswordStrength('abcdefg1')).toBe('acceptable');
    expect(evaluatePasswordStrength('Abcdefghijk1!')).toBe('strong');
  });
});
