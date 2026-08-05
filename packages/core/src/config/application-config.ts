export interface ApplicationConfig {
  appName: string;
  appVersion: string;
  environment: 'development' | 'production' | 'test';
}

export const createApplicationConfig = (
  environment: 'development' | 'production' | 'test',
): ApplicationConfig => ({
  appName: 'Primordial Task',
  appVersion: '0.1.0',
  environment,
});
