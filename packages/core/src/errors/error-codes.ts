export const APP_ERROR_CODES = {
  unknown: 'UNKNOWN_ERROR',
  configuration: 'CONFIGURATION_ERROR',
  dependency: 'DEPENDENCY_ERROR',
  storage: 'STORAGE_ERROR',
  network: 'NETWORK_ERROR',
  validation: 'VALIDATION_ERROR',
} as const;

export type AppErrorCode = (typeof APP_ERROR_CODES)[keyof typeof APP_ERROR_CODES];
