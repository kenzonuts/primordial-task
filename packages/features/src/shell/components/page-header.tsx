import type { ReactElement, ReactNode } from 'react';

import { Inline } from '@shared/ui/layout/inline';
import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import { Heading } from '@shared/ui/typography/heading';
import { Text } from '@shared/ui/typography/text';

type PageHeaderProps = {
  readonly title: string;
  readonly description?: string;
  readonly actions?: ReactNode;
  readonly className?: string;
};

export const PageHeader = ({
  title,
  description,
  actions,
  className,
}: PageHeaderProps): ReactElement => {
  return (
    <Inline gap={16} align="start" justify="between" className={cn('w-full', className)}>
      <Stack gap={4} className="min-w-0 flex-1">
        <Heading level={1} className="truncate">
          {title}
        </Heading>
        {description ? (
          <Text as="p" variant="body-md" muted className="max-w-[720px]">
            {description}
          </Text>
        ) : null}
      </Stack>
      {actions ? (
        <Inline gap={8} align="center" className="shrink-0">
          {actions}
        </Inline>
      ) : null}
    </Inline>
  );
};

export type { PageHeaderProps };
