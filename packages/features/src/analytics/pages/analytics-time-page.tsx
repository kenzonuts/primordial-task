import type { ReactElement } from 'react';

import {
  AnalyticsEmptyState,
  AnalyticsError,
  AnalyticsHeader,
  AnalyticsSkeleton,
  ChartCard,
  MetricCard,
} from '@features/analytics/components';
import { useAnalyticsContext } from '@features/analytics/context/analytics-context';
import { useAnalyticsDashboardQuery } from '@features/analytics/hooks/use-analytics-dashboard';
import { selectResolvedTimeRange } from '@features/analytics/store';
import { Stack } from '@shared/ui/layout/stack';
import { Text } from '@shared/ui/typography/text';

const TIME_KPI_IDS = ['focus_score', 'avg_resolution'] as const;

export const AnalyticsTimePage = (): ReactElement => {
  const { workspaceId } = useAnalyticsContext();
  const query = useAnalyticsDashboardQuery(workspaceId);
  const timeRange = query.data?.timeRange ?? selectResolvedTimeRange();

  if (!workspaceId) {
    return (
      <AnalyticsEmptyState
        title="Select a workspace"
        description="Choose a workspace to view time analytics."
      />
    );
  }

  if (query.isLoading && !query.data) {
    return (
      <Stack gap={24} data-testid="analytics-time-page">
        <AnalyticsHeader title="Time analytics" timeRange={timeRange} />
        <AnalyticsSkeleton />
      </Stack>
    );
  }

  if (query.isError && !query.data) {
    return (
      <Stack gap={24} data-testid="analytics-time-page">
        <AnalyticsHeader title="Time analytics" timeRange={timeRange} />
        <AnalyticsError
          message={query.error instanceof Error ? query.error.message : undefined}
          onRetry={() => {
            void query.refetch();
          }}
        />
      </Stack>
    );
  }

  const snapshot = query.data;
  if (!snapshot) {
    return (
      <Stack gap={24} data-testid="analytics-time-page">
        <AnalyticsHeader title="Time analytics" timeRange={timeRange} />
        <AnalyticsEmptyState />
      </Stack>
    );
  }

  const kpis = TIME_KPI_IDS.map((id) => snapshot.kpis.find((kpi) => kpi.id === id)).filter(Boolean);

  return (
    <Stack gap={24} data-testid="analytics-time-page">
      <AnalyticsHeader
        title="Time analytics"
        timeRange={snapshot.timeRange}
        refreshing={query.isFetching}
        onRefresh={() => {
          void query.refetch();
        }}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {kpis.map((metric) => (metric ? <MetricCard key={metric.id} metric={metric} /> : null))}
      </div>

      <ChartCard
        title="Estimate accuracy"
        description="Estimated vs actual foundation using task estimate and actual minutes."
      >
        <Text as="p" variant="body-sm" muted>
          Estimate accuracy is calculated in the metric engine when both estimated and actual
          minutes are present. Dedicated time-entry heatmaps and project time distribution charts
          will extend this foundation once the time-tracking module lands.
        </Text>
      </ChartCard>

      <ChartCard
        title="Focus foundation"
        description="Tracked task minutes versus work-day capacity."
      >
        <Text as="p" variant="body-sm" muted>
          Focus Score uses tracked actual minutes against an 8-hour work-day approximation for
          weekdays in the selected range. Idle-time analytics require calendar presence signals.
        </Text>
      </ChartCard>
    </Stack>
  );
};
