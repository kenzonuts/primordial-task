import type { AppErrorCode } from '@core/errors/error-codes';
import type { ApplicationEvent } from '@core/events/event-bus';
import { createDomainEvent } from '@core/events/event-bus';

export const createBootstrapStartedEvent = (environment: string): ApplicationEvent => {
  return createDomainEvent('application.bootstrap.started', { environment });
};

export const createBootstrapCompletedEvent = (durationMs: number): ApplicationEvent => {
  return createDomainEvent('application.bootstrap.completed', { durationMs });
};

export const createBootstrapFailedEvent = (errorCode: AppErrorCode): ApplicationEvent => {
  return createDomainEvent('application.bootstrap.failed', { errorCode });
};
