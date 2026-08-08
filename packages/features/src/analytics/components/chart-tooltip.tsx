import type { ReactElement } from 'react';

import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import { Text } from '@shared/ui/typography/text';

type TooltipEntry = {
  readonly name?: string | number;
  readonly value?: unknown;
  readonly color?: string;
  readonly dataKey?: string | number;
};

type ChartTooltipProps = {
  readonly active?: boolean;
  // Recharts TooltipPayload is structurally compatible at runtime
  readonly payload?: ReadonlyArray<TooltipEntry> | null;
  readonly label?: string | number;
  readonly className?: string;
};

const formatValue = (value: unknown): string => {
  if (value == null) {
    return '—';
  }
  if (Array.isArray(value)) {
    return value.map(String).join(', ');
  }
  return String(value);
};

/**
 * Monochrome Recharts tooltip content.
 * Use via `<Tooltip content={(props) => <ChartTooltip {...props} />} />`.
 */
export const ChartTooltip = ({
  active,
  payload,
  label,
  className,
}: ChartTooltipProps): ReactElement | null => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'rounded-md border border-border-default bg-surface-elevated px-2.5 py-2 shadow-popover',
        className,
      )}
      role="tooltip"
    >
      <Stack gap={4}>
        {label != null && label !== '' ? (
          <Text as="p" variant="caption" muted className="tabular-nums">
            {String(label)}
          </Text>
        ) : null}
        {payload.map((entry) => (
          <div key={String(entry.dataKey ?? entry.name)} className="flex items-center gap-2">
            <span
              className="size-2 shrink-0 rounded-sm"
              style={{ backgroundColor: entry.color ?? '#A3A3A3' }}
              aria-hidden="true"
            />
            <Text as="span" variant="caption" className="text-text-secondary">
              {entry.name == null ? '' : String(entry.name)}
            </Text>
            <Text as="span" variant="mono" className="ml-auto tabular-nums text-text-primary">
              {formatValue(entry.value)}
            </Text>
          </div>
        ))}
      </Stack>
    </div>
  );
};

export type { ChartTooltipProps, TooltipEntry };
