import { AppError } from './error-classes';
import type { AppErrorCode } from './error-codes';

export const createError = (code: AppErrorCode, message: string): AppError => {
  return new AppError(code, message);
};

export const isAppError = (value: unknown): value is AppError => {
  return value instanceof AppError;
};
