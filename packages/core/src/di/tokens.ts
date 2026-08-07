import { DI_TOKENS } from '@core/app/constants';
import type { RootConfig } from '@core/config/root-config';
import type {
  CloudStorageContract,
  HttpClientContract,
  ServiceToken,
  SqliteAdapterContract,
  StorageAdapterContract,
} from '@core/di/contracts';
import { createServiceToken } from '@core/di/service-registry';
import type { ApplicationEvent, EventBus } from '@core/events/event-bus';
import type { Logger } from '@core/logging/logger.types';
import type { RouteRegistry, RouterContract } from '@core/routing/router.types';

export const ROOT_CONFIG_TOKEN: ServiceToken<RootConfig> = createServiceToken<RootConfig>(
  DI_TOKENS.rootConfig,
);
export const LOGGER_TOKEN: ServiceToken<Logger> = createServiceToken<Logger>(DI_TOKENS.logger);
export const EVENT_BUS_TOKEN: ServiceToken<EventBus<ApplicationEvent>> = createServiceToken<
  EventBus<ApplicationEvent>
>(DI_TOKENS.eventBus);
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
