import { DEFAULT_RETRY_ATTEMPTS, DEFAULT_TIMEOUT_MS } from '@core/app/constants';

export interface ApiConfig {
  readonly baseUrl: string;
  readonly timeoutMs: number;
  readonly retryAttempts: number;
}

export const createApiConfig = (baseUrl: string): ApiConfig => ({
  baseUrl,
  timeoutMs: DEFAULT_TIMEOUT_MS,
  retryAttempts: DEFAULT_RETRY_ATTEMPTS,
});
