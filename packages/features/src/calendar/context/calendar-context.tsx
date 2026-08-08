import type { PropsWithChildren, ReactElement } from 'react';
import { createContext, useContext, useEffect, useMemo } from 'react';

import { useCalendarStore } from '@features/calendar/store/calendar-store';
import { useCalendarPreferenceStore } from '@features/calendar/store/preference-store';
import type { CalendarEvent } from '@features/calendar/types';
import { useWorkspaceContext } from '@features/workspace/context/workspace-context';

export interface CalendarContextValue {
  readonly workspaceId: string | null;
  readonly events: readonly CalendarEvent[];
  readonly status: 'idle' | 'loading' | 'ready' | 'error';
  readonly loadEvents: () => Promise<void>;
}

const CalendarContext = createContext<CalendarContextValue | null>(null);

export const CalendarProvider = ({ children }: PropsWithChildren): ReactElement => {
  const { currentWorkspace } = useWorkspaceContext();
  const workspaceId = currentWorkspace?.id ?? null;
  const events = useCalendarStore((state) => state.events);
  const status = useCalendarStore((state) => state.status);
  const loadEvents = useCalendarStore((state) => state.loadEvents);
  const loadPreferences = useCalendarPreferenceStore((state) => state.loadPreferences);

  useEffect(() => {
    if (!workspaceId) {
      return;
    }
    void loadEvents(workspaceId);
    void loadPreferences();
  }, [workspaceId, loadEvents, loadPreferences]);

  const value = useMemo<CalendarContextValue>(
    () => ({
      workspaceId,
      events,
      status,
      loadEvents: async () => {
        if (!workspaceId) {
          return;
        }
        await loadEvents(workspaceId);
      },
    }),
    [workspaceId, events, status, loadEvents],
  );

  return <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>;
};

export const useCalendarContext = (): CalendarContextValue => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendarContext must be used within CalendarProvider');
  }
  return context;
};
