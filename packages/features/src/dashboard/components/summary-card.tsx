import type { ReactElement, ReactNode } from 'react';

import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import { Text } from '@shared/ui/typography/text';

type SummaryCardProps = {
  readonly label: string;
  readonly value: ReactNode;
  readonly hint?: string;
  readonly className?: string;
};

export const SummaryCard = ({ label, value, hint, className }: SummaryCardProps): ReactElement => {
  return (
    <div
      className={cn(
        'min-w-0 rounded-lg border border-border-default bg-surface-card px-3 py-2.5 shadow-sm',
        className,
      )}
    >
      <Stack gap={4}>
        <Text as="p" variant="caption" muted>
          {label}
        </Text>
        <Text as="p" variant="h3" className="tabular-nums tracking-tight">
          {value}
        </Text>
        {hint ? (
          <Text as="p" variant="caption" muted truncate>
            {hint}
          </Text>
        ) : null}
      </Stack>
    </div>
  );
};

export type { SummaryCardProps };
