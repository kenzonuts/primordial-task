import { describe, expect, it } from 'vitest';

import { createAppRuntimeContext } from '@core/app/environment';
import { createFeatureFlagConfig } from '@core/config/feature-flag-config';
import { createRootConfig } from '@core/config/root-config';

describe('configuration system', () => {
  it('builds root config from runtime context', () => {
    const runtime = createAppRuntimeContext({
      mode: 'development',
      appName: 'Primordial Task',
      appVersion: '0.1.0',
    });

    const config = createRootConfig(runtime, {
      apiBaseUrl: 'https://api.example.com',
      featureFlags: 'enableAiAssistant:true',
    });

    expect(config.application.appName).toBe('Primordial Task');
    expect(config.api.baseUrl).toBe('https://api.example.com');
    expect(config.featureFlags.enableAiAssistant).toBe(true);
    expect(config.featureFlags.enableCloudSync).toBe(false);
  });

  it('parses feature flag overrides', () => {
    const flags = createFeatureFlagConfig('enableCloudSync:true,enableExperimentalUi:true');

    expect(flags.enableCloudSync).toBe(true);
    expect(flags.enableExperimentalUi).toBe(true);
    expect(flags.enableDeveloperWorkspace).toBe(false);
  });
});
