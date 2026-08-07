import { describe, expect, it } from 'vitest';

import { MemoryRouter } from '@core/routing/memory-router';
import { InMemoryRouteRegistry } from '@core/routing/route-registry';

describe('MemoryRouter', () => {
  it('tracks navigation history and supports back', () => {
    const registry = new InMemoryRouteRegistry();
    registry.register({ id: 'root', path: '/', title: 'Root' });
    registry.register({ id: 'settings', path: '/settings', title: 'Settings' });

    const router = new MemoryRouter(registry);
    router.navigate('/settings?tab=general');

    expect(router.getState()).toEqual({
      currentPath: '/settings',
      params: { tab: 'general' },
    });
    expect(router.currentRoute()?.id).toBe('settings');

    router.back();

    expect(router.getState().currentPath).toBe('/');
  });
});
