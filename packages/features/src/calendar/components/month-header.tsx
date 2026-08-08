import type { ReactElement } from 'react';

import { WEEKDAY_LABELS_MON, WEEKDAY_LABELS_SHORT } from '@features/calendar/constants';
import { cn } from '@shared/ui/lib/cn';
import { Text } from '@shared/ui/typography/text';

type MonthHeaderProps = {
  readonly weekStartsOn?: 0 | 1;
  readonly className?: string;
};

export const MonthHeader = ({ weekStartsOn = 1, className }: MonthHeaderProps): ReactElement => {
  const labels = weekStartsOn === 1 ? WEEKDAY_LABELS_MON : WEEKDAY_LABELS_SHORT;

  return (
    <div
      role="row"
      className={cn(
        'grid grid-cols-7 border-b border-border-default bg-surface-elevated',
        className,
      )}
    >
      {labels.map((label) => (
        <div
          key={label}
          role="columnheader"
          className="flex h-8 items-center justify-center border-r border-border-subtle last:border-r-0"
        >
          <Text as="span" variant="caption" muted className="uppercase tracking-wide font-medium">
            {label}
          </Text>
        </div>
      ))}
    </div>
  );
};

export type { MonthHeaderProps };
