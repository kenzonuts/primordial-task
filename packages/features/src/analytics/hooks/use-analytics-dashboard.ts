import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { createAnalyticsRepository } from '@features/analytics/services/analytics-repository';
import {
  useAnalyticsFilterStore,
  useAnalyticsTimeRangeStore,
} from '@features/analytics/store/analytics-stores';
import { resolveTimeRange } from '@features/analytics/utils/time-range';

const repository = createAnalyticsRepository();

export const analyticsQueryKeys = {
  all: ['analytics'] as const,
  dashboard: (workspaceId: string, preset: string, filtersKey: string) =>
    [...analyticsQueryKeys.all, 'dashboard', workspaceId, preset, filtersKey] as const,
};

export const useAnalyticsDashboardQuery = (workspaceId: string | null) => {
  const preset = useAnalyticsTimeRangeStore((state) => state.preset);
  const customStart = useAnalyticsTimeRangeStore((state) => state.customStart);
  const customEnd = useAnalyticsTimeRangeStore((state) => state.customEnd);
  const filters = useAnalyticsFilterStore((state) => state.filters);

  const range = useMemo(
    () => resolveTimeRange(preset, Date.now(), customStart, customEnd),
    [preset, customStart, customEnd],
  );

  const filtersKey = useMemo(() => JSON.stringify(filters), [filters]);

  return useQuery({
    queryKey: analyticsQueryKeys.dashboard(workspaceId ?? 'none', preset, filtersKey),
    enabled: Boolean(workspaceId),
    staleTime: 5 * 60_000, // Spec: 5-minute TTL for dashboard KPIs
    queryFn: async () => {
      if (!workspaceId) {
        throw new Error('Workspace required.');
      }
      return repository.getDashboard(workspaceId, range, {
        ...filters,
        workspaceId,
      });
    },
  });
};
