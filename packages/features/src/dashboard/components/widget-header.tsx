import type { ReactElement, ReactNode } from 'react';

import { Inline } from '@shared/ui/layout/inline';
import { cn } from '@shared/ui/lib/cn';
import { Badge } from '@shared/ui/primitives/badge';
import { Text } from '@shared/ui/typography/text';

type WidgetHeaderProps = {
  readonly title: string;
  readonly count?: number;
  readonly actions?: ReactNode;
  readonly className?: string;
};

export const WidgetHeader = ({
  title,
  count,
  actions,
  className,
}: WidgetHeaderProps): ReactElement => {
  return (
    <Inline gap={12} align="center" justify="between" className={cn('w-full min-w-0', className)}>
      <Inline gap={8} align="center" className="min-w-0">
        <Text as="h3" variant="h4" truncate className="min-w-0">
          {title}
        </Text>
        {typeof count === 'number' ? (
          <Badge variant="neutral" size="sm" className="shrink-0 tabular-nums">
            {count}
          </Badge>
        ) : null}
      </Inline>
      {actions ? (
        <Inline gap={4} align="center" className="shrink-0">
          {actions}
        </Inline>
      ) : null}
    </Inline>
  );
};

export type { WidgetHeaderProps };
