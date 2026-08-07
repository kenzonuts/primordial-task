import type { ReactElement } from 'react';

import { DashboardWidget, InsightCard } from '@features/dashboard/components';
import { useDashboardStore } from '@features/dashboard/store/dashboard-store';

export const ProductivityInsightsWidget = (): ReactElement => {
  const insights = useDashboardStore((state) => state.insights);

  return (
    <DashboardWidget
      id="productivity-insights"
      title="Productivity Insights"
      count={insights.length}
      emptyTitle="No insights yet."
      emptyDescription="Productivity signals will appear once activity accumulates."
    >
      <div className="grid grid-cols-1 gap-8">
        {insights.map((insight) => (
          <InsightCard key={insight.id} insight={insight} />
        ))}
      </div>
    </DashboardWidget>
  );
};
