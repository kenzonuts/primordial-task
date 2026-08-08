import { FileText, Star } from 'lucide-react';
import type { KeyboardEvent, ReactElement } from 'react';

import type { SavedReport } from '@features/analytics/types';
import { TIME_RANGE_LABELS } from '@features/analytics/utils/time-range';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@shared/ui/composites/card';
import { Inline } from '@shared/ui/layout/inline';
import { cn } from '@shared/ui/lib/cn';
import { Badge } from '@shared/ui/primitives/badge';
import { Text } from '@shared/ui/typography/text';

type ReportCardProps = {
  readonly report: SavedReport;
  readonly onOpen?: (reportId: string) => void;
  readonly className?: string;
};

export const ReportCard = ({ report, onOpen, className }: ReportCardProps): ReactElement => {
  const interactive = typeof onOpen === 'function';

  const activate = (): void => {
    onOpen?.(report.id);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (!interactive) {
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      activate();
    }
  };

  return (
    <Card
      variant={interactive ? 'interactive' : 'default'}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={interactive ? activate : undefined}
      onKeyDown={interactive ? onKeyDown : undefined}
      aria-label={`Report ${report.name}`}
      className={cn(className)}
    >
      <CardHeader className="mb-2">
        <Inline gap={8} align="center" justify="between">
          <Inline gap={8} align="center" className="min-w-0">
            <FileText className="size-4 shrink-0 text-text-muted" aria-hidden="true" />
            <CardTitle className="truncate">{report.name}</CardTitle>
          </Inline>
          {report.favorite ? (
            <Star
              className="size-3.5 shrink-0 fill-current text-text-secondary"
              aria-label="Favorite"
            />
          ) : null}
        </Inline>
        {report.description ? <CardDescription>{report.description}</CardDescription> : null}
      </CardHeader>
      <CardContent>
        <Inline gap={8} align="center" wrap>
          <Badge variant="neutral" size="sm">
            {report.section}
          </Badge>
          <Text as="span" variant="caption" muted>
            {TIME_RANGE_LABELS[report.timeRangePreset]}
          </Text>
          <Text as="span" variant="caption" muted>
            {report.chartIds.length} charts
          </Text>
        </Inline>
      </CardContent>
    </Card>
  );
};

export type { ReportCardProps };
