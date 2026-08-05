import type { AppErrorCode } from '@core/errors/error-codes';

export interface AppErrorDetails {
  readonly message: string;
  readonly cause?: unknown;
  readonly context?: Record<string, unknown>;
}

export interface AppErrorShape {
  readonly code: AppErrorCode;
  readonly message: string;
  readonly details?: AppErrorDetails;
}
