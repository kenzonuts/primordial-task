import { ROUTES } from '@core/app/constants';
import { InMemoryRouteRegistry } from '@core/routing/route-registry';

export const createAppRouteRegistry = (): InMemoryRouteRegistry => {
  const registry = new InMemoryRouteRegistry();

  registry.register({
    id: 'root',
    path: ROUTES.root,
    title: 'Application Root',
    lazy: false,
  });

  return registry;
};
