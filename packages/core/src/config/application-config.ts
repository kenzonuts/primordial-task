import { APP_NAME, APP_VERSION } from '@core/app/constants';
import type { AppEnvironment } from '@core/app/types';

export interface ApplicationConfig {
  readonly appName: string;
  readonly appVersion: string;
  readonly environment: AppEnvironment;
}

export const createApplicationConfig = (environment: AppEnvironment): ApplicationConfig => {
  return {
    appName: APP_NAME,
    appVersion: APP_VERSION,
    environment,
  };
};
