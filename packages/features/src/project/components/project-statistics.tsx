import type { ReactElement } from 'react';

import type { ProjectStatistic } from '@features/project/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@shared/ui/composites/card';
import { cn } from '@shared/ui/lib/cn';
import { Text } from '@shared/ui/typography/text';

type ProjectStatisticsProps = {
  readonly stats: readonly ProjectStatistic[];
  readonly className?: string;
};

export const ProjectStatistics = ({ stats, className }: ProjectStatisticsProps): ReactElement => {
  return (
    <div
      role="list"
      aria-label="Project statistics"
      className={cn('grid grid-cols-1 gap-12 sm:grid-cols-2 xl:grid-cols-4', className)}
    >
      {stats.map((stat) => (
        <Card key={stat.id} variant="compact" role="listitem">
          <CardHeader className="mb-1">
            <CardDescription className="text-xs uppercase tracking-wide text-text-muted">
              {stat.label}
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums tracking-tight">
              {stat.value}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Text as="p" variant="caption" muted>
              {stat.hint}
            </Text>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export type { ProjectStatisticsProps };
