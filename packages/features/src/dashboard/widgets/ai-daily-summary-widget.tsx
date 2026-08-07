import type { ReactElement } from 'react';

import { DashboardWidget } from '@features/dashboard/components';
import { useDashboardStore } from '@features/dashboard/store/dashboard-store';
import { Text } from '@shared/ui/typography/text';

export const AiDailySummaryWidget = (): ReactElement => {
  const aiSummary = useDashboardStore((state) => state.aiSummary);

  return (
    <DashboardWidget
      id="ai-daily-summary"
      title="AI Daily Summary"
      emptyTitle="No summary yet."
      emptyDescription="A daily AI overview will appear here when available."
    >
      <Text as="p" variant="body-sm" className="leading-relaxed text-text-secondary">
        {aiSummary}
      </Text>
    </DashboardWidget>
  );
};
