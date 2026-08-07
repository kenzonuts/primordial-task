import type { ReactElement } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/composites/card';
import { Inline } from '@shared/ui/layout/inline';
import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import { Progress } from '@shared/ui/primitives/progress';
import { Text } from '@shared/ui/typography/text';

type ProjectProgressCardProps = {
  readonly progress: number;
  readonly label?: string;
  readonly title?: string;
  readonly size?: 'thin' | 'standard' | 'large';
  readonly className?: string;
  readonly compact?: boolean;
};

const clampProgress = (value: number): number => Math.min(100, Math.max(0, Math.round(value)));

export const ProjectProgressCard = ({
  progress,
  label,
  title = 'Progress',
  size = 'standard',
  className,
  compact = false,
}: ProjectProgressCardProps): ReactElement => {
  const value = clampProgress(progress);
  const resolvedLabel = label ?? `${value}% complete`;

  if (compact) {
    return (
      <Stack gap={4} className={cn('w-full', className)}>
        {title ? (
          <Inline gap={8} align="center" justify="between" className="w-full">
            <Text as="span" variant="caption" muted>
              {title}
            </Text>
            <Text as="span" variant="caption" className="tabular-nums text-text-secondary">
              {value}%
            </Text>
          </Inline>
        ) : (
          <Text as="span" variant="caption" className="self-end tabular-nums text-text-secondary">
            {value}%
          </Text>
        )}
        <Progress value={value} size={size} aria-label={resolvedLabel} />
      </Stack>
    );
  }

  return (
    <Card variant="compact" className={cn(className)}>
      <CardHeader className="mb-2">
        <Inline gap={8} align="center" justify="between" className="w-full">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Text as="span" variant="caption" className="tabular-nums text-text-secondary">
            {value}%
          </Text>
        </Inline>
      </CardHeader>
      <CardContent>
        <Stack gap={8}>
          <Progress value={value} size={size} aria-label={resolvedLabel} />
          <Text as="p" variant="caption" muted>
            {resolvedLabel}
          </Text>
        </Stack>
      </CardContent>
    </Card>
  );
};

export type { ProjectProgressCardProps };
