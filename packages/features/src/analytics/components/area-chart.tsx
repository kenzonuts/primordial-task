import type { ReactElement } from 'react';
import {
  Area,
  AreaChart as RechartsAreaChart,
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

type AnalyticsAreaChartProps = {
  readonly model: ChartModel;
  readonly height?: number;
  readonly className?: string;
};

export const AnalyticsAreaChart = ({
  model,
  height = 280,
  className,
}: AnalyticsAreaChartProps): ReactElement => {
  const data = toCartesianRows(model);

  return (
    <div
      className={cn('w-full', className)}
      role="img"
      aria-label={`${model.title}. ${model.description}`}
    >
      <ResponsiveContainer width="100%" height={height}>
        <RechartsAreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
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
            cursor={{ stroke: CHART_AXIS_STROKE }}
          />
          {model.series.map((series, index) => {
            const color = CHART_SERIES_COLORS[index % CHART_SERIES_COLORS.length]!;
            return (
              <Area
                key={series.id}
                type="monotone"
                dataKey={series.id}
                name={series.name}
                stroke={color}
                fill={color}
                fillOpacity={0.18}
                strokeWidth={2}
                isAnimationActive={false}
              />
            );
          })}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export { AnalyticsAreaChart as AreaChart };
export type { AnalyticsAreaChartProps as AreaChartProps };
