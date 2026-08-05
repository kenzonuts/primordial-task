import { APP_ENVIRONMENTS, APP_NAME, APP_VERSION } from '@core/app/constants';
import type { AppEnvironment, AppRuntimeContext, RuntimeEnvironmentSource } from '@core/app/types';

export const normalizeEnvironment = (value?: string): AppEnvironment => {
  if (!value) {
    return APP_ENVIRONMENTS.development;
  }

  if (value === APP_ENVIRONMENTS.production) {
    return APP_ENVIRONMENTS.production;
  }

  if (value === APP_ENVIRONMENTS.test) {
    return APP_ENVIRONMENTS.test;
  }

  return APP_ENVIRONMENTS.development;
};

export const createAppRuntimeContext = (source: RuntimeEnvironmentSource): AppRuntimeContext => {
  const environment = normalizeEnvironment(source.mode);

  return {
    appName: source.appName ?? APP_NAME,
    appVersion: source.appVersion ?? APP_VERSION,
    environment,
    isDevelopment: environment === APP_ENVIRONMENTS.development,
    isProduction: environment === APP_ENVIRONMENTS.production,
    isTest: environment === APP_ENVIRONMENTS.test,
  };
};
