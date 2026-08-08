import type { ReactElement } from 'react';

import type { ChartModel } from '@features/analytics/types';
import { Text } from '@shared/ui/typography/text';

type ChartDataTableProps = {
  readonly model: ChartModel;
};

/** Accessible tabular alternative for chart series (used with ChartCard toggle). */
export const ChartDataTable = ({ model }: ChartDataTableProps): ReactElement => {
  if (model.tableRows.length === 0) {
    return (
      <Text as="p" variant="body-sm" muted>
        No tabular data for this chart.
      </Text>
    );
  }

  const seriesNames = model.series.map((series) => series.name);

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[320px] border-collapse text-left" aria-label={model.title}>
        <thead>
          <tr className="border-b border-border-subtle">
            <th scope="col" className="px-2 py-2">
              <Text as="span" variant="caption" muted className="uppercase tracking-wide">
                Label
              </Text>
            </th>
            {seriesNames.map((name) => (
              <th key={name} scope="col" className="px-2 py-2">
                <Text as="span" variant="caption" muted className="uppercase tracking-wide">
                  {name}
                </Text>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {model.tableRows.map((row) => (
            <tr key={row.label} className="border-b border-border-subtle last:border-0">
              <td className="px-2 py-2">
                <Text as="span" variant="body-sm">
                  {row.label}
                </Text>
              </td>
              {row.values.map((value, index) => (
                <td
                  key={`${row.label}-${index}`}
                  className="px-2 py-2 tabular-nums text-text-secondary"
                >
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
