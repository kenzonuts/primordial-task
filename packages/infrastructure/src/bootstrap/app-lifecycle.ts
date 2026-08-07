import type { ServiceRegistry } from '@core/di/service-registry';
import {
  EVENT_BUS_TOKEN,
  LOGGER_TOKEN,
  ROOT_CONFIG_TOKEN,
  SQLITE_ADAPTER_TOKEN,
} from '@core/di/tokens';
import { getErrorCode } from '@core/errors/error-utils';

import {
  createBootstrapCompletedEvent,
  createBootstrapFailedEvent,
  createBootstrapStartedEvent,
} from '@infrastructure/events/app-events';

export interface AppLifecycle {
  start(): Promise<void>;
}

export const createAppLifecycle = (
  container: ServiceRegistry,
  environment: string,
): AppLifecycle => {
  return {
    start: async (): Promise<void> => {
      const startedAt = Date.now();
      const logger = container.resolve(LOGGER_TOKEN);
      const eventBus = container.resolve(EVENT_BUS_TOKEN);
      const sqlite = container.resolve(SQLITE_ADAPTER_TOKEN);
      const rootConfig = container.resolve(ROOT_CONFIG_TOKEN);

      try {
        logger.info('Application bootstrap started', { environment });
        eventBus.publish(createBootstrapStartedEvent(environment));
        await sqlite.connect(rootConfig.storage.sqliteDatabaseName);
        eventBus.publish(createBootstrapCompletedEvent(Date.now() - startedAt));
        logger.info('Application bootstrap completed', {
          durationMs: Date.now() - startedAt,
        });
      } catch (error) {
        const code = getErrorCode(error);
        logger.error('Application bootstrap failed', {
          errorCode: code,
        });
        eventBus.publish(createBootstrapFailedEvent(code));
        throw error;
      }
    },
  };
};
