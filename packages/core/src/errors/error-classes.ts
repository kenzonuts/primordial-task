import { APP_ERROR_CODES } from '@core/errors/error-codes';
import type { AppErrorCode } from '@core/errors/error-codes';
import type { AppErrorDetails, AppErrorShape } from '@core/errors/error-types';

export class AppError extends Error implements AppErrorShape {
  readonly code: AppErrorCode;
  readonly details?: AppErrorDetails;

  constructor(code: AppErrorCode, message: string, details?: AppErrorDetails) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.details = details;
  }
}

export class ConfigurationError extends AppError {
  constructor(message: string, details?: AppErrorDetails) {
    super(APP_ERROR_CODES.configuration, message, details);
    this.name = 'ConfigurationError';
  }
}

export class DependencyError extends AppError {
  constructor(message: string, details?: AppErrorDetails) {
    super(APP_ERROR_CODES.dependency, message, details);
    this.name = 'DependencyError';
  }
}

export class StorageError extends AppError {
  constructor(message: string, details?: AppErrorDetails) {
    super(APP_ERROR_CODES.storage, message, details);
    this.name = 'StorageError';
  }
}

export class NetworkError extends AppError {
  constructor(message: string, details?: AppErrorDetails) {
    super(APP_ERROR_CODES.network, message, details);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: AppErrorDetails) {
    super(APP_ERROR_CODES.validation, message, details);
    this.name = 'ValidationError';
  }
}

export class TimeoutError extends AppError {
  constructor(message: string, details?: AppErrorDetails) {
    super(APP_ERROR_CODES.timeout, message, details);
    this.name = 'TimeoutError';
  }
}

export class BootstrapError extends AppError {
  constructor(message: string, details?: AppErrorDetails) {
    super(APP_ERROR_CODES.bootstrap, message, details);
    this.name = 'BootstrapError';
  }
}

export class RouteError extends AppError {
  constructor(message: string, details?: AppErrorDetails) {
    super(APP_ERROR_CODES.route, message, details);
    this.name = 'RouteError';
  }
}

export class EventError extends AppError {
  constructor(message: string, details?: AppErrorDetails) {
    super(APP_ERROR_CODES.event, message, details);
    this.name = 'EventError';
  }
}
