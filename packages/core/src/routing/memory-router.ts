import type {
  RouteDescriptor,
  RouteRegistry,
  RouterContract,
  RouterState,
} from '@core/routing/router.types';

const parsePath = (path: string): { pathname: string; params: Record<string, string> } => {
  const [pathname = '/', search = ''] = path.split('?');
  const params = Object.fromEntries(new URLSearchParams(search));

  return {
    pathname,
    params,
  };
};

export class MemoryRouter implements RouterContract {
  private history: string[] = ['/'];

  constructor(private readonly registry: RouteRegistry) {}

  navigate(path: string): void {
    this.history.push(path);
  }

  back(): void {
    if (this.history.length <= 1) {
      return;
    }

    this.history.pop();
  }

  currentRoute(): RouteDescriptor | null {
    const { pathname } = parsePath(this.currentPath);
    return this.registry.get(pathname);
  }

  getState(): RouterState {
    const { pathname, params } = parsePath(this.currentPath);

    return {
      currentPath: pathname,
      params,
    };
  }

  private get currentPath(): string {
    return this.history[this.history.length - 1] ?? '/';
  }
}
