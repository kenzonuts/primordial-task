export type ApplicationEventType = 'app:bootstrap' | 'app:ready' | 'app:error';

export interface ApplicationEvent {
  type: ApplicationEventType;
  payload?: Record<string, string | number | boolean | undefined>;
}

export const createApplicationEvent = (
  type: ApplicationEventType,
  payload?: Record<string, string | number | boolean | undefined>,
): ApplicationEvent => ({
  type,
  payload,
});
