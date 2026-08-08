import type { ReactElement } from 'react';
import { Cell, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip } from 'recharts';

import { CHART_SERIES_COLORS } from '@features/analytics/components/chart-legend';
import { ChartTooltip } from '@features/analytics/components/chart-tooltip';
import type { ChartTooltipProps } from '@features/analytics/components/chart-tooltip';
import type { ChartModel } from '@features/analytics/types';
import { cn } from '@shared/ui/lib/cn';

type AnalyticsDonutChartProps = {
  readonly model: ChartModel;
  readonly height?: number;
  readonly innerRadius?: number | string;
  readonly outerRadius?: number | string;
  readonly className?: string;
};

export const AnalyticsDonutChart = ({
  model,
  height = 280,
  innerRadius = '58%',
  outerRadius = '80%',
  className,
}: AnalyticsDonutChartProps): ReactElement => {
  const series = model.series[0];
  const data =
    series?.points.map((point) => ({
      key: point.key,
      name: point.label,
      value: point.value,
    })) ?? [];

  return (
    <div
      className={cn('w-full', className)}
      role="img"
      aria-label={`${model.title}. ${model.description}`}
    >
      <ResponsiveContainer width="100%" height={height}>
        <RechartsPieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            isAnimationActive={false}
          >
            {data.map((entry, index) => (
              <Cell
                key={entry.key}
                fill={CHART_SERIES_COLORS[index % CHART_SERIES_COLORS.length]}
                stroke="#1F1F1F"
                strokeWidth={1}
              />
            ))}
          </Pie>
          <Tooltip
            content={(props) => (
              <ChartTooltip
                active={props.active}
                label={props.label}
                payload={props.payload as ChartTooltipProps['payload']}
              />
            )}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};

export { AnalyticsDonutChart as DonutChart };
export type { AnalyticsDonutChartProps as DonutChartProps };
