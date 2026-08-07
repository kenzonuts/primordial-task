import type { ReactElement } from 'react';

import type { TaskActivityItem } from '@features/task/types';
import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import { Text } from '@shared/ui/typography/text';

type TaskActivityProps = {
  readonly items: readonly TaskActivityItem[];
  readonly emptyMessage?: string;
  readonly className?: string;
};

export const TaskActivity = ({
  items,
  emptyMessage = 'No activity yet.',
  className,
}: TaskActivityProps): ReactElement => {
  if (items.length === 0) {
    return (
      <Text as="p" variant="caption" muted className={className}>
        {emptyMessage}
      </Text>
    );
  }

  return (
    <ol aria-label="Task activity" className={cn('flex flex-col', className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <li key={item.id} className="relative flex gap-12 pb-16 last:pb-0">
            <div className="relative flex w-3 shrink-0 justify-center" aria-hidden="true">
              <span className="mt-1.5 size-2 rounded-full bg-border-strong" />
              {!isLast ? <span className="absolute top-4 bottom-0 w-px bg-border-subtle" /> : null}
            </div>
            <Stack gap={2} className="min-w-0 flex-1">
              <Text as="p" variant="body-sm">
                <span className="font-medium text-text-primary">{item.actor}</span>{' '}
                <span className="text-text-secondary">{item.action}</span>{' '}
                <span className="text-text-primary">{item.target}</span>
              </Text>
              <Text as="span" variant="caption" muted>
                {item.timestampLabel}
              </Text>
            </Stack>
          </li>
        );
      })}
    </ol>
  );
};

export type { TaskActivityProps };
