import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { DEFAULT_CALENDAR_PREFERENCES } from '@features/calendar/constants';
import { calendarService } from '@features/calendar/store/calendar-store';
import { useTimelineStore } from '@features/calendar/store/timeline-store';
import { useCalendarViewStore } from '@features/calendar/store/view-store';
import type { CalendarPreferences } from '@features/calendar/types';

interface PreferenceStoreState {
  readonly preferences: CalendarPreferences;
  readonly status: 'idle' | 'loading' | 'ready';
  loadPreferences(): Promise<void>;
  updatePreferences(prefs: Partial<CalendarPreferences>): Promise<void>;
}

export const useCalendarPreferenceStore = create<PreferenceStoreState>()(
  persist(
    (set) => ({
      preferences: { ...DEFAULT_CALENDAR_PREFERENCES },
      status: 'idle',
      loadPreferences: async () => {
        set({ status: 'loading' });
        const preferences = await calendarService.getPreferences();
        set({ preferences, status: 'ready' });
        useCalendarViewStore.getState().setView(preferences.defaultView);
        useTimelineStore.getState().setZoom(preferences.timelineZoom);
        useTimelineStore.getState().setGroupBy(preferences.timelineGroupBy);
      },
      updatePreferences: async (prefs) => {
        const preferences = await calendarService.updatePreferences(prefs);
        set({ preferences });
        if (prefs.defaultView) {
          useCalendarViewStore.getState().setView(preferences.defaultView);
        }
        if (prefs.timelineZoom) {
          useTimelineStore.getState().setZoom(preferences.timelineZoom);
        }
        if (prefs.timelineGroupBy) {
          useTimelineStore.getState().setGroupBy(preferences.timelineGroupBy);
        }
      },
    }),
    {
      name: 'primordial-calendar-preferences-ui',
      partialize: (state) => ({ preferences: state.preferences }),
    },
  ),
);
