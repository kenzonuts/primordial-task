import { APP_NAME, APP_VERSION } from '@core/app/constants';
import type { AppEnvironment } from '@core/app/types';

export interface ApplicationConfig {
  readonly appName: string;
  readonly appVersion: string;
  readonly environment: AppEnvironment;
}

export const createApplicationConfig = (
  environment: AppEnvironment,
  overrides?: Partial<Pick<ApplicationConfig, 'appName' | 'appVersion'>>,
): ApplicationConfig => {
  return {
    appName: overrides?.appName ?? APP_NAME,
    appVersion: overrides?.appVersion ?? APP_VERSION,
    environment,
  };
};
