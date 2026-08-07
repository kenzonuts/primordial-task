import type { ReactElement } from 'react';

import type { DashboardInsight } from '@features/dashboard/types';
import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import { Text } from '@shared/ui/typography/text';

type InsightCardProps = {
  readonly insight: DashboardInsight;
  readonly className?: string;
};

export const InsightCard = ({ insight, className }: InsightCardProps): ReactElement => {
  return (
    <div
      className={cn(
        'rounded-lg border border-border-default bg-surface-card p-3 shadow-sm',
        className,
      )}
    >
      <Stack gap={4}>
        <Text as="p" variant="caption" muted>
          {insight.label}
        </Text>
        <Text as="p" variant="h3" className="tabular-nums tracking-tight">
          {insight.value}
        </Text>
        <Text as="p" variant="caption" muted>
          {insight.hint}
        </Text>
      </Stack>
    </div>
  );
};

export type { InsightCardProps };
