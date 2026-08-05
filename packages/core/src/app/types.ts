export type AppEnvironment = 'development' | 'test' | 'production';

export interface AppMetadata {
  name: string;
  version: string;
  environment: AppEnvironment;
}

export interface RuntimeEnvironmentSource {
  readonly mode?: string;
  readonly appName?: string;
  readonly appVersion?: string;
  readonly apiBaseUrl?: string;
  readonly logLevel?: string;
  readonly featureFlags?: string;
}

export interface FeatureFlagState {
  enabled: boolean;
  source: 'default' | 'remote' | 'local';
}

export interface AppRuntimeContext {
  readonly appName: string;
  readonly appVersion: string;
  readonly environment: AppEnvironment;
  readonly isDevelopment: boolean;
  readonly isProduction: boolean;
  readonly isTest: boolean;
}

export type BootstrapStage = 'idle' | 'initializing' | 'ready' | 'failed';

export interface BootstrapState {
  readonly stage: BootstrapStage;
  readonly startedAt: number;
  readonly finishedAt?: number;
  readonly error?: Error;
}
