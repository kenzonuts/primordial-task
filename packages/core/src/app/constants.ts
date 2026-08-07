export const APP_NAME = 'Primordial Task';
export const APP_VERSION = '0.1.0';
export const DEFAULT_TIMEOUT_MS = 10_000;
export const DEFAULT_RETRY_ATTEMPTS = 2;
export const DEFAULT_RETRY_BACKOFF_MS = 300;
export const DEFAULT_LOG_LEVEL = 'info';

export const APP_ENVIRONMENTS = {
  development: 'development',
  test: 'test',
  production: 'production',
} as const;

export const DI_TOKENS = {
  rootConfig: 'root-config',
  logger: 'logger',
  eventBus: 'event-bus',
  router: 'router',
  routeRegistry: 'route-registry',
  httpClient: 'http-client',
  localStorage: 'local-storage',
  secureStorage: 'secure-storage',
  sqliteAdapter: 'sqlite-adapter',
  cloudStorage: 'cloud-storage',
} as const;

export const ROUTES = {
  root: '/',
} as const;
