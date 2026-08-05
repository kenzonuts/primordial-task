import type { RouteDescriptor, RouteRegistry } from '@core/routing/router.types';

export class InMemoryRouteRegistry implements RouteRegistry {
  private readonly routes = new Map<string, RouteDescriptor>();

  register(route: RouteDescriptor): void {
    this.routes.set(route.path, route);
  }

  get(path: string): RouteDescriptor | null {
    return this.routes.get(path) ?? null;
  }

  list(): RouteDescriptor[] {
    return Array.from(this.routes.values());
  }
}
