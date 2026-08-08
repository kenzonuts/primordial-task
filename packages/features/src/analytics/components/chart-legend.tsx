import type { ReactElement } from 'react';

import { Inline } from '@shared/ui/layout/inline';
import { cn } from '@shared/ui/lib/cn';
import { Text } from '@shared/ui/typography/text';

/** Monochrome series palette (luminosity only). */
export const CHART_SERIES_COLORS = ['#E6E6E6', '#A3A3A3', '#737373', '#525252'] as const;

type ChartLegendItem = {
  readonly id: string;
  readonly label: string;
  readonly color?: string;
};

type ChartLegendProps = {
  readonly items: readonly ChartLegendItem[];
  readonly className?: string;
};

export const ChartLegend = ({ items, className }: ChartLegendProps): ReactElement => {
  return (
    <Inline
      gap={12}
      align="center"
      wrap
      role="list"
      aria-label="Chart legend"
      className={cn(className)}
    >
      {items.map((item, index) => {
        const color = item.color ?? CHART_SERIES_COLORS[index % CHART_SERIES_COLORS.length]!;
        return (
          <Inline key={item.id} gap={6} align="center" role="listitem">
            <span
              className="size-2.5 shrink-0 rounded-sm"
              style={{ backgroundColor: color }}
              aria-hidden="true"
            />
            <Text as="span" variant="caption" muted>
              {item.label}
            </Text>
          </Inline>
        );
      })}
    </Inline>
  );
};

export type { ChartLegendProps, ChartLegendItem };
