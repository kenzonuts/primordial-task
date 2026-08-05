export interface EnvironmentConfig {
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
  rawEnvironment: string;
}

export const createEnvironmentConfig = (rawEnvironment: string): EnvironmentConfig => {
  const normalized =
    rawEnvironment === 'production'
      ? 'production'
      : rawEnvironment === 'test'
        ? 'test'
        : 'development';

  return {
    isDevelopment: normalized === 'development',
    isProduction: normalized === 'production',
    isTest: normalized === 'test',
    rawEnvironment,
  };
};
