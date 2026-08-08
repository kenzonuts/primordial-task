import type { ReactElement } from 'react';
import type { TooltipContentProps } from 'recharts';

import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import { Text } from '@shared/ui/typography/text';

type ChartTooltipProps = TooltipContentProps<number, string> & {
  readonly className?: string;
};

/**
 * Monochrome Recharts tooltip content.
 * Pass as `<Tooltip content={<ChartTooltip />} />` or `content={ChartTooltip}`.
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
          <div key={String(entry.dataKey)} className="flex items-center gap-2">
            <span
              className="size-2 shrink-0 rounded-sm"
              style={{ backgroundColor: String(entry.color ?? '#A3A3A3') }}
              aria-hidden="true"
            />
            <Text as="span" variant="caption" className="text-text-secondary">
              {entry.name}
            </Text>
            <Text as="span" variant="mono" className="ml-auto tabular-nums text-text-primary">
              {entry.value == null ? '—' : String(entry.value)}
            </Text>
          </div>
        ))}
      </Stack>
    </div>
  );
};

export type { ChartTooltipProps };
