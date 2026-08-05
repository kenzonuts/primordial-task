export interface RequestOptions {
  readonly timeoutMs: number;
  readonly retries: number;
  readonly retryBackoffMs: number;
}

export interface ResponseWrapper<TData> {
  readonly data: TData;
  readonly status: number;
  readonly headers: Record<string, string>;
}
