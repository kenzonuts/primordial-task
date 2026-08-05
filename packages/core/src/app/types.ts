export type AppEnvironment = 'development' | 'test' | 'production';

export interface AppMetadata {
  name: string;
  version: string;
  environment: AppEnvironment;
}

export interface FeatureFlagState {
  enabled: boolean;
  source: 'default' | 'remote' | 'local';
}

export interface AppRuntimeContext {
  appName: string;
  environment: AppEnvironment;
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
}
