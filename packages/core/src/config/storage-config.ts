export interface StorageConfig {
  readonly localStoragePrefix: string;
  readonly secureStoragePrefix: string;
  readonly sqliteDatabaseName: string;
  readonly cloudNamespace: string;
}

export const createStorageConfig = (): StorageConfig => ({
  localStoragePrefix: 'primordial-task',
  secureStoragePrefix: 'primordial-task-secure',
  sqliteDatabaseName: 'primordial-task.db',
  cloudNamespace: 'primordial-task',
});
