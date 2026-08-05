import { DI_TOKENS } from '@core/app/constants';
import type {
  CloudStorageContract,
  HttpClientContract,
  ServiceToken,
  SqliteAdapterContract,
  StorageAdapterContract,
} from '@core/di/contracts';
import { createServiceToken } from '@core/di/service-registry';
import type { RouteRegistry, RouterContract } from '@core/routing/router.types';

export interface AppConfigService {
  readonly appName: string;
  readonly appVersion: string;
  readonly environment: string;
}

export interface LoggerService {
  debug(message: string, metadata?: Record<string, unknown>): void;
  info(message: string, metadata?: Record<string, unknown>): void;
  warn(message: string, metadata?: Record<string, unknown>): void;
  error(message: string, metadata?: Record<string, unknown>): void;
}

export interface EventBusService {
  publish(event: { type: string; payload?: Record<string, unknown> }): void;
  subscribe(
    handler: (event: { type: string; payload?: Record<string, unknown> }) => void,
  ): () => void;
}

export const APP_CONFIG_TOKEN: ServiceToken<AppConfigService> =
  createServiceToken<AppConfigService>(DI_TOKENS.appConfig);
export const LOGGER_TOKEN: ServiceToken<LoggerService> = createServiceToken<LoggerService>(
  DI_TOKENS.logger,
);
export const EVENT_BUS_TOKEN: ServiceToken<EventBusService> = createServiceToken<EventBusService>(
  DI_TOKENS.eventBus,
);
export const ROUTER_TOKEN: ServiceToken<RouterContract> = createServiceToken<RouterContract>(
  DI_TOKENS.router,
);
export const ROUTE_REGISTRY_TOKEN: ServiceToken<RouteRegistry> = createServiceToken<RouteRegistry>(
  DI_TOKENS.routeRegistry,
);
export const HTTP_CLIENT_TOKEN: ServiceToken<HttpClientContract> =
  createServiceToken<HttpClientContract>(DI_TOKENS.httpClient);
export const LOCAL_STORAGE_TOKEN: ServiceToken<StorageAdapterContract> =
  createServiceToken<StorageAdapterContract>(DI_TOKENS.localStorage);
export const SECURE_STORAGE_TOKEN: ServiceToken<StorageAdapterContract> =
  createServiceToken<StorageAdapterContract>(DI_TOKENS.secureStorage);
export const SQLITE_ADAPTER_TOKEN: ServiceToken<SqliteAdapterContract> =
  createServiceToken<SqliteAdapterContract>(DI_TOKENS.sqliteAdapter);
export const CLOUD_STORAGE_TOKEN: ServiceToken<CloudStorageContract> =
  createServiceToken<CloudStorageContract>(DI_TOKENS.cloudStorage);
