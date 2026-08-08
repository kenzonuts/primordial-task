import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { TimelineZoomLevel } from '@features/calendar/types';

interface TimelineStoreState {
  readonly zoom: TimelineZoomLevel;
  readonly groupBy: 'project' | 'assignee' | 'none';
  readonly scrollLeft: number;
  setZoom(zoom: TimelineZoomLevel): void;
  setGroupBy(groupBy: 'project' | 'assignee' | 'none'): void;
  setScrollLeft(value: number): void;
}

export const useTimelineStore = create<TimelineStoreState>()(
  persist(
    (set) => ({
      zoom: 'week',
      groupBy: 'project',
      scrollLeft: 0,
      setZoom: (zoom) => set({ zoom }),
      setGroupBy: (groupBy) => set({ groupBy }),
      setScrollLeft: (scrollLeft) => set({ scrollLeft }),
    }),
    {
      name: 'primordial-calendar-timeline',
      partialize: (state) => ({ zoom: state.zoom, groupBy: state.groupBy }),
    },
  ),
);
