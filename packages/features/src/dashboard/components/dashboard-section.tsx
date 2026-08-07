import type { HTMLAttributes, ReactElement, ReactNode } from 'react';

import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import { Heading } from '@shared/ui/typography/heading';
import { Text } from '@shared/ui/typography/text';

type DashboardSectionProps = HTMLAttributes<HTMLElement> & {
  readonly title?: string;
  readonly description?: string;
  readonly children?: ReactNode;
};

export const DashboardSection = ({
  title,
  description,
  children,
  className,
  ...props
}: DashboardSectionProps): ReactElement => {
  return (
    <section className={cn('flex flex-col gap-16', className)} {...props}>
      {title || description ? (
        <Stack gap={4} className="min-w-0">
          {title ? (
            <Heading level={2} className="truncate">
              {title}
            </Heading>
          ) : null}
          {description ? (
            <Text as="p" variant="body-sm" muted className="max-w-[640px]">
              {description}
            </Text>
          ) : null}
        </Stack>
      ) : null}
      {children}
    </section>
  );
};

export type { DashboardSectionProps };
