import { DEFAULT_RETRY_BACKOFF_MS } from '@core/app/constants';
import type { ApiConfig } from '@core/config/api-config';
import type {
  HttpClientContract,
  HttpRequestContract,
  HttpResponseContract,
} from '@core/di/contracts';
import { NetworkError, TimeoutError } from '@core/errors/error-classes';
import { createRetryStrategy } from '@core/network/retry-strategy';
import type { HttpInterceptors } from '@infrastructure/network/interceptors';

export class FetchHttpClient implements HttpClientContract {
  constructor(
    private readonly apiConfig: ApiConfig,
    private readonly interceptors: HttpInterceptors = {},
  ) {}

  async request<TResponse, TBody = unknown>(
    request: HttpRequestContract<TBody>,
  ): Promise<HttpResponseContract<TResponse>> {
    const preparedRequest = this.interceptors.onRequest?.(request) ?? request;

    const retry = createRetryStrategy<HttpResponseContract<TResponse>>({
      attempts: this.apiConfig.retryAttempts,
      backoffMs: DEFAULT_RETRY_BACKOFF_MS,
    });

    try {
      return await retry(async () => {
        const response = await this.executeRequest<TResponse, TBody>(preparedRequest);
        return this.interceptors.onResponse?.(response) ?? response;
      });
    } catch (error) {
      const handled = this.interceptors.onError?.(error) ?? error;

      if (handled instanceof Error) {
        throw handled;
      }

      throw new NetworkError('Network request failed', {
        message: 'Network request failed',
        cause: handled,
      });
    }
  }

  private async executeRequest<TResponse, TBody>(
    request: HttpRequestContract<TBody>,
  ): Promise<HttpResponseContract<TResponse>> {
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
    }, this.apiConfig.timeoutMs);

    try {
      const response = await fetch(`${this.apiConfig.baseUrl}${request.path}`, {
        method: request.method,
        headers: {
          'Content-Type': 'application/json',
          ...request.headers,
        },
        body: request.body ? JSON.stringify(request.body) : undefined,
        signal: controller.signal,
      });

      const text = await response.text();
      const data = text.length > 0 ? (JSON.parse(text) as TResponse) : (null as TResponse);

      return {
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        data,
      };
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new TimeoutError('Network request timed out', {
          message: 'Network request timed out',
          cause: error,
        });
      }

      throw new NetworkError('Network request failed', {
        message: 'Network request failed',
        cause: error,
      });
    } finally {
      clearTimeout(timeout);
    }
  }
}
