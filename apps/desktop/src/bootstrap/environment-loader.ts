import type { RuntimeEnvironmentSource } from '@core/app/types';
import { getRuntimeEnvironmentSource } from '@infrastructure/config/environment-source';

export const loadEnvironment = (): RuntimeEnvironmentSource => {
  return getRuntimeEnvironmentSource();
};
