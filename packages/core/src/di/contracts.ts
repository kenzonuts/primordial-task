export interface ServiceToken<TService> {
  readonly key: string;
  readonly _type?: TService;
}

export interface IServiceCollection {
  registerInstance<TService>(token: ServiceToken<TService>, service: TService): void;
  registerFactory<TService>(token: ServiceToken<TService>, factory: () => TService): void;
  resolve<TService>(token: ServiceToken<TService>): TService;
  has(token: ServiceToken<unknown>): boolean;
}

export interface RepositoryContract<TRecord> {
  findById(id: string): Promise<TRecord | null>;
  findAll(): Promise<TRecord[]>;
  save(record: TRecord): Promise<TRecord>;
  delete(id: string): Promise<void>;
}

export interface HttpRequestContract<TBody = unknown> {
  readonly method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  readonly path: string;
  readonly headers?: Record<string, string>;
  readonly body?: TBody;
}

export interface HttpResponseContract<TData = unknown> {
  readonly status: number;
  readonly headers: Record<string, string>;
  readonly data: TData;
}

export interface HttpClientContract {
  request<TResponse, TBody = unknown>(
    request: HttpRequestContract<TBody>,
  ): Promise<HttpResponseContract<TResponse>>;
}

export interface StorageAdapterContract {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
}

export interface SqliteAdapterContract {
  connect(databaseName: string): Promise<void>;
  disconnect(): Promise<void>;
}

export interface CloudStorageContract {
  upload(key: string, payload: string): Promise<void>;
  download(key: string): Promise<string | null>;
  remove(key: string): Promise<void>;
}
