import type { ReactElement } from 'react';

import {
  AnalyticsEmptyState,
  AnalyticsError,
  AnalyticsHeader,
  AnalyticsSkeleton,
  AnalyticsTable,
  ChartCard,
  ChartLegend,
  LineChart,
  MetricCard,
} from '@features/analytics/components';
import { useAnalyticsContext } from '@features/analytics/context/analytics-context';
import { useAnalyticsDashboardQuery } from '@features/analytics/hooks/use-analytics-dashboard';
import { ChartDataTable } from '@features/analytics/pages/chart-data-table';
import { selectResolvedTimeRange } from '@features/analytics/store';
import type { ChartModel } from '@features/analytics/types';
import { Stack } from '@shared/ui/layout/stack';

const WORKSPACE_KPI_IDS = [
  'workspace_health',
  'productivity_score',
  'task_velocity',
  'avg_resolution',
] as const;

const legendItems = (model: ChartModel) =>
  model.series.map((series) => ({ id: series.id, label: series.name }));

export const AnalyticsWorkspacePage = (): ReactElement => {
  const { workspaceId } = useAnalyticsContext();
  const query = useAnalyticsDashboardQuery(workspaceId);
  const timeRange = query.data?.timeRange ?? selectResolvedTimeRange();

  if (!workspaceId) {
    return (
      <AnalyticsEmptyState
        title="Select a workspace"
        description="Choose a workspace to view workspace analytics."
      />
    );
  }

  if (query.isLoading && !query.data) {
    return (
      <Stack gap={24} data-testid="analytics-workspace-page">
        <AnalyticsHeader title="Workspace analytics" timeRange={timeRange} />
        <AnalyticsSkeleton />
      </Stack>
    );
  }

  if (query.isError && !query.data) {
    return (
      <Stack gap={24} data-testid="analytics-workspace-page">
        <AnalyticsHeader title="Workspace analytics" timeRange={timeRange} />
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
      <Stack gap={24} data-testid="analytics-workspace-page">
        <AnalyticsHeader title="Workspace analytics" timeRange={timeRange} />
        <AnalyticsEmptyState />
      </Stack>
    );
  }

  const kpis = WORKSPACE_KPI_IDS.map((id) => snapshot.kpis.find((kpi) => kpi.id === id)).filter(
    Boolean,
  );

  return (
    <Stack gap={24} data-testid="analytics-workspace-page">
      <AnalyticsHeader
        title="Workspace analytics"
        timeRange={snapshot.timeRange}
        refreshing={query.isFetching}
        onRefresh={() => {
          void query.refetch();
        }}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((metric) => (metric ? <MetricCard key={metric.id} metric={metric} /> : null))}
      </div>

      <ChartCard
        title={snapshot.productivityTrend.title}
        description={snapshot.productivityTrend.description}
        legend={<ChartLegend items={legendItems(snapshot.productivityTrend)} />}
        table={<ChartDataTable model={snapshot.productivityTrend} />}
      >
        <LineChart model={snapshot.productivityTrend} />
      </ChartCard>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <ChartCard title="Project ranking" description="Projects ordered by health and velocity.">
          <AnalyticsTable variant="project" rows={snapshot.projectRows} />
        </ChartCard>
        <ChartCard
          title="Member contribution"
          description="Assigned work and completion by member."
        >
          <AnalyticsTable variant="member" rows={snapshot.memberRows} />
        </ChartCard>
      </div>
    </Stack>
  );
};
