export interface FeatureFlagConfig {
  experimentalAi: boolean;
  developerWorkspace: boolean;
  offlineFirstMode: boolean;
}

export const createFeatureFlagConfig = (): FeatureFlagConfig => ({
  experimentalAi: false,
  developerWorkspace: false,
  offlineFirstMode: true,
});
