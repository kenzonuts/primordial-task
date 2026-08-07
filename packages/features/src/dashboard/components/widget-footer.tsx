import type { ReactElement, ReactNode } from 'react';

import { Inline } from '@shared/ui/layout/inline';
import { cn } from '@shared/ui/lib/cn';
import { Button } from '@shared/ui/primitives/button';

type WidgetFooterProps = {
  readonly onViewAll?: () => void;
  readonly viewAllLabel?: string;
  readonly actions?: ReactNode;
  readonly className?: string;
};

export const WidgetFooter = ({
  onViewAll,
  viewAllLabel = 'View all',
  actions,
  className,
}: WidgetFooterProps): ReactElement | null => {
  if (!onViewAll && !actions) {
    return null;
  }

  return (
    <Inline
      gap={8}
      align="center"
      justify="between"
      className={cn('mt-3 w-full border-t border-border-subtle pt-3', className)}
    >
      <div className="min-w-0">{actions}</div>
      {onViewAll ? (
        <Button type="button" variant="ghost" size="sm" onClick={onViewAll} className="shrink-0">
          {viewAllLabel}
        </Button>
      ) : null}
    </Inline>
  );
};

export type { WidgetFooterProps };
