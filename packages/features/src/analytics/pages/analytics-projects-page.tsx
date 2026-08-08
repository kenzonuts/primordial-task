import type { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  AnalyticsEmptyState,
  AnalyticsError,
  AnalyticsHeader,
  AnalyticsSkeleton,
  AnalyticsTable,
  ChartCard,
  ChartLegend,
  DonutChart,
  MetricCard,
} from '@features/analytics/components';
import { useAnalyticsContext } from '@features/analytics/context/analytics-context';
import { useAnalyticsDashboardQuery } from '@features/analytics/hooks/use-analytics-dashboard';
import { ChartDataTable } from '@features/analytics/pages/chart-data-table';
import { selectResolvedTimeRange } from '@features/analytics/store';
import type { ChartModel } from '@features/analytics/types';
import { projectDetailPath } from '@features/project/types';
import { toast } from '@shared/ui/feedback/toast';
import { Stack } from '@shared/ui/layout/stack';

const PROJECT_KPI_IDS = ['active_projects', 'workspace_health', 'blocked_ratio'] as const;

const legendItems = (model: ChartModel) =>
  model.series.map((series) => ({ id: series.id, label: series.name }));

export const AnalyticsProjectsPage = (): ReactElement => {
  const navigate = useNavigate();
  const { workspaceId } = useAnalyticsContext();
  const query = useAnalyticsDashboardQuery(workspaceId);
  const timeRange = query.data?.timeRange ?? selectResolvedTimeRange();

  if (!workspaceId) {
    return (
      <AnalyticsEmptyState
        title="Select a workspace"
        description="Choose a workspace to view project analytics."
      />
    );
  }

  if (query.isLoading && !query.data) {
    return (
      <Stack gap={24} data-testid="analytics-projects-page">
        <AnalyticsHeader title="Project analytics" timeRange={timeRange} />
        <AnalyticsSkeleton />
      </Stack>
    );
  }

  if (query.isError && !query.data) {
    return (
      <Stack gap={24} data-testid="analytics-projects-page">
        <AnalyticsHeader title="Project analytics" timeRange={timeRange} />
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
      <Stack gap={24} data-testid="analytics-projects-page">
        <AnalyticsHeader title="Project analytics" timeRange={timeRange} />
        <AnalyticsEmptyState />
      </Stack>
    );
  }

  const kpis = PROJECT_KPI_IDS.map((id) => snapshot.kpis.find((kpi) => kpi.id === id)).filter(
    Boolean,
  );

  return (
    <Stack gap={24} data-testid="analytics-projects-page">
      <AnalyticsHeader
        title="Project analytics"
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
        title={snapshot.projectHealthDistribution.title}
        description={snapshot.projectHealthDistribution.description}
        legend={<ChartLegend items={legendItems(snapshot.projectHealthDistribution)} />}
        table={<ChartDataTable model={snapshot.projectHealthDistribution} />}
      >
        <DonutChart model={snapshot.projectHealthDistribution} />
      </ChartCard>

      <ChartCard title="Project health & risk" description="Progress, health, and risk by project.">
        <AnalyticsTable
          variant="project"
          rows={snapshot.projectRows}
          onRowClick={(row) => {
            toast.success(`Opening ${row.projectName}`);
            navigate(projectDetailPath(row.projectId));
          }}
        />
      </ChartCard>
    </Stack>
  );
};
