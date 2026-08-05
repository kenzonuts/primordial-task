import { createAppRuntimeContext } from '@core/app/environment';

export const loadEnvironment = (
  environment = import.meta.env.MODE,
): ReturnType<typeof createAppRuntimeContext> => {
  return createAppRuntimeContext(environment);
};
