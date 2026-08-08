import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { CalendarViewMode } from '@features/calendar/types';

interface ViewStoreState {
  readonly view: CalendarViewMode;
  setView(view: CalendarViewMode): void;
}

export const useCalendarViewStore = create<ViewStoreState>()(
  persist(
    (set) => ({
      view: 'month',
      setView: (view) => set({ view }),
    }),
    { name: 'primordial-calendar-view', partialize: (state) => ({ view: state.view }) },
  ),
);

interface NavigationStoreState {
  readonly anchorDate: number;
  readonly hoveredDate: number | null;
  readonly customRangeStart: number | null;
  readonly customRangeEnd: number | null;
  setAnchorDate(ms: number): void;
  setHoveredDate(ms: number | null): void;
  setCustomRange(start: number | null, end: number | null): void;
  goToday(): void;
}

export const useCalendarNavigationStore = create<NavigationStoreState>((set) => ({
  anchorDate: Date.now(),
  hoveredDate: null,
  customRangeStart: null,
  customRangeEnd: null,
  setAnchorDate: (anchorDate) => set({ anchorDate }),
  setHoveredDate: (hoveredDate) => set({ hoveredDate }),
  setCustomRange: (customRangeStart, customRangeEnd) => set({ customRangeStart, customRangeEnd }),
  goToday: () => set({ anchorDate: Date.now() }),
}));
