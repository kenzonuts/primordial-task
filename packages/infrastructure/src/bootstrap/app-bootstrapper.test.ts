import { describe, expect, it } from 'vitest';

import { EVENT_BUS_TOKEN, LOGGER_TOKEN, ROOT_CONFIG_TOKEN } from '@core/di/tokens';
import { bootstrapApplication } from '@infrastructure/bootstrap/app-bootstrapper';
import { createRuntimeConfig } from '@infrastructure/config/runtime-config';
import { createInfrastructureContainer } from '@infrastructure/dependency-injection/container';

describe('infrastructure composition', () => {
  it('registers root config and core services', () => {
    const runtimeConfig = createRuntimeConfig({
      mode: 'test',
      appName: 'Primordial Task',
      appVersion: '0.1.0',
      apiBaseUrl: '',
      logLevel: 'error',
    });
    const container = createInfrastructureContainer(runtimeConfig);

    expect(container.resolve(ROOT_CONFIG_TOKEN).application.appName).toBe('Primordial Task');
    expect(container.resolve(LOGGER_TOKEN)).toBeDefined();
    expect(container.resolve(EVENT_BUS_TOKEN)).toBeDefined();
  });

  it('bootstraps application lifecycle', async () => {
    const result = await bootstrapApplication({
      mode: 'test',
      appName: 'Primordial Task',
      appVersion: '0.1.0',
      logLevel: 'error',
    });

    expect(result.context.container.has(ROOT_CONFIG_TOKEN)).toBe(true);
  });
});
