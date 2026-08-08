import type { ReactElement } from 'react';

import {
  AnalyticsEmptyState,
  AnalyticsError,
  AnalyticsHeader,
  AnalyticsSkeleton,
  BarChart,
  ChartCard,
  ChartLegend,
  DonutChart,
  LineChart,
  MetricCard,
} from '@features/analytics/components';
import { useAnalyticsContext } from '@features/analytics/context/analytics-context';
import { useAnalyticsDashboardQuery } from '@features/analytics/hooks/use-analytics-dashboard';
import { ChartDataTable } from '@features/analytics/pages/chart-data-table';
import { selectResolvedTimeRange } from '@features/analytics/store';
import type { ChartModel } from '@features/analytics/types';
import { Stack } from '@shared/ui/layout/stack';
import { Text } from '@shared/ui/typography/text';

const TASK_KPI_IDS = ['completion_rate', 'task_velocity', 'overdue_rate', 'blocked_ratio'] as const;

const legendItems = (model: ChartModel) =>
  model.series.map((series) => ({ id: series.id, label: series.name }));

export const AnalyticsTasksPage = (): ReactElement => {
  const { workspaceId } = useAnalyticsContext();
  const query = useAnalyticsDashboardQuery(workspaceId);
  const timeRange = query.data?.timeRange ?? selectResolvedTimeRange();

  if (!workspaceId) {
    return (
      <AnalyticsEmptyState
        title="Select a workspace"
        description="Choose a workspace to view task analytics."
      />
    );
  }

  if (query.isLoading && !query.data) {
    return (
      <Stack gap={24} data-testid="analytics-tasks-page">
        <AnalyticsHeader title="Task analytics" timeRange={timeRange} />
        <AnalyticsSkeleton />
      </Stack>
    );
  }

  if (query.isError && !query.data) {
    return (
      <Stack gap={24} data-testid="analytics-tasks-page">
        <AnalyticsHeader title="Task analytics" timeRange={timeRange} />
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
      <Stack gap={24} data-testid="analytics-tasks-page">
        <AnalyticsHeader title="Task analytics" timeRange={timeRange} />
        <AnalyticsEmptyState />
      </Stack>
    );
  }

  const kpis = TASK_KPI_IDS.map((id) => snapshot.kpis.find((kpi) => kpi.id === id)).filter(Boolean);

  return (
    <Stack gap={24} data-testid="analytics-tasks-page">
      <AnalyticsHeader
        title="Task analytics"
        timeRange={snapshot.timeRange}
        refreshing={query.isFetching}
        onRefresh={() => {
          void query.refetch();
        }}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((metric) => (metric ? <MetricCard key={metric.id} metric={metric} /> : null))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard
          title={snapshot.statusDistribution.title}
          description={snapshot.statusDistribution.description}
          legend={<ChartLegend items={legendItems(snapshot.statusDistribution)} />}
          table={<ChartDataTable model={snapshot.statusDistribution} />}
        >
          <BarChart model={snapshot.statusDistribution} />
        </ChartCard>

        <ChartCard
          title={snapshot.priorityDistribution.title}
          description={snapshot.priorityDistribution.description}
          legend={<ChartLegend items={legendItems(snapshot.priorityDistribution)} />}
          table={<ChartDataTable model={snapshot.priorityDistribution} />}
        >
          <DonutChart model={snapshot.priorityDistribution} />
        </ChartCard>
      </div>

      <ChartCard
        title="Throughput"
        description="Completed vs created tasks over the selected range."
        legend={<ChartLegend items={legendItems(snapshot.productivityTrend)} />}
        table={<ChartDataTable model={snapshot.productivityTrend} />}
      >
        <LineChart model={snapshot.productivityTrend} />
      </ChartCard>

      <Text as="p" variant="caption" muted>
        Cycle-time and lead-time scatterplots require status-history events and will arrive with the
        history aggregation layer.
      </Text>
    </Stack>
  );
};
