import type { PropsWithChildren, ReactElement } from 'react';
import { createContext } from 'react';

import type { ServiceRegistry } from '@core/di/service-registry';

export const ServiceContainerContext = createContext<ServiceRegistry | null>(null);

interface ServiceContainerProviderProps extends PropsWithChildren {
  readonly container: ServiceRegistry;
}

export const ServiceContainerProvider = ({
  container,
  children,
}: ServiceContainerProviderProps): ReactElement => {
  return (
    <ServiceContainerContext.Provider value={container}>
      {children}
    </ServiceContainerContext.Provider>
  );
};
