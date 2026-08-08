import type { ReactElement } from 'react';
import { useMemo, useState } from 'react';

import {
  AnalyticsEmptyState,
  AnalyticsHeader,
  ReportBuilder,
  ReportCard,
  ReportPreview,
  type ReportBuilderConfig,
} from '@features/analytics/components';
import { useAnalyticsContext } from '@features/analytics/context/analytics-context';
import {
  selectResolvedTimeRange,
  useAnalyticsFilterStore,
  useAnalyticsReportStore,
  useAnalyticsTimeRangeStore,
} from '@features/analytics/store';
import type { AnalyticsSection } from '@features/analytics/types';
import { toast } from '@shared/ui/feedback/toast';
import { Inline } from '@shared/ui/layout/inline';
import { Stack } from '@shared/ui/layout/stack';
import { Button } from '@shared/ui/primitives/button';
import { Text } from '@shared/ui/typography/text';

const CHART_OPTIONS = [
  { id: 'productivity_trend', label: 'Productivity trend' },
  { id: 'project_health', label: 'Project health' },
  { id: 'status_distribution', label: 'Status distribution' },
  { id: 'priority_distribution', label: 'Priority distribution' },
] as const;

export const AnalyticsReportsPage = (): ReactElement => {
  const { workspaceId } = useAnalyticsContext();
  const reports = useAnalyticsReportStore((state) => state.reports);
  const addReport = useAnalyticsReportStore((state) => state.addReport);
  const toggleFavorite = useAnalyticsReportStore((state) => state.toggleFavorite);
  const togglePinned = useAnalyticsReportStore((state) => state.togglePinned);
  const removeReport = useAnalyticsReportStore((state) => state.removeReport);
  const filters = useAnalyticsFilterStore((state) => state.filters);
  const preset = useAnalyticsTimeRangeStore((state) => state.preset);
  const timeRange = selectResolvedTimeRange();

  const [builder, setBuilder] = useState<ReportBuilderConfig>({
    name: '',
    chartIds: ['productivity_trend'],
  });
  const [previewId, setPreviewId] = useState<string | null>(reports[0]?.id ?? null);

  const preview = useMemo(
    () => reports.find((report) => report.id === previewId) ?? reports[0] ?? null,
    [previewId, reports],
  );

  if (!workspaceId) {
    return (
      <AnalyticsEmptyState
        title="Select a workspace"
        description="Choose a workspace to manage analytics reports."
      />
    );
  }

  return (
    <Stack gap={24} data-testid="analytics-reports-page">
      <AnalyticsHeader title="Reports" timeRange={timeRange} />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <Stack gap={16}>
          <ReportBuilder
            value={builder}
            chartOptions={[...CHART_OPTIONS]}
            onChange={setBuilder}
            onSubmit={(config) => {
              addReport({
                name: config.name.trim(),
                description: `Saved from analytics · ${config.chartIds.length} charts`,
                section: 'reports' as AnalyticsSection,
                filters: { ...filters, workspaceId },
                timeRangePreset: preset,
                chartIds: config.chartIds,
                favorite: false,
                pinned: false,
              });
              setBuilder({ name: '', chartIds: ['productivity_trend'] });
              toast.success('Report saved');
            }}
          />

          <Stack gap={12}>
            <Text as="p" variant="label" muted>
              Saved reports
            </Text>
            {reports.length === 0 ? (
              <AnalyticsEmptyState
                title="No saved reports"
                description="Build a report to pin delivery snapshots for stakeholders."
              />
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1">
                {reports.map((report) => (
                  <Stack key={report.id} gap={8}>
                    <ReportCard
                      report={report}
                      onOpen={(id) => {
                        setPreviewId(id);
                      }}
                    />
                    <Inline gap={8} align="center">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleFavorite(report.id)}
                      >
                        {report.favorite ? 'Unfavorite' : 'Favorite'}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => togglePinned(report.id)}
                      >
                        {report.pinned ? 'Unpin' : 'Pin'}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          removeReport(report.id);
                          if (previewId === report.id) {
                            setPreviewId(null);
                          }
                          toast.success('Report removed');
                        }}
                      >
                        Delete
                      </Button>
                    </Inline>
                  </Stack>
                ))}
              </div>
            )}
          </Stack>
        </Stack>

        {preview ? (
          <ReportPreview report={preview} timeRange={timeRange}>
            <Text as="p" variant="body-sm" muted>
              Charts included: {preview.chartIds.join(', ') || 'none'}. Export from the analytics
              toolbar to download the current dashboard snapshot with matching filters.
            </Text>
          </ReportPreview>
        ) : (
          <ReportPreview
            report={{
              name: builder.name || 'Untitled report',
              description: 'Preview updates as you configure the builder.',
              section: 'reports',
              chartIds: builder.chartIds,
              timeRangePreset: preset,
            }}
            timeRange={timeRange}
          />
        )}
      </div>
    </Stack>
  );
};
