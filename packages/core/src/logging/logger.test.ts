import { describe, expect, it, vi } from 'vitest';

import { createLogger } from '@core/logging/logger';

describe('createLogger', () => {
  it('emits development logs with structured payload', () => {
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => undefined);
    const logger = createLogger('development', 'debug');

    logger.info('hello', { scope: 'test' });

    expect(infoSpy).toHaveBeenCalledOnce();
    expect(infoSpy.mock.calls[0]?.[0]).toBe('[DEV]');
    infoSpy.mockRestore();
  });

  it('suppresses debug logs in production', () => {
    const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => undefined);
    const logger = createLogger('production', 'debug');

    logger.debug('should not appear');

    expect(debugSpy).not.toHaveBeenCalled();
    debugSpy.mockRestore();
  });

  it('no-ops in test environment', () => {
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => undefined);
    const logger = createLogger('test', 'debug');

    logger.info('silent');

    expect(infoSpy).not.toHaveBeenCalled();
    infoSpy.mockRestore();
  });
});
