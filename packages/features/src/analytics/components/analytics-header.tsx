import { RefreshCw } from 'lucide-react';
import type { ReactElement, ReactNode } from 'react';

import type { AnalyticsTimeRange } from '@features/analytics/types';
import { formatRangeLabel, TIME_RANGE_LABELS } from '@features/analytics/utils/time-range';
import { Inline } from '@shared/ui/layout/inline';
import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import { Button } from '@shared/ui/primitives/button';
import { Heading } from '@shared/ui/typography/heading';
import { Text } from '@shared/ui/typography/text';

type AnalyticsHeaderProps = {
  readonly title: string;
  readonly timeRange: AnalyticsTimeRange;
  readonly onRefresh?: () => void;
  readonly refreshing?: boolean;
  readonly actions?: ReactNode;
  readonly className?: string;
};

export const AnalyticsHeader = ({
  title,
  timeRange,
  onRefresh,
  refreshing = false,
  actions,
  className,
}: AnalyticsHeaderProps): ReactElement => {
  const rangeText = `${TIME_RANGE_LABELS[timeRange.preset]} · ${formatRangeLabel(timeRange)}`;

  return (
    <Inline gap={16} align="start" justify="between" className={cn('w-full', className)}>
      <Stack gap={4} className="min-w-0 flex-1">
        <Heading level={1} className="truncate">
          {title}
        </Heading>
        <Text as="p" variant="body-sm" muted className="tabular-nums">
          {rangeText}
        </Text>
      </Stack>
      <Inline gap={8} align="center" className="shrink-0">
        {actions}
        {onRefresh ? (
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={onRefresh}
            loading={refreshing}
            leftIcon={<RefreshCw className="size-3.5" aria-hidden="true" />}
            aria-label="Refresh analytics"
          >
            Refresh
          </Button>
        ) : null}
      </Inline>
    </Inline>
  );
};

export type { AnalyticsHeaderProps };
