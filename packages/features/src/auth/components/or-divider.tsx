import type { ReactElement } from 'react';

import { Divider } from '@shared/ui/layout/divider';
import { cn } from '@shared/ui/lib/cn';
import { Text } from '@shared/ui/typography/text';

type OrDividerProps = {
  readonly label?: string;
  readonly className?: string;
};

export const OrDivider = ({ label = 'or', className }: OrDividerProps): ReactElement => {
  return (
    <div className={cn('relative flex w-full items-center py-20', className)} role="separator">
      <Divider className="absolute inset-x-0" />
      <Text as="span" variant="caption" muted className="relative mx-auto bg-surface-base px-12">
        {label}
      </Text>
    </div>
  );
};

export type { OrDividerProps };
