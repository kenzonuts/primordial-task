import type { ChartModel } from '@features/analytics/types';

export const CHART_AXIS_STROKE = '#525252';
export const CHART_GRID_STROKE = '#333333';
export const CHART_TICK_FILL = '#858585';

export type CartesianRow = {
  readonly key: string;
  readonly label: string;
  readonly [seriesId: string]: string | number;
};

/** Pivot ChartModel series into Recharts cartesian rows. */
export const toCartesianRows = (model: ChartModel): CartesianRow[] => {
  const map = new Map<string, CartesianRow>();

  for (const series of model.series) {
    for (const point of series.points) {
      const existing = map.get(point.key);
      if (existing) {
        (existing as Record<string, string | number>)[series.id] = point.value;
      } else {
        map.set(point.key, {
          key: point.key,
          label: point.label,
          [series.id]: point.value,
        });
      }
    }
  }

  return Array.from(map.values());
};

export const chartTableFromModel = (model: ChartModel) => model.tableRows;
