import { describe, expect, it } from 'vitest';

import {
  createTaskSchema,
  quickCreateTaskSchema,
  updateTaskSchema,
} from '@features/task/schemas/task-schemas';

describe('task validation schemas', () => {
  it('validates create task payloads', () => {
    const parsed = createTaskSchema.parse({
      projectId: 'proj-core',
      title: 'Ship auth flow',
      description: 'Complete login and session restore.',
      status: 'todo',
      priority: 'high',
      type: 'feature',
      assigneeId: 'user-local',
      startDate: null,
      dueDate: null,
      estimatedMinutes: 120,
      labels: [],
      tags: ['auth'],
    });

    expect(parsed.title).toBe('Ship auth flow');
    expect(parsed.projectId).toBe('proj-core');
    expect(parsed.status).toBe('todo');
    expect(parsed.priority).toBe('high');
  });

  it('requires status, priority, and type', () => {
    const result = createTaskSchema.safeParse({
      projectId: 'proj-design',
      title: 'Minimal task',
    });

    expect(result.success).toBe(false);
  });

  it('rejects empty titles', () => {
    const result = createTaskSchema.safeParse({
      projectId: 'proj-core',
      title: '   ',
    });

    expect(result.success).toBe(false);
  });

  it('rejects due dates before start dates', () => {
    const result = createTaskSchema.safeParse({
      projectId: 'proj-core',
      title: 'Date mismatch',
      startDate: 2_000,
      dueDate: 1_000,
    });

    expect(result.success).toBe(false);
  });

  it('allows partial updates', () => {
    const parsed = updateTaskSchema.parse({
      title: 'Renamed task',
      priority: 'critical',
    });

    expect(parsed.title).toBe('Renamed task');
    expect(parsed.priority).toBe('critical');
  });

  it('validates quick create payloads', () => {
    const parsed = quickCreateTaskSchema.parse({
      title: 'Quick note',
      projectId: 'proj-ai',
    });

    expect(parsed.title).toBe('Quick note');
    expect(parsed.projectId).toBe('proj-ai');
  });
});
