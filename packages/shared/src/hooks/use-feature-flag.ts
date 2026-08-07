import type { FeatureFlagKey } from '@core/config/feature-flag-config';
import { ROOT_CONFIG_TOKEN } from '@core/di/tokens';
import { useService } from '@shared/hooks/use-service';

export const useFeatureFlag = (key: FeatureFlagKey): boolean => {
  const rootConfig = useService(ROOT_CONFIG_TOKEN);
  return rootConfig.featureFlags[key];
};

export const useRootConfig = () => {
  return useService(ROOT_CONFIG_TOKEN);
};
