import { describe, expect, it, vi } from 'vitest';

import { createRetryStrategy } from '@core/network/retry-strategy';

describe('createRetryStrategy', () => {
  it('retries failed executors until success', async () => {
    vi.useFakeTimers();
    const strategy = createRetryStrategy<string>({ attempts: 3, backoffMs: 10 });
    let calls = 0;

    const promise = strategy(async () => {
      calls += 1;
      if (calls < 3) {
        throw new Error('fail');
      }
      return 'ok';
    });

    await vi.runAllTimersAsync();
    await expect(promise).resolves.toBe('ok');
    expect(calls).toBe(3);
    vi.useRealTimers();
  });
});
