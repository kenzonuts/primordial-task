import type { RuntimeEnvironmentSource } from '@core/app/types';
import { BootstrapError } from '@core/errors/error-classes';
import { toAppError } from '@core/errors/error-utils';

import { createAppLifecycle } from '@infrastructure/bootstrap/app-lifecycle';
import { createBootstrapContext } from '@infrastructure/bootstrap/bootstrap-context';

export interface AppBootstrapResult {
  readonly context: ReturnType<typeof createBootstrapContext>;
}

export const bootstrapApplication = async (
  source?: RuntimeEnvironmentSource,
): Promise<AppBootstrapResult> => {
  const context = createBootstrapContext(source);

  try {
    const lifecycle = createAppLifecycle(
      context.container,
      context.runtimeConfig.runtime.environment,
    );

    await lifecycle.start();

    return {
      context,
    };
  } catch (error) {
    const appError = toAppError(error, 'Application bootstrap failed');
    throw new BootstrapError(appError.message, {
      message: 'Application bootstrap failed',
      cause: appError,
    });
  }
};
