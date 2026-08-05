import { DEFAULT_LOG_LEVEL } from '@core/app/constants';
import { createAppRuntimeContext } from '@core/app/environment';
import type { AppRuntimeContext } from '@core/app/types';
import type { RuntimeEnvironmentSource } from '@core/app/types';
import type { RootConfig } from '@core/config/root-config';
import { createRootConfig } from '@core/config/root-config';
import type { LogLevel } from '@core/logging/logger.types';

import { getRuntimeEnvironmentSource } from '@infrastructure/config/environment-source';

export interface RuntimeConfig {
  readonly runtime: AppRuntimeContext;
  readonly config: RootConfig;
  readonly logLevel: LogLevel;
}

const toLogLevel = (value?: string): LogLevel => {
  if (value === 'debug' || value === 'warn' || value === 'error' || value === 'info') {
    return value;
  }

  return DEFAULT_LOG_LEVEL as LogLevel;
};

export const createRuntimeConfig = (source?: RuntimeEnvironmentSource): RuntimeConfig => {
  const resolvedSource = source ?? getRuntimeEnvironmentSource();
  const runtime = createAppRuntimeContext(resolvedSource);

  return {
    runtime,
    config: createRootConfig(runtime, {
      apiBaseUrl: resolvedSource.apiBaseUrl ?? '',
      featureFlags: resolvedSource.featureFlags,
    }),
    logLevel: toLogLevel(resolvedSource.logLevel),
  };
};
