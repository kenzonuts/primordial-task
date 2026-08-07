import type { ReactElement } from 'react';

import { DashboardWidget, RecommendationCard } from '@features/dashboard/components';
import { useDashboardStore } from '@features/dashboard/store/dashboard-store';
import { Stack } from '@shared/ui/layout/stack';

export const RecommendationsWidget = (): ReactElement => {
  const recommendations = useDashboardStore((state) => state.recommendations);

  return (
    <DashboardWidget
      id="recommendations"
      title="Recommendations"
      count={recommendations.length}
      emptyTitle="No recommendations."
      emptyDescription="Suggestions will appear as work patterns emerge."
    >
      <Stack gap={8}>
        {recommendations.map((recommendation) => (
          <RecommendationCard key={recommendation.id} recommendation={recommendation} />
        ))}
      </Stack>
    </DashboardWidget>
  );
};
