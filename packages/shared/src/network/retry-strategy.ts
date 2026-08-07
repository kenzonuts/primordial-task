import { createRetryStrategy as createCoreRetryStrategy } from '@core/network/retry-strategy';
import type { RetryStrategyOptions } from '@core/network/retry-strategy';

export type { RetryStrategyOptions } from '@core/network/retry-strategy';

/** Shared re-export of the core retry foundation for non-infra consumers. */
export const createRetryStrategy = (
  options: RetryStrategyOptions,
): ((executor: () => Promise<unknown>) => Promise<unknown>) => {
  return createCoreRetryStrategy<unknown>(options);
};
