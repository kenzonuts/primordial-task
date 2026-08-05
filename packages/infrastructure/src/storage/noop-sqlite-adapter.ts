import type { SqliteAdapterContract } from '@core/di/contracts';

export class NoopSqliteAdapter implements SqliteAdapterContract {
  async connect(): Promise<void> {
    return Promise.resolve();
  }

  async disconnect(): Promise<void> {
    return Promise.resolve();
  }
}
