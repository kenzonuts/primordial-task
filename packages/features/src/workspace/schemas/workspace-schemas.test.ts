import { describe, expect, it } from 'vitest';

import {
  createWorkspaceSchema,
  inviteMemberSchema,
  slugifyWorkspaceName,
  updateWorkspaceSchema,
} from '@features/workspace/schemas/workspace-schemas';

describe('workspace validation schemas', () => {
  it('validates create workspace payloads', () => {
    const parsed = createWorkspaceSchema.parse({
      name: 'Primordial Studio',
      slug: 'primordial-studio',
      description: 'Product workspace',
      color: '#60A5FA',
      logoUrl: '',
      visibility: 'team',
    });

    expect(parsed.name).toBe('Primordial Studio');
    expect(parsed.visibility).toBe('team');
  });

  it('rejects invalid slugs', () => {
    const result = createWorkspaceSchema.safeParse({
      name: 'Bad',
      slug: 'Bad Slug!',
      description: '',
      color: '#E6E6E6',
      logoUrl: '',
      visibility: 'private',
    });

    expect(result.success).toBe(false);
  });

  it('allows partial updates', () => {
    const parsed = updateWorkspaceSchema.parse({
      name: 'Renamed',
    });

    expect(parsed.name).toBe('Renamed');
  });

  it('validates invite member payloads', () => {
    const parsed = inviteMemberSchema.parse({
      email: 'alex@primordial.dev',
      role: 'member',
    });

    expect(parsed.email).toBe('alex@primordial.dev');
  });

  it('slugifies workspace names', () => {
    expect(slugifyWorkspaceName('Primordial Studio!')).toBe('primordial-studio');
  });
});
