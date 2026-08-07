import type { ReactElement, ReactNode } from 'react';

import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import { Text } from '@shared/ui/typography/text';

type StatisticCardProps = {
  readonly label: string;
  readonly value: ReactNode;
  readonly hint?: string;
  readonly className?: string;
};

export const StatisticCard = ({
  label,
  value,
  hint,
  className,
}: StatisticCardProps): ReactElement => {
  return (
    <div
      className={cn(
        'rounded-lg border border-border-default bg-surface-card p-4 shadow-sm',
        className,
      )}
    >
      <Stack gap={8}>
        <Text as="p" variant="label" muted>
          {label}
        </Text>
        <Text as="p" variant="h2" className="tabular-nums tracking-tight">
          {value}
        </Text>
        {hint ? (
          <Text as="p" variant="body-sm" muted>
            {hint}
          </Text>
        ) : null}
      </Stack>
    </div>
  );
};

export type { StatisticCardProps };
