import { ServiceRegistry } from '@core/di/service-registry';
import {
  APP_CONFIG_TOKEN,
  CLOUD_STORAGE_TOKEN,
  EVENT_BUS_TOKEN,
  HTTP_CLIENT_TOKEN,
  LOCAL_STORAGE_TOKEN,
  LOGGER_TOKEN,
  ROUTER_TOKEN,
  ROUTE_REGISTRY_TOKEN,
  SECURE_STORAGE_TOKEN,
  SQLITE_ADAPTER_TOKEN,
} from '@core/di/tokens';
import { InMemoryEventBus } from '@core/events/event-bus';
import { createLogger } from '@core/logging/logger';
import { MemoryRouter } from '@core/routing/memory-router';

import type { RuntimeConfig } from '@infrastructure/config/runtime-config';
import { FetchHttpClient } from '@infrastructure/network/fetch-http-client';
import { createAppRouteRegistry } from '@infrastructure/routing/app-route-registry';
import { BrowserLocalStorageAdapter } from '@infrastructure/storage/browser-local-storage';
import { NoopCloudStorageAdapter } from '@infrastructure/storage/noop-cloud-storage';
import { NoopSecureStorageAdapter } from '@infrastructure/storage/noop-secure-storage';
import { NoopSqliteAdapter } from '@infrastructure/storage/noop-sqlite-adapter';

export const createInfrastructureContainer = (runtimeConfig: RuntimeConfig): ServiceRegistry => {
  const container = new ServiceRegistry();

  container.registerInstance(APP_CONFIG_TOKEN, {
    appName: runtimeConfig.config.application.appName,
    appVersion: runtimeConfig.config.application.appVersion,
    environment: runtimeConfig.runtime.environment,
  });

  container.registerInstance(
    LOGGER_TOKEN,
    createLogger(runtimeConfig.runtime.environment, runtimeConfig.logLevel),
  );

  container.registerInstance(EVENT_BUS_TOKEN, new InMemoryEventBus());

  const routeRegistry = createAppRouteRegistry();
  container.registerInstance(ROUTE_REGISTRY_TOKEN, routeRegistry);
  container.registerInstance(ROUTER_TOKEN, new MemoryRouter(routeRegistry));

  container.registerInstance(
    HTTP_CLIENT_TOKEN,
    new FetchHttpClient(runtimeConfig.config.api.baseUrl),
  );

  container.registerInstance(
    LOCAL_STORAGE_TOKEN,
    new BrowserLocalStorageAdapter(runtimeConfig.config.storage.localStoragePrefix),
  );

  container.registerInstance(SECURE_STORAGE_TOKEN, new NoopSecureStorageAdapter());
  container.registerInstance(SQLITE_ADAPTER_TOKEN, new NoopSqliteAdapter());
  container.registerInstance(CLOUD_STORAGE_TOKEN, new NoopCloudStorageAdapter());

  return container;
};
