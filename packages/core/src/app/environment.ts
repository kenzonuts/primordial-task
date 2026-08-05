import type { AppEnvironment, AppRuntimeContext } from './types';

export const normalizeEnvironment = (value: string): AppEnvironment => {
  if (value === 'production') {
    return 'production';
  }

  if (value === 'test') {
    return 'test';
  }

  return 'development';
};

export const createAppRuntimeContext = (environment: string): AppRuntimeContext => {
  const normalizedEnvironment = normalizeEnvironment(environment);

  return {
    appName: 'Primordial Task',
    environment: normalizedEnvironment,
    isDevelopment: normalizedEnvironment === 'development',
    isProduction: normalizedEnvironment === 'production',
    isTest: normalizedEnvironment === 'test',
  };
};
