import { describe, expect, it } from 'vitest';

import { createServiceToken, ServiceRegistry } from '@core/di/service-registry';
import { DependencyError } from '@core/errors/error-classes';

describe('ServiceRegistry', () => {
  it('resolves registered instances', () => {
    const registry = new ServiceRegistry();
    const token = createServiceToken<{ value: number }>('demo');

    registry.registerInstance(token, { value: 42 });

    expect(registry.resolve(token)).toEqual({ value: 42 });
    expect(registry.has(token)).toBe(true);
  });

  it('caches factory results as singletons', () => {
    const registry = new ServiceRegistry();
    const token = createServiceToken<{ id: string }>('factory-demo');
    let calls = 0;

    registry.registerFactory(token, () => {
      calls += 1;
      return { id: `created-${calls}` };
    });

    const first = registry.resolve(token);
    const second = registry.resolve(token);

    expect(first).toBe(second);
    expect(calls).toBe(1);
  });

  it('throws DependencyError for missing services', () => {
    const registry = new ServiceRegistry();
    const token = createServiceToken<string>('missing');

    expect(() => registry.resolve(token)).toThrow(DependencyError);
  });
});
