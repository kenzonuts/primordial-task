import { create } from 'zustand';

import { emptyCalendarFilters } from '@features/calendar/services/calendar-service';
import type { CalendarFiltersState } from '@features/calendar/types';

interface FilterStoreState {
  readonly filters: CalendarFiltersState;
  setFilters(partial: Partial<CalendarFiltersState>): void;
  resetFilters(): void;
}

export const useCalendarFilterStore = create<FilterStoreState>((set, get) => ({
  filters: emptyCalendarFilters(),
  setFilters: (partial) => set({ filters: { ...get().filters, ...partial } }),
  resetFilters: () => set({ filters: emptyCalendarFilters() }),
}));

interface SearchStoreState {
  readonly query: string;
  readonly debouncedQuery: string;
  setQuery(query: string): void;
  setDebouncedQuery(query: string): void;
  clear(): void;
}

export const useCalendarSearchStore = create<SearchStoreState>((set) => ({
  query: '',
  debouncedQuery: '',
  setQuery: (query) => set({ query }),
  setDebouncedQuery: (debouncedQuery) => {
    set({ debouncedQuery });
    useCalendarFilterStore.getState().setFilters({ query: debouncedQuery });
  },
  clear: () => {
    set({ query: '', debouncedQuery: '' });
    useCalendarFilterStore.getState().setFilters({ query: '' });
  },
}));
