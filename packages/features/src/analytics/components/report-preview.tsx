import type { ReactElement, ReactNode } from 'react';

import type { SavedReport } from '@features/analytics/types';
import type { AnalyticsTimeRange } from '@features/analytics/types';
import { formatRangeLabel, TIME_RANGE_LABELS } from '@features/analytics/utils/time-range';
import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import { Separator } from '@shared/ui/primitives/separator';
import { Heading } from '@shared/ui/typography/heading';
import { Text } from '@shared/ui/typography/text';

type ReportPreviewProps = {
  readonly report: Pick<
    SavedReport,
    'name' | 'description' | 'section' | 'chartIds' | 'timeRangePreset'
  >;
  readonly timeRange?: AnalyticsTimeRange;
  readonly children?: ReactNode;
  readonly className?: string;
};

export const ReportPreview = ({
  report,
  timeRange,
  children,
  className,
}: ReportPreviewProps): ReactElement => {
  const rangeLabel = timeRange
    ? `${TIME_RANGE_LABELS[timeRange.preset]} · ${formatRangeLabel(timeRange)}`
    : TIME_RANGE_LABELS[report.timeRangePreset];

  return (
    <article
      className={cn(
        'rounded-lg border border-border-default bg-surface-card p-6 shadow-sm print:border-0 print:shadow-none',
        className,
      )}
      aria-label={`Report preview: ${report.name}`}
    >
      <Stack gap={16}>
        <header>
          <Heading level={2}>{report.name}</Heading>
          {report.description ? (
            <Text as="p" variant="body-sm" muted className="mt-1">
              {report.description}
            </Text>
          ) : null}
          <Text as="p" variant="caption" muted className="mt-2 tabular-nums">
            {report.section} · {rangeLabel} · {report.chartIds.length} charts
          </Text>
        </header>
        <Separator />
        <div className="space-y-4">
          {children ?? (
            <Text as="p" variant="body-sm" muted>
              Select charts in the builder to populate this preview.
            </Text>
          )}
        </div>
      </Stack>
    </article>
  );
};

export type { ReportPreviewProps };
