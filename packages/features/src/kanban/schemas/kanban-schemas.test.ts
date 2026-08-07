import { describe, expect, it } from 'vitest';

import {
  createBoardSchema,
  createColumnSchema,
  renameColumnSchema,
  updateBoardSchema,
} from '@features/kanban/schemas/kanban-schemas';

describe('kanban validation schemas', () => {
  it('validates create board payloads', () => {
    const parsed = createBoardSchema.parse({
      projectId: 'proj-core',
      name: 'Delivery Board',
      description: 'Primary execution board',
      templateId: 'software_delivery',
    });

    expect(parsed.name).toBe('Delivery Board');
    expect(parsed.projectId).toBe('proj-core');
    expect(parsed.templateId).toBe('software_delivery');
  });

  it('requires templateId', () => {
    const result = createBoardSchema.safeParse({
      projectId: 'proj-design',
      name: 'Design Board',
    });

    expect(result.success).toBe(false);
  });

  it('requires a project and board name', () => {
    const result = createBoardSchema.safeParse({
      projectId: '',
      name: '   ',
    });

    expect(result.success).toBe(false);
  });

  it('rejects overly long board names', () => {
    const result = createBoardSchema.safeParse({
      projectId: 'proj-core',
      name: 'x'.repeat(81),
    });

    expect(result.success).toBe(false);
  });

  it('allows partial board updates', () => {
    const parsed = updateBoardSchema.parse({
      name: 'Renamed board',
    });

    expect(parsed.name).toBe('Renamed board');
  });

  it('validates create column payloads', () => {
    const parsed = createColumnSchema.parse({
      name: 'Ready',
      mappedStatus: 'todo',
      description: 'Ready for pickup',
      wipLimit: 5,
    });

    expect(parsed.name).toBe('Ready');
    expect(parsed.mappedStatus).toBe('todo');
    expect(parsed.wipLimit).toBe(5);
  });

  it('validates rename column payloads', () => {
    const parsed = renameColumnSchema.parse({ name: 'In Review' });
    expect(parsed.name).toBe('In Review');
  });
});
