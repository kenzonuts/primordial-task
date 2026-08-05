import type { IServiceCollection } from './contracts';

export class ServiceRegistry implements IServiceCollection {
  private readonly services = new Map<string, unknown>();

  register<TService>(key: string, service: TService): void {
    this.services.set(key, service);
  }

  resolve<TService>(key: string): TService {
    const service = this.services.get(key);

    if (!service) {
      throw new Error(`Service not registered: ${key}`);
    }

    return service as TService;
  }
}
