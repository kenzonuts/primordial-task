export interface IServiceCollection {
  register<TService>(key: string, service: TService): void;
  resolve<TService>(key: string): TService;
}

export interface RepositoryContract<TRecord> {
  findById(id: string): Promise<TRecord | null>;
  findAll(): Promise<TRecord[]>;
  save(record: TRecord): Promise<TRecord>;
  delete(id: string): Promise<void>;
}

export interface HttpClientContract {
  get<TResponse>(url: string): Promise<TResponse>;
  post<TRequest, TResponse>(url: string, body: TRequest): Promise<TResponse>;
  put<TRequest, TResponse>(url: string, body: TRequest): Promise<TResponse>;
  delete(url: string): Promise<void>;
}

export interface StorageAdapterContract<TValue> {
  get(key: string): Promise<TValue | null>;
  set(key: string, value: TValue): Promise<void>;
  remove(key: string): Promise<void>;
}
