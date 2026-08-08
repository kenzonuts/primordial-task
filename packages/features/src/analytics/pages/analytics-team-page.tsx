import type { ReactElement } from 'react';

import {
  AnalyticsEmptyState,
  AnalyticsError,
  AnalyticsHeader,
  AnalyticsSkeleton,
  AnalyticsTable,
  ChartCard,
  Heatmap,
  MetricCard,
} from '@features/analytics/components';
import { useAnalyticsContext } from '@features/analytics/context/analytics-context';
import { useAnalyticsDashboardQuery } from '@features/analytics/hooks/use-analytics-dashboard';
import { selectResolvedTimeRange } from '@features/analytics/store';
import { Stack } from '@shared/ui/layout/stack';

const TEAM_KPI_IDS = ['productivity_score', 'focus_score', 'overdue_rate'] as const;

export const AnalyticsTeamPage = (): ReactElement => {
  const { workspaceId } = useAnalyticsContext();
  const query = useAnalyticsDashboardQuery(workspaceId);
  const timeRange = query.data?.timeRange ?? selectResolvedTimeRange();

  if (!workspaceId) {
    return (
      <AnalyticsEmptyState
        title="Select a workspace"
        description="Choose a workspace to view team analytics."
      />
    );
  }

  if (query.isLoading && !query.data) {
    return (
      <Stack gap={24} data-testid="analytics-team-page">
        <AnalyticsHeader title="Team analytics" timeRange={timeRange} />
        <AnalyticsSkeleton />
      </Stack>
    );
  }

  if (query.isError && !query.data) {
    return (
      <Stack gap={24} data-testid="analytics-team-page">
        <AnalyticsHeader title="Team analytics" timeRange={timeRange} />
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
      <Stack gap={24} data-testid="analytics-team-page">
        <AnalyticsHeader title="Team analytics" timeRange={timeRange} />
        <AnalyticsEmptyState />
      </Stack>
    );
  }

  const kpis = TEAM_KPI_IDS.map((id) => snapshot.kpis.find((kpi) => kpi.id === id)).filter(Boolean);

  return (
    <Stack gap={24} data-testid="analytics-team-page">
      <AnalyticsHeader
        title="Team analytics"
        timeRange={snapshot.timeRange}
        refreshing={query.isFetching}
        onRefresh={() => {
          void query.refetch();
        }}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {kpis.map((metric) => (metric ? <MetricCard key={metric.id} metric={metric} /> : null))}
      </div>

      <ChartCard
        title="Workload heatmap"
        description="Open-task load across members for the selected range."
      >
        <Heatmap cells={snapshot.workloadHeatmap} />
      </ChartCard>

      <ChartCard
        title="Member capacity"
        description="Assigned, completed, overdue, and capacity signals."
      >
        <AnalyticsTable variant="member" rows={snapshot.memberRows} />
      </ChartCard>
    </Stack>
  );
};
