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
    <div
      className={cn('flex w-full items-center gap-12 py-20', className)}
      role="separator"
      aria-label={label}
    >
      <Divider className="flex-1" />
      <Text as="span" variant="caption" muted className="shrink-0">
        {label}
      </Text>
      <Divider className="flex-1" />
    </div>
  );
};

export type { OrDividerProps };
