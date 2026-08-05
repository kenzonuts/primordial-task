export interface RetryStrategyOptions {
  attempts: number;
  backoffMs: number;
}

export const createRetryStrategy = ({
  attempts,
  backoffMs,
}: RetryStrategyOptions): ((executor: () => Promise<unknown>) => Promise<unknown>) => {
  return async (executor: () => Promise<unknown>): Promise<unknown> => {
    for (let attempt = 1; attempt <= attempts; attempt += 1) {
      try {
        return await executor();
      } catch (error) {
        if (attempt === attempts) {
          throw error;
        }

        await new Promise((resolve) => {
          window.setTimeout(resolve, backoffMs * attempt);
        });
      }
    }

    throw new Error('Retry exhausted');
  };
};
