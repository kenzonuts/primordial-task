import type { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  AiInsightPanel,
  AnalyticsEmptyState,
  AnalyticsError,
  AnalyticsHeader,
  AnalyticsSkeleton,
  AnalyticsTable,
  ChartCard,
  ChartLegend,
  DonutChart,
  Heatmap,
  LineChart,
  MetricCard,
} from '@features/analytics/components';
import { useAnalyticsContext } from '@features/analytics/context/analytics-context';
import { useAnalyticsDashboardQuery } from '@features/analytics/hooks/use-analytics-dashboard';
import { ChartDataTable } from '@features/analytics/pages/chart-data-table';
import { selectResolvedTimeRange, useAnalyticsStore } from '@features/analytics/store';
import { ANALYTICS_ROUTES, type ChartModel } from '@features/analytics/types';
import { PROJECT_ROUTES, projectDetailPath } from '@features/project/types';
import { TASK_ROUTES } from '@features/task/types';
import { toast } from '@shared/ui/feedback/toast';
import { Stack } from '@shared/ui/layout/stack';

const legendItems = (model: ChartModel) =>
  model.series.map((series) => ({ id: series.id, label: series.name }));

const OVERVIEW_KPI_IDS = [
  'workspace_health',
  'active_projects',
  'completion_rate',
  'overdue_rate',
  'productivity_score',
] as const;

const handleMetricDrillDown = (
  metricId: string,
  navigate: ReturnType<typeof useNavigate>,
): void => {
  switch (metricId) {
    case 'workspace_health':
    case 'active_projects':
      toast.success('Opening projects');
      navigate(PROJECT_ROUTES.list);
      break;
    case 'completion_rate':
    case 'overdue_rate':
    case 'productivity_score':
    case 'task_velocity':
    case 'blocked_ratio':
      toast.success('Opening tasks');
      navigate(TASK_ROUTES.list);
      break;
    case 'focus_score':
    case 'avg_resolution':
      toast.success('Opening time analytics');
      navigate(ANALYTICS_ROUTES.time);
      break;
    default:
      toast.success('Opening analytics section');
      navigate(ANALYTICS_ROUTES.overview);
  }
};

export const AnalyticsOverviewPage = (): ReactElement => {
  const navigate = useNavigate();
  const { workspaceId } = useAnalyticsContext();
  const showAiPanel = useAnalyticsStore((state) => state.showAiPanel);
  const query = useAnalyticsDashboardQuery(workspaceId);
  const timeRange = query.data?.timeRange ?? selectResolvedTimeRange();

  if (!workspaceId) {
    return (
      <AnalyticsEmptyState
        title="Select a workspace"
        description="Choose a workspace to view analytics."
      />
    );
  }

  if (query.isLoading && !query.data) {
    return (
      <Stack gap={24} data-testid="analytics-overview-page">
        <AnalyticsHeader title="Analytics overview" timeRange={timeRange} />
        <AnalyticsSkeleton />
      </Stack>
    );
  }

  if (query.isError && !query.data) {
    return (
      <Stack gap={24} data-testid="analytics-overview-page">
        <AnalyticsHeader title="Analytics overview" timeRange={timeRange} />
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
      <Stack gap={24} data-testid="analytics-overview-page">
        <AnalyticsHeader title="Analytics overview" timeRange={timeRange} />
        <AnalyticsEmptyState />
      </Stack>
    );
  }

  const overviewKpis = OVERVIEW_KPI_IDS.map((id) =>
    snapshot.kpis.find((kpi) => kpi.id === id),
  ).filter(Boolean);

  const hasSignal =
    snapshot.kpis.some((kpi) => kpi.value != null) ||
    snapshot.projectRows.length > 0 ||
    snapshot.memberRows.length > 0;

  return (
    <Stack gap={24} data-testid="analytics-overview-page">
      <AnalyticsHeader
        title="Analytics overview"
        timeRange={snapshot.timeRange}
        refreshing={query.isFetching}
        onRefresh={() => {
          void query.refetch();
        }}
      />

      {!hasSignal ? (
        <AnalyticsEmptyState />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {overviewKpis.map((metric) =>
              metric ? (
                <MetricCard
                  key={metric.id}
                  metric={metric}
                  onClick={(id) => handleMetricDrillDown(id, navigate)}
                />
              ) : null,
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <ChartCard
              title={snapshot.productivityTrend.title}
              description={snapshot.productivityTrend.description}
              legend={<ChartLegend items={legendItems(snapshot.productivityTrend)} />}
              table={<ChartDataTable model={snapshot.productivityTrend} />}
            >
              <LineChart model={snapshot.productivityTrend} />
            </ChartCard>

            <ChartCard
              title={snapshot.projectHealthDistribution.title}
              description={snapshot.projectHealthDistribution.description}
              legend={<ChartLegend items={legendItems(snapshot.projectHealthDistribution)} />}
              table={<ChartDataTable model={snapshot.projectHealthDistribution} />}
            >
              <DonutChart model={snapshot.projectHealthDistribution} />
            </ChartCard>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <ChartCard
              title="Team workload"
              description="Assigned open-task load by member and day."
            >
              <Heatmap cells={snapshot.workloadHeatmap} />
            </ChartCard>

            {showAiPanel ? (
              <AiInsightPanel enabled placeholder={snapshot.aiInsightPlaceholder} />
            ) : (
              <AiInsightPanel enabled={false} />
            )}
          </div>

          <ChartCard title="Projects" description="Health, risk, and delivery signals by project.">
            <AnalyticsTable
              variant="project"
              rows={snapshot.projectRows}
              onRowClick={(row) => {
                toast.success(`Opening ${row.projectName}`);
                navigate(projectDetailPath(row.projectId));
              }}
            />
          </ChartCard>
        </>
      )}
    </Stack>
  );
};
