import { useState, type ReactElement, type ReactNode } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@shared/ui/composites/card';
import { Inline } from '@shared/ui/layout/inline';
import { cn } from '@shared/ui/lib/cn';
import { Button } from '@shared/ui/primitives/button';

type ChartCardProps = {
  readonly title: string;
  readonly description?: string;
  readonly legend?: ReactNode;
  readonly table?: ReactNode;
  readonly defaultShowTable?: boolean;
  readonly children: ReactNode;
  readonly className?: string;
  readonly actions?: ReactNode;
};

export const ChartCard = ({
  title,
  description,
  legend,
  table,
  defaultShowTable = false,
  children,
  className,
  actions,
}: ChartCardProps): ReactElement => {
  const [showTable, setShowTable] = useState(defaultShowTable);
  const hasTable = table != null;

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="mb-0">
        <Inline gap={12} align="start" justify="between">
          <div className="min-w-0 space-y-1">
            <CardTitle>{title}</CardTitle>
            {description ? <CardDescription>{description}</CardDescription> : null}
          </div>
          <Inline gap={8} align="center" className="shrink-0">
            {legend}
            {actions}
            {hasTable ? (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                aria-pressed={showTable}
                onClick={() => setShowTable((prev) => !prev)}
              >
                {showTable ? 'View Chart' : 'View Table'}
              </Button>
            ) : null}
          </Inline>
        </Inline>
      </CardHeader>
      <CardContent className="pt-4">{showTable && hasTable ? table : children}</CardContent>
    </Card>
  );
};

export type { ChartCardProps };
