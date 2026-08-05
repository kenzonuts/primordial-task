import type { RuntimeEnvironmentSource } from '@core/app/types';

import { createRuntimeConfig } from '@infrastructure/config/runtime-config';
import { createInfrastructureContainer } from '@infrastructure/dependency-injection/container';

export interface BootstrapContext {
  readonly runtimeConfig: ReturnType<typeof createRuntimeConfig>;
  readonly container: ReturnType<typeof createInfrastructureContainer>;
}

export const createBootstrapContext = (source?: RuntimeEnvironmentSource): BootstrapContext => {
  const runtimeConfig = createRuntimeConfig(source);

  return {
    runtimeConfig,
    container: createInfrastructureContainer(runtimeConfig),
  };
};
