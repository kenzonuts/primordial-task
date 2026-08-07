import type { ReactElement } from 'react';

import { DashboardWidget, RiskCard } from '@features/dashboard/components';
import { useDashboardStore } from '@features/dashboard/store/dashboard-store';
import { Stack } from '@shared/ui/layout/stack';

export const RiskDetectionWidget = (): ReactElement => {
  const risks = useDashboardStore((state) => state.risks);

  return (
    <DashboardWidget
      id="risk-detection"
      title="Risk Detection"
      count={risks.length}
      emptyTitle="No risks detected."
      emptyDescription="Blocked or at-risk work will surface here."
    >
      <Stack gap={8}>
        {risks.map((risk) => (
          <RiskCard key={risk.id} risk={risk} />
        ))}
      </Stack>
    </DashboardWidget>
  );
};
