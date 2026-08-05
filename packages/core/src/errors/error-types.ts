export interface AppErrorDetails {
  code: string;
  message: string;
  cause?: unknown;
}

export interface AppErrorShape {
  readonly code: string;
  readonly message: string;
  readonly details?: AppErrorDetails;
}
