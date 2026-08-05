export interface RouteDescriptor {
  readonly id: string;
  readonly path: string;
  readonly title: string;
  readonly lazy?: boolean;
}

export interface RouterState {
  readonly currentPath: string;
  readonly params: Record<string, string>;
}

export interface RouterContract {
  navigate(path: string): void;
  back(): void;
  currentRoute(): RouteDescriptor | null;
  getState(): RouterState;
}

export interface RouteRegistry {
  register(route: RouteDescriptor): void;
  get(path: string): RouteDescriptor | null;
  list(): RouteDescriptor[];
}
