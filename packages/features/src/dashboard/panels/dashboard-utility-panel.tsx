import type { ReactElement } from 'react';

import {
  AiDailySummaryWidget,
  ProductivityInsightsWidget,
  QuickNotesWidget,
  RecommendationsWidget,
  RiskDetectionWidget,
  UpcomingMeetingsWidget,
} from '@features/dashboard/widgets';
import { PanelContent } from '@features/shell/components/panel-content';
import { PanelHeader } from '@features/shell/components/panel-header';
import { ResizablePanel } from '@features/shell/components/resizable-panel';
import { useUtilityPanelStore } from '@features/shell/store/utility-panel-store';

type DashboardUtilityPanelProps = {
  readonly className?: string;
};

export const DashboardUtilityPanel = ({
  className,
}: DashboardUtilityPanelProps): ReactElement | null => {
  const setOpen = useUtilityPanelStore((state) => state.setOpen);

  return (
    <ResizablePanel className={className} aria-label="Dashboard utilities">
      <PanelHeader title="Dashboard Insights" onClose={() => setOpen(false)} />
      <PanelContent>
        <AiDailySummaryWidget />
        <RecommendationsWidget />
        <RiskDetectionWidget />
        <ProductivityInsightsWidget />
        <QuickNotesWidget />
        <UpcomingMeetingsWidget />
      </PanelContent>
    </ResizablePanel>
  );
};

export type { DashboardUtilityPanelProps };
