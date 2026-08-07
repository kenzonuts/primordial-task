import { AppError } from '@core/errors/error-classes';
import { APP_ERROR_CODES } from '@core/errors/error-codes';
import type { AppErrorCode } from '@core/errors/error-codes';
import type { AppErrorDetails } from '@core/errors/error-types';

export const createError = (
  code: AppErrorCode,
  message: string,
  details?: AppErrorDetails,
): AppError => {
  return new AppError(code, message, details);
};

export const isAppError = (value: unknown): value is AppError => {
  return value instanceof AppError;
};

export const toAppError = (
  error: unknown,
  fallbackMessage = 'Unexpected application error',
): AppError => {
  if (isAppError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return createError(APP_ERROR_CODES.unknown, error.message, {
      message: fallbackMessage,
      cause: error,
    });
  }

  if (typeof error === 'string') {
    return createError(APP_ERROR_CODES.unknown, error);
  }

  return createError(APP_ERROR_CODES.unknown, fallbackMessage, {
    message: fallbackMessage,
    cause: error,
  });
};

export const getErrorCode = (error: unknown): AppErrorCode => {
  return isAppError(error) ? error.code : APP_ERROR_CODES.unknown;
};

export const getErrorMessage = (error: unknown): string => {
  if (isAppError(error) || error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'Unknown error';
};
