import { describe, expect, it } from 'vitest';

import {
  createProjectSchema,
  slugifyProjectName,
  updateProjectSchema,
} from '@features/project/schemas/project-schemas';

describe('project validation schemas', () => {
  it('validates create project payloads', () => {
    const parsed = createProjectSchema.parse({
      name: 'Primordial Core',
      slug: 'primordial-core',
      description: 'Foundation work',
      icon: 'Layers',
      coverUrl: '',
      color: '#E6E6E6',
      status: 'active',
      visibility: 'workspace',
    });

    expect(parsed.name).toBe('Primordial Core');
    expect(parsed.status).toBe('active');
    expect(parsed.visibility).toBe('workspace');
  });

  it('rejects invalid slugs', () => {
    const result = createProjectSchema.safeParse({
      name: 'Bad',
      slug: 'Bad Slug!',
      description: '',
      icon: '',
      coverUrl: '',
      color: '#E6E6E6',
      status: 'planning',
      visibility: 'private',
    });

    expect(result.success).toBe(false);
  });

  it('allows partial updates', () => {
    const parsed = updateProjectSchema.parse({
      name: 'Renamed',
    });

    expect(parsed.name).toBe('Renamed');
  });

  it('slugifies project names', () => {
    expect(slugifyProjectName('Primordial Core!')).toBe('primordial-core');
  });
});
