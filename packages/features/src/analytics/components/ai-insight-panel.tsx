import { Sparkles } from 'lucide-react';
import type { ReactElement } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@shared/ui/composites/card';
import { Inline } from '@shared/ui/layout/inline';
import { cn } from '@shared/ui/lib/cn';
import { Text } from '@shared/ui/typography/text';

type AiInsightPanelProps = {
  /** Placeholder copy only — do not invent AI insights. */
  readonly placeholder?: string;
  readonly enabled?: boolean;
  readonly className?: string;
};

const DEFAULT_PLACEHOLDER =
  'AI insights are not generated yet. Enable AI when connected to receive natural-language summaries of workspace health, risk, and workload.';

export const AiInsightPanel = ({
  placeholder = DEFAULT_PLACEHOLDER,
  enabled = false,
  className,
}: AiInsightPanelProps): ReactElement => {
  return (
    <Card className={cn(className)} aria-label="AI insights">
      <CardHeader>
        <Inline gap={8} align="center">
          <Sparkles className="size-4 text-text-muted" aria-hidden="true" />
          <CardTitle>AI insights</CardTitle>
        </Inline>
        <CardDescription>
          {enabled ? 'Foundation ready — awaiting insight service.' : 'AI summary is off.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Text as="p" variant="body-sm" muted>
          {placeholder}
        </Text>
      </CardContent>
    </Card>
  );
};

export type { AiInsightPanelProps };
