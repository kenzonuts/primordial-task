import type { AppErrorCode } from '@core/errors/error-codes';

export type EventPayload = Record<string, unknown>;

export interface DomainEvent<
  TType extends string = string,
  TPayload extends EventPayload = EventPayload,
> {
  readonly type: TType;
  readonly occurredAt: number;
  readonly payload: TPayload;
}

export type ApplicationEventType =
  | 'application.bootstrap.started'
  | 'application.bootstrap.completed'
  | 'application.bootstrap.failed'
  | 'application.error';

export type ApplicationEvent =
  | DomainEvent<'application.bootstrap.started', { environment: string }>
  | DomainEvent<'application.bootstrap.completed', { durationMs: number }>
  | DomainEvent<'application.bootstrap.failed', { errorCode: AppErrorCode }>
  | DomainEvent<'application.error', { errorCode: AppErrorCode; message: string }>;

export type EventHandler<TEvent extends DomainEvent = DomainEvent> = (event: TEvent) => void;

export interface EventBus<TEvent extends DomainEvent = DomainEvent> {
  publish(event: TEvent): void;
  subscribe(handler: EventHandler<TEvent>): () => void;
}

export class InMemoryEventBus<
  TEvent extends DomainEvent = DomainEvent,
> implements EventBus<TEvent> {
  private readonly handlers = new Set<EventHandler<TEvent>>();

  publish(event: TEvent): void {
    for (const handler of this.handlers) {
      handler(event);
    }
  }

  subscribe(handler: EventHandler<TEvent>): () => void {
    this.handlers.add(handler);

    return () => {
      this.handlers.delete(handler);
    };
  }
}

export const createDomainEvent = <TType extends string, TPayload extends EventPayload>(
  type: TType,
  payload: TPayload,
): DomainEvent<TType, TPayload> => {
  return {
    type,
    payload,
    occurredAt: Date.now(),
  };
};
