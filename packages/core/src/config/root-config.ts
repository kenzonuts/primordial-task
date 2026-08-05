import type { AppRuntimeContext } from '@core/app/types';
import type { ApiConfig } from '@core/config/api-config';
import { createApiConfig } from '@core/config/api-config';
import type { ApplicationConfig } from '@core/config/application-config';
import { createApplicationConfig } from '@core/config/application-config';
import type { EnvironmentConfig } from '@core/config/environment-config';
import { createEnvironmentConfig } from '@core/config/environment-config';
import type { FeatureFlagConfig } from '@core/config/feature-flag-config';
import { createFeatureFlagConfig } from '@core/config/feature-flag-config';
import type { StorageConfig } from '@core/config/storage-config';
import { createStorageConfig } from '@core/config/storage-config';

export interface RootConfig {
  readonly application: ApplicationConfig;
  readonly environment: EnvironmentConfig;
  readonly api: ApiConfig;
  readonly storage: StorageConfig;
  readonly featureFlags: FeatureFlagConfig;
}

export const createRootConfig = (
  runtime: AppRuntimeContext,
  options: {
    apiBaseUrl: string;
    featureFlags?: string;
  },
): RootConfig => {
  return {
    application: createApplicationConfig(runtime.environment),
    environment: createEnvironmentConfig(runtime.environment),
    api: createApiConfig(options.apiBaseUrl),
    storage: createStorageConfig(),
    featureFlags: createFeatureFlagConfig(options.featureFlags),
  };
};
