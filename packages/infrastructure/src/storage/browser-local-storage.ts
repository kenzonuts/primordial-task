import type { StorageAdapterContract } from '@core/di/contracts';
import { StorageError } from '@core/errors/error-classes';

export class BrowserLocalStorageAdapter implements StorageAdapterContract {
  constructor(private readonly prefix: string) {}

  async get(key: string): Promise<string | null> {
    try {
      return window.localStorage.getItem(this.withPrefix(key));
    } catch (error) {
      throw new StorageError('Failed to read from local storage', {
        message: 'Failed to read from local storage',
        cause: error,
      });
    }
  }

  async set(key: string, value: string): Promise<void> {
    try {
      window.localStorage.setItem(this.withPrefix(key), value);
    } catch (error) {
      throw new StorageError('Failed to write to local storage', {
        message: 'Failed to write to local storage',
        cause: error,
      });
    }
  }

  async remove(key: string): Promise<void> {
    try {
      window.localStorage.removeItem(this.withPrefix(key));
    } catch (error) {
      throw new StorageError('Failed to remove local storage value', {
        message: 'Failed to remove local storage value',
        cause: error,
      });
    }
  }

  private withPrefix(key: string): string {
    return `${this.prefix}:${key}`;
  }
}
