import {
  DEFAULT_RETRY_ATTEMPTS,
  DEFAULT_RETRY_BACKOFF_MS,
  DEFAULT_TIMEOUT_MS,
} from '@core/app/constants';
import type {
  HttpClientContract,
  HttpRequestContract,
  HttpResponseContract,
} from '@core/di/contracts';
import { NetworkError, TimeoutError } from '@core/errors/error-classes';
import type { HttpInterceptors } from '@infrastructure/network/interceptors';
import { createRetryStrategy } from '@shared/network/retry-strategy';

export class FetchHttpClient implements HttpClientContract {
  constructor(
    private readonly baseUrl: string,
    private readonly interceptors: HttpInterceptors = {},
  ) {}

  async request<TResponse, TBody = unknown>(
    request: HttpRequestContract<TBody>,
  ): Promise<HttpResponseContract<TResponse>> {
    const preparedRequest = this.interceptors.onRequest?.(request) ?? request;

    const retry = createRetryStrategy({
      attempts: DEFAULT_RETRY_ATTEMPTS,
      backoffMs: DEFAULT_RETRY_BACKOFF_MS,
    });

    try {
      const result = await retry(async () => {
        const response = await this.executeRequest<TResponse, TBody>(preparedRequest);
        return this.interceptors.onResponse?.(response) ?? response;
      });

      return result as HttpResponseContract<TResponse>;
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
    }, DEFAULT_TIMEOUT_MS);

    try {
      const response = await fetch(`${this.baseUrl}${request.path}`, {
        method: request.method,
        headers: {
          'Content-Type': 'application/json',
          ...request.headers,
        },
        body: request.body ? JSON.stringify(request.body) : undefined,
        signal: controller.signal,
      });

      const data = (await response.json()) as TResponse;

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
