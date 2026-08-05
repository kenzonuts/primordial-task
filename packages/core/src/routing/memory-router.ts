import type {
  RouteDescriptor,
  RouteRegistry,
  RouterContract,
  RouterState,
} from '@core/routing/router.types';

export class MemoryRouter implements RouterContract {
  private currentPath = '/';

  constructor(private readonly registry: RouteRegistry) {}

  navigate(path: string): void {
    this.currentPath = path;
  }

  back(): void {
    this.currentPath = '/';
  }

  currentRoute(): RouteDescriptor | null {
    return this.registry.get(this.currentPath);
  }

  getState(): RouterState {
    return {
      currentPath: this.currentPath,
      params: {},
    };
  }
}
