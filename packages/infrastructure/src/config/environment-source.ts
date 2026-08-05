import type { RuntimeEnvironmentSource } from '@core/app/types';

export const getRuntimeEnvironmentSource = (): RuntimeEnvironmentSource => {
  return {
    mode: import.meta.env.MODE,
    appName: import.meta.env.VITE_APP_NAME,
    appVersion: import.meta.env.VITE_APP_VERSION,
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
    logLevel: import.meta.env.VITE_LOG_LEVEL,
    featureFlags: import.meta.env.VITE_FEATURE_FLAGS,
  };
};
