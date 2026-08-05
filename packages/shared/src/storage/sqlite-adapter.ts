export interface SqliteAdapterContract<TRecord> {
  connect(databaseName: string): Promise<void>;
  readAll(): Promise<TRecord[]>;
  write(record: TRecord): Promise<void>;
}

export const createSqliteAdapter = <TRecord>(): SqliteAdapterContract<TRecord> => ({
  connect: async () => {
    return undefined;
  },
  readAll: async () => {
    return [];
  },
  write: async () => {
    return undefined;
  },
});
