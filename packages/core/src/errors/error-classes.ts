import type { AppErrorCode } from './error-codes';

export class AppError extends Error {
  readonly code: AppErrorCode;

  constructor(code: AppErrorCode, message: string) {
    super(message);
    this.name = 'AppError';
    this.code = code;
  }
}

export class ConfigurationError extends AppError {
  constructor(message: string) {
    super('CONFIGURATION_ERROR', message);
    this.name = 'ConfigurationError';
  }
}

export class DependencyError extends AppError {
  constructor(message: string) {
    super('DEPENDENCY_ERROR', message);
    this.name = 'DependencyError';
  }
}

export class StorageError extends AppError {
  constructor(message: string) {
    super('STORAGE_ERROR', message);
    this.name = 'StorageError';
  }
}

export class NetworkError extends AppError {
  constructor(message: string) {
    super('NETWORK_ERROR', message);
    this.name = 'NetworkError';
  }
}
