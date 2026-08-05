import type { CloudStorageContract } from '@core/di/contracts';

export class NoopCloudStorageAdapter implements CloudStorageContract {
  private readonly data = new Map<string, string>();

  async upload(key: string, payload: string): Promise<void> {
    this.data.set(key, payload);
  }

  async download(key: string): Promise<string | null> {
    return this.data.get(key) ?? null;
  }

  async remove(key: string): Promise<void> {
    this.data.delete(key);
  }
}
