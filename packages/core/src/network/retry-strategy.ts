export interface RetryStrategyOptions {
  readonly attempts: number;
  readonly backoffMs: number;
}

export type RetryExecutor<TValue> = () => Promise<TValue>;

export const createRetryStrategy = <TValue>({
  attempts,
  backoffMs,
}: RetryStrategyOptions): ((executor: RetryExecutor<TValue>) => Promise<TValue>) => {
  return async (executor: RetryExecutor<TValue>): Promise<TValue> => {
    for (let attempt = 1; attempt <= attempts; attempt += 1) {
      try {
        return await executor();
      } catch (error) {
        if (attempt === attempts) {
          throw error;
        }

        await new Promise((resolve) => {
          globalThis.setTimeout(resolve, backoffMs * attempt);
        });
      }
    }

    throw new Error('Retry exhausted');
  };
};
