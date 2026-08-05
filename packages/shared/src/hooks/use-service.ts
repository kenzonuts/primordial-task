import { useContext } from 'react';

import type { ServiceToken } from '@core/di/contracts';
import { ServiceContainerContext } from '@shared/hooks/use-service-container';

export const useService = <TService>(token: ServiceToken<TService>): TService => {
  const container = useContext(ServiceContainerContext);

  if (!container) {
    throw new Error('Service container is not available');
  }

  return container.resolve(token);
};
