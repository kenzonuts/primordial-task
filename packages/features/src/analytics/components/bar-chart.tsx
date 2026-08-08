import type { ReactElement } from 'react';
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { CHART_SERIES_COLORS } from '@features/analytics/components/chart-legend';
import {
  CHART_AXIS_STROKE,
  CHART_GRID_STROKE,
  CHART_TICK_FILL,
  toCartesianRows,
} from '@features/analytics/components/chart-model-utils';
import { ChartTooltip } from '@features/analytics/components/chart-tooltip';
import type { ChartTooltipProps } from '@features/analytics/components/chart-tooltip';
import type { ChartModel } from '@features/analytics/types';
import { cn } from '@shared/ui/lib/cn';

type AnalyticsBarChartProps = {
  readonly model: ChartModel;
  readonly height?: number;
  readonly stacked?: boolean;
  readonly className?: string;
};

export const AnalyticsBarChart = ({
  model,
  height = 280,
  stacked,
  className,
}: AnalyticsBarChartProps): ReactElement => {
  const data = toCartesianRows(model);
  const isStacked = stacked ?? model.type === 'stacked_bar';

  return (
    <div
      className={cn('w-full', className)}
      role="img"
      aria-label={`${model.title}. ${model.description}`}
    >
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={CHART_GRID_STROKE} strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: CHART_TICK_FILL, fontSize: 11 }}
            axisLine={{ stroke: CHART_AXIS_STROKE }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: CHART_TICK_FILL, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip
            content={(props) => (
              <ChartTooltip
                active={props.active}
                label={props.label}
                payload={props.payload as ChartTooltipProps['payload']}
              />
            )}
            cursor={{ fill: 'rgba(255,255,255,0.04)' }}
          />
          {model.series.map((series, index) => (
            <Bar
              key={series.id}
              dataKey={series.id}
              name={series.name}
              fill={CHART_SERIES_COLORS[index % CHART_SERIES_COLORS.length]}
              stackId={isStacked ? 'stack' : undefined}
              radius={isStacked ? 0 : [2, 2, 0, 0]}
              isAnimationActive={false}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export { AnalyticsBarChart as BarChart };
export type { AnalyticsBarChartProps as BarChartProps };
