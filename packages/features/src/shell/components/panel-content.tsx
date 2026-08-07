import type { ReactElement, ReactNode } from 'react';

import { ScrollArea } from '@shared/ui/layout/scroll-area';
import { cn } from '@shared/ui/lib/cn';

type PanelContentProps = {
  readonly children: ReactNode;
  readonly className?: string;
};

export const PanelContent = ({ children, className }: PanelContentProps): ReactElement => {
  return (
    <ScrollArea className={cn('min-h-0 flex-1', className)}>
      <div className="flex flex-col gap-3 p-4">{children}</div>
    </ScrollArea>
  );
};

export type { PanelContentProps };
