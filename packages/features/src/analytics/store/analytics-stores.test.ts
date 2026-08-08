import { beforeEach, describe, expect, it } from 'vitest';

import { emptyFilters } from '@features/analytics/services/analytics-repository';
import {
  useAnalyticsFilterStore,
  useAnalyticsReportStore,
  useAnalyticsStore,
  useAnalyticsTimeRangeStore,
} from '@features/analytics/store/analytics-stores';

describe('analytics stores', () => {
  beforeEach(() => {
    useAnalyticsTimeRangeStore.setState({
      preset: 'last_30_days',
      customStart: null,
      customEnd: null,
    });
    useAnalyticsFilterStore.setState({
      filters: emptyFilters('ws-1'),
    });
    useAnalyticsStore.setState({
      section: 'overview',
      showAiPanel: false,
      selectedMetricId: null,
      tableModeChartIds: new Set(),
    });
  });

  it('updates time range and section for dashboard loading state', () => {
    useAnalyticsTimeRangeStore.getState().setPreset('last_7_days');
    useAnalyticsStore.getState().setSection('tasks');
    useAnalyticsFilterStore.getState().setFilters({ includeArchived: true });

    expect(useAnalyticsTimeRangeStore.getState().preset).toBe('last_7_days');
    expect(useAnalyticsStore.getState().section).toBe('tasks');
    expect(useAnalyticsFilterStore.getState().filters.includeArchived).toBe(true);
    expect(useAnalyticsFilterStore.getState().filters.workspaceId).toBe('ws-1');
  });

  it('keeps seeded reports available for the reports page', () => {
    const reports = useAnalyticsReportStore.getState().reports;
    expect(reports.length).toBeGreaterThan(0);
    expect(reports.some((report) => report.id === 'report-weekly')).toBe(true);
  });
});
