import type { ReactElement, ReactNode } from 'react';

import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import { Text } from '@shared/ui/typography/text';

type SidebarSectionProps = {
  readonly label: string;
  readonly collapsed: boolean;
  readonly children: ReactNode;
  readonly className?: string;
};

export const SidebarSection = ({
  label,
  collapsed,
  children,
  className,
}: SidebarSectionProps): ReactElement => {
  return (
    <Stack gap={4} className={cn('w-full', className)} role="group" aria-label={label}>
      {!collapsed ? (
        <Text
          as="div"
          variant="caption"
          muted
          className="px-2.5 uppercase tracking-wide text-text-muted"
        >
          {label}
        </Text>
      ) : (
        <span className="sr-only">{label}</span>
      )}
      <Stack gap={2} className="w-full">
        {children}
      </Stack>
    </Stack>
  );
};

export type { SidebarSectionProps };
