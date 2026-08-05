export interface RouteDescriptor {
  path: string;
  name: string;
  lazy?: boolean;
}

export interface RouterContract {
  navigate(path: string): void;
  currentRoute(): RouteDescriptor | null;
}
