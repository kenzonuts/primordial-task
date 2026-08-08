import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { emptyFilters } from '@features/analytics/services/analytics-repository';
import type {
  AnalyticsFilters,
  AnalyticsPreferences,
  AnalyticsSection,
  ExportFormat,
  SavedReport,
  TimeRangePreset,
} from '@features/analytics/types';
import { resolveTimeRange } from '@features/analytics/utils/time-range';

interface TimeRangeStoreState {
  readonly preset: TimeRangePreset;
  readonly customStart: number | null;
  readonly customEnd: number | null;
  setPreset(preset: TimeRangePreset): void;
  setCustomRange(start: number, end: number): void;
}

export const useAnalyticsTimeRangeStore = create<TimeRangeStoreState>()(
  persist(
    (set) => ({
      preset: 'last_30_days',
      customStart: null,
      customEnd: null,
      setPreset: (preset) => set({ preset }),
      setCustomRange: (customStart, customEnd) => set({ preset: 'custom', customStart, customEnd }),
    }),
    {
      name: 'primordial-analytics-time-range',
      partialize: (state) => ({
        preset: state.preset,
        customStart: state.customStart,
        customEnd: state.customEnd,
      }),
    },
  ),
);

export const selectResolvedTimeRange = () => {
  const state = useAnalyticsTimeRangeStore.getState();
  return resolveTimeRange(state.preset, Date.now(), state.customStart, state.customEnd);
};

interface FilterStoreState {
  readonly filters: AnalyticsFilters;
  setFilters(partial: Partial<AnalyticsFilters>): void;
  resetFilters(workspaceId?: string | null): void;
}

export const useAnalyticsFilterStore = create<FilterStoreState>((set, get) => ({
  filters: emptyFilters(),
  setFilters: (partial) => set({ filters: { ...get().filters, ...partial } }),
  resetFilters: (workspaceId = null) => set({ filters: emptyFilters(workspaceId) }),
}));

interface AnalyticsUiStoreState {
  readonly section: AnalyticsSection;
  readonly showAiPanel: boolean;
  readonly selectedMetricId: string | null;
  readonly tableModeChartIds: ReadonlySet<string>;
  setSection(section: AnalyticsSection): void;
  setShowAiPanel(show: boolean): void;
  setSelectedMetricId(id: string | null): void;
  toggleTableMode(chartId: string): void;
}

export const useAnalyticsStore = create<AnalyticsUiStoreState>((set, get) => ({
  section: 'overview',
  showAiPanel: false,
  selectedMetricId: null,
  tableModeChartIds: new Set(),
  setSection: (section) => set({ section }),
  setShowAiPanel: (showAiPanel) => set({ showAiPanel }),
  setSelectedMetricId: (selectedMetricId) => set({ selectedMetricId }),
  toggleTableMode: (chartId) => {
    const next = new Set(get().tableModeChartIds);
    if (next.has(chartId)) {
      next.delete(chartId);
    } else {
      next.add(chartId);
    }
    set({ tableModeChartIds: next });
  },
}));

interface PreferenceStoreState {
  readonly preferences: AnalyticsPreferences;
  updatePreferences(prefs: Partial<AnalyticsPreferences>): void;
}

export const useAnalyticsPreferenceStore = create<PreferenceStoreState>()(
  persist(
    (set, get) => ({
      preferences: {
        defaultPreset: 'last_30_days',
        defaultSection: 'overview',
        showTableAlternatives: true,
        debounceMs: 300,
      },
      updatePreferences: (prefs) => set({ preferences: { ...get().preferences, ...prefs } }),
    }),
    {
      name: 'primordial-analytics-preferences',
      partialize: (state) => ({ preferences: state.preferences }),
    },
  ),
);

interface ExportStoreState {
  readonly open: boolean;
  readonly format: ExportFormat;
  readonly busy: boolean;
  readonly lastPayload: string | null;
  setOpen(open: boolean): void;
  setFormat(format: ExportFormat): void;
  setBusy(busy: boolean): void;
  setLastPayload(payload: string | null): void;
}

export const useAnalyticsExportStore = create<ExportStoreState>((set) => ({
  open: false,
  format: 'csv',
  busy: false,
  lastPayload: null,
  setOpen: (open) => set({ open }),
  setFormat: (format) => set({ format }),
  setBusy: (busy) => set({ busy }),
  setLastPayload: (lastPayload) => set({ lastPayload }),
}));

interface ReportStoreState {
  readonly reports: SavedReport[];
  addReport(report: Omit<SavedReport, 'id' | 'createdAt' | 'updatedAt'>): void;
  toggleFavorite(id: string): void;
  togglePinned(id: string): void;
  removeReport(id: string): void;
}

export const useAnalyticsReportStore = create<ReportStoreState>()(
  persist(
    (set, get) => ({
      reports: [
        {
          id: 'report-weekly',
          name: 'Weekly Delivery',
          description: 'Completion, overdue, and velocity for the last 7 days.',
          section: 'overview',
          filters: emptyFilters(),
          timeRangePreset: 'last_7_days',
          chartIds: ['productivity_trend', 'status_distribution'],
          favorite: true,
          pinned: true,
          createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
          updatedAt: Date.now() - 1000 * 60 * 60 * 24,
        },
        {
          id: 'report-monthly',
          name: 'Monthly Health',
          description: 'Workspace and project health snapshot.',
          section: 'projects',
          filters: emptyFilters(),
          timeRangePreset: 'this_month',
          chartIds: ['project_health', 'priority_distribution'],
          favorite: false,
          pinned: false,
          createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30,
          updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
        },
      ],
      addReport: (report) => {
        const now = Date.now();
        set({
          reports: [
            {
              ...report,
              id: `report-${now}`,
              createdAt: now,
              updatedAt: now,
            },
            ...get().reports,
          ],
        });
      },
      toggleFavorite: (id) =>
        set({
          reports: get().reports.map((report) =>
            report.id === id ? { ...report, favorite: !report.favorite } : report,
          ),
        }),
      togglePinned: (id) =>
        set({
          reports: get().reports.map((report) =>
            report.id === id ? { ...report, pinned: !report.pinned } : report,
          ),
        }),
      removeReport: (id) => set({ reports: get().reports.filter((report) => report.id !== id) }),
    }),
    { name: 'primordial-analytics-reports' },
  ),
);
