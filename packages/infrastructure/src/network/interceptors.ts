import type { HttpRequestContract, HttpResponseContract } from '@core/di/contracts';

export interface HttpInterceptors {
  readonly onRequest?: <TBody>(request: HttpRequestContract<TBody>) => HttpRequestContract<TBody>;
  readonly onResponse?: <TData>(
    response: HttpResponseContract<TData>,
  ) => HttpResponseContract<TData>;
  readonly onError?: (error: unknown) => unknown;
}
