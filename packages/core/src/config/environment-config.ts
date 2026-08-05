import { normalizeEnvironment } from '@core/app/environment';
import type { AppEnvironment } from '@core/app/types';

export interface EnvironmentConfig {
  readonly environment: AppEnvironment;
  readonly isDevelopment: boolean;
  readonly isProduction: boolean;
  readonly isTest: boolean;
  readonly rawEnvironment: string;
}

export const createEnvironmentConfig = (rawEnvironment: string): EnvironmentConfig => {
  const normalized = normalizeEnvironment(rawEnvironment);

  return {
    environment: normalized,
    isDevelopment: normalized === 'development',
    isProduction: normalized === 'production',
    isTest: normalized === 'test',
    rawEnvironment,
  };
};
