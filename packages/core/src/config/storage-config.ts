export interface StorageConfig {
  localStoragePrefix: string;
  secureStoragePrefix: string;
  sqliteDatabaseName: string;
}

export const createStorageConfig = (): StorageConfig => ({
  localStoragePrefix: 'primordial-task',
  secureStoragePrefix: 'primordial-task-secure',
  sqliteDatabaseName: 'primordial-task.db',
});
