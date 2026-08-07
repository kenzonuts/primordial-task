import type { RuntimeEnvironmentSource } from '@core/app/types';

export const getRuntimeEnvironmentSource = (): RuntimeEnvironmentSource => {
  const viteEnv = import.meta.env;

  return {
    mode: viteEnv.VITE_APP_ENV ?? viteEnv.MODE,
    appName: viteEnv.VITE_APP_NAME,
    appVersion: viteEnv.VITE_APP_VERSION,
    apiBaseUrl: viteEnv.VITE_API_BASE_URL,
    logLevel: viteEnv.VITE_LOG_LEVEL,
    featureFlags: viteEnv.VITE_FEATURE_FLAGS,
  };
};
