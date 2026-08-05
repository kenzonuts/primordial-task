import type { StorageAdapterContract } from '@core/di/contracts';

export class NoopSecureStorageAdapter implements StorageAdapterContract {
  private readonly data = new Map<string, string>();

  async get(key: string): Promise<string | null> {
    return this.data.get(key) ?? null;
  }

  async set(key: string, value: string): Promise<void> {
    this.data.set(key, value);
  }

  async remove(key: string): Promise<void> {
    this.data.delete(key);
  }
}
