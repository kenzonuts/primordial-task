export interface ApiConfig {
  baseUrl: string;
  timeoutMs: number;
  retryAttempts: number;
}

export const createApiConfig = (baseUrl: string): ApiConfig => ({
  baseUrl,
  timeoutMs: 10_000,
  retryAttempts: 2,
});
