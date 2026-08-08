import { ArrowDown, ArrowRight, ArrowUp, Minus } from 'lucide-react';
import type { ReactElement } from 'react';

import type { MetricComparison as MetricComparisonModel } from '@features/analytics/types';
import { Inline } from '@shared/ui/layout/inline';
import { cn } from '@shared/ui/lib/cn';
import { Text } from '@shared/ui/typography/text';

type MetricComparisonProps = {
  readonly comparison: MetricComparisonModel;
  readonly className?: string;
};

const formatSigned = (value: number, suffix = ''): string => {
  const abs = Math.abs(value);
  const formatted = Number.isInteger(abs) ? String(abs) : abs.toFixed(1);
  const sign = value > 0 ? '+' : value < 0 ? '−' : '';
  return `${sign}${formatted}${suffix}`;
};

export const MetricComparison = ({
  comparison,
  className,
}: MetricComparisonProps): ReactElement => {
  const { direction, percentChange, absoluteChange } = comparison;

  if (direction === 'na' || (percentChange === null && absoluteChange === null)) {
    return (
      <Inline
        gap={4}
        align="center"
        className={cn('text-text-muted', className)}
        aria-label="No comparison available"
      >
        <Minus className="size-3.5 shrink-0" aria-hidden="true" />
        <Text as="span" variant="caption" muted>
          n/a
        </Text>
      </Inline>
    );
  }

  const label =
    percentChange !== null ? formatSigned(percentChange, '%') : formatSigned(absoluteChange ?? 0);

  const Icon = direction === 'up' ? ArrowUp : direction === 'down' ? ArrowDown : ArrowRight;

  const tone =
    direction === 'up'
      ? 'text-text-primary'
      : direction === 'down'
        ? 'text-text-secondary'
        : 'text-text-muted';

  return (
    <Inline gap={4} align="center" className={cn(tone, className)} aria-label={`Change ${label}`}>
      <Icon className="size-3.5 shrink-0" aria-hidden="true" />
      <Text as="span" variant="caption" className={cn('tabular-nums', tone)}>
        {label}
      </Text>
    </Inline>
  );
};

export type { MetricComparisonProps };
