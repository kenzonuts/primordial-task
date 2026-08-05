import type { IServiceCollection, ServiceToken } from '@core/di/contracts';
import { DependencyError } from '@core/errors/error-classes';

type ServiceFactory<TService> = () => TService;

interface ServiceEntry {
  instance?: unknown;
  factory?: ServiceFactory<unknown>;
}

export const createServiceToken = <TService>(key: string): ServiceToken<TService> => {
  return { key };
};

export class ServiceRegistry implements IServiceCollection {
  private readonly services = new Map<string, ServiceEntry>();

  registerInstance<TService>(token: ServiceToken<TService>, service: TService): void {
    this.services.set(token.key, { instance: service });
  }

  registerFactory<TService>(token: ServiceToken<TService>, factory: () => TService): void {
    this.services.set(token.key, { factory });
  }

  resolve<TService>(token: ServiceToken<TService>): TService {
    const entry = this.services.get(token.key);

    if (!entry) {
      throw new DependencyError(`Service not registered: ${token.key}`);
    }

    if (entry.instance !== undefined) {
      return entry.instance as TService;
    }

    if (!entry.factory) {
      throw new DependencyError(`Service factory missing: ${token.key}`);
    }

    const instance = entry.factory();
    this.services.set(token.key, { instance });

    return instance as TService;
  }

  has(token: ServiceToken<unknown>): boolean {
    return this.services.has(token.key);
  }
}
