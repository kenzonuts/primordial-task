import type { ReactElement } from 'react';

import type { DashboardActivityItem } from '@features/dashboard/types';
import { Inline } from '@shared/ui/layout/inline';
import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import { Text } from '@shared/ui/typography/text';

type ActivityItemProps = {
  readonly item: DashboardActivityItem;
  readonly className?: string;
};

export const ActivityItem = ({ item, className }: ActivityItemProps): ReactElement => {
  return (
    <Stack gap={2} className={cn('min-w-0', className)}>
      <Text as="p" variant="body-sm" className="min-w-0">
        <Text as="span" variant="body-sm" className="font-medium">
          {item.actor}
        </Text>{' '}
        <Text as="span" variant="body-sm" muted>
          {item.action}
        </Text>{' '}
        <Text as="span" variant="body-sm">
          {item.target}
        </Text>
      </Text>
      <Inline gap={8} align="center">
        <Text as="time" variant="caption" muted>
          {item.timestampLabel}
        </Text>
      </Inline>
    </Stack>
  );
};

export type { ActivityItemProps };
