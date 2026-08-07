import type { ReactElement } from 'react';

import type { DashboardRecommendation } from '@features/dashboard/types';
import { Alert } from '@shared/ui/feedback/alert';
import { cn } from '@shared/ui/lib/cn';
import { Text } from '@shared/ui/typography/text';

type RecommendationCardProps = {
  readonly recommendation: DashboardRecommendation;
  readonly className?: string;
};

const toneToVariant = (tone: DashboardRecommendation['tone']): 'info' | 'success' | 'warning' => {
  switch (tone) {
    case 'success':
      return 'success';
    case 'warning':
      return 'warning';
    case 'info':
    default:
      return 'info';
  }
};

export const RecommendationCard = ({
  recommendation,
  className,
}: RecommendationCardProps): ReactElement => {
  return (
    <Alert
      variant={toneToVariant(recommendation.tone)}
      title={recommendation.title}
      className={cn(className)}
    >
      <Text as="p" variant="body-sm" className="text-current/90">
        {recommendation.body}
      </Text>
    </Alert>
  );
};

export type { RecommendationCardProps };
