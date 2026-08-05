import { useEffect, useState } from 'react';

import type { RuntimeEnvironmentSource } from '@core/app/types';
import { bootstrapApplication } from '@infrastructure/bootstrap/app-bootstrapper';
import type { BootstrapContext } from '@infrastructure/bootstrap/bootstrap-context';

interface UseAppBootstrapState {
  readonly isLoading: boolean;
  readonly context: BootstrapContext | null;
  readonly error: Error | null;
}

export const useAppBootstrap = (source?: RuntimeEnvironmentSource): UseAppBootstrapState => {
  const [state, setState] = useState<UseAppBootstrapState>({
    isLoading: true,
    context: null,
    error: null,
  });

  useEffect(() => {
    let active = true;

    bootstrapApplication(source)
      .then((result) => {
        if (!active) {
          return;
        }

        setState({
          isLoading: false,
          context: result.context,
          error: null,
        });
      })
      .catch((error: unknown) => {
        if (!active) {
          return;
        }

        setState({
          isLoading: false,
          context: null,
          error: error instanceof Error ? error : new Error('Bootstrap failed'),
        });
      });

    return () => {
      active = false;
    };
  }, [source]);

  return state;
};
