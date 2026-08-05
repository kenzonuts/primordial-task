export type FeatureFlagKey =
  'enableDeveloperWorkspace' | 'enableAiAssistant' | 'enableCloudSync' | 'enableExperimentalUi';

export type FeatureFlagConfig = Record<FeatureFlagKey, boolean>;

const DEFAULT_FEATURE_FLAGS: FeatureFlagConfig = {
  enableDeveloperWorkspace: false,
  enableAiAssistant: false,
  enableCloudSync: false,
  enableExperimentalUi: false,
};

const parseBoolean = (value: string): boolean => {
  return value.toLowerCase() === 'true';
};

const isFeatureFlagKey = (value: string): value is FeatureFlagKey => {
  return value in DEFAULT_FEATURE_FLAGS;
};

export const createFeatureFlagConfig = (serializedFlags?: string): FeatureFlagConfig => {
  if (!serializedFlags) {
    return { ...DEFAULT_FEATURE_FLAGS };
  }

  const overrides = serializedFlags
    .split(',')
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0)
    .reduce<Partial<FeatureFlagConfig>>((accumulator, entry) => {
      const [rawKey, rawValue = 'false'] = entry.split(':');

      if (!rawKey || !isFeatureFlagKey(rawKey)) {
        return accumulator;
      }

      return {
        ...accumulator,
        [rawKey]: parseBoolean(rawValue),
      };
    }, {});

  return {
    ...DEFAULT_FEATURE_FLAGS,
    ...overrides,
  };
};
