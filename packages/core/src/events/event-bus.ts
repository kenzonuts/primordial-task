export type AppEventName = 'app:init' | 'app:ready' | 'app:error';

export interface AppEvent {
  type: AppEventName;
  payload?: Record<string, string | number | boolean | undefined>;
}

export interface EventBus {
  publish(event: AppEvent): void;
  subscribe(handler: (event: AppEvent) => void): () => void;
}

export class InMemoryEventBus implements EventBus {
  private readonly handlers = new Set<(event: AppEvent) => void>();

  publish(event: AppEvent): void {
    for (const handler of this.handlers) {
      handler(event);
    }
  }

  subscribe(handler: (event: AppEvent) => void): () => void {
    this.handlers.add(handler);

    return () => {
      this.handlers.delete(handler);
    };
  }
}
