/**
 * Dashboard feature public API.
 */

export type {
  DashboardActivityItem,
  DashboardFiltersState,
  DashboardInsight,
  DashboardMeeting,
  DashboardNote,
  DashboardPinnedItem,
  DashboardPreferences,
  DashboardProjectPreview,
  DashboardRecommendation,
  DashboardRisk,
  DashboardScopeFilter,
  DashboardSummary,
  DashboardTaskPreview,
  DashboardTimeFilter,
  DashboardWidgetId,
  DashboardWidgetState,
  WidgetLoadState,
} from '@features/dashboard/types';

export { useDashboardStore } from '@features/dashboard/store/dashboard-store';

export { DashboardPage } from '@features/dashboard/pages/dashboard-page';
export { DashboardUtilityPanel } from '@features/dashboard/panels/dashboard-utility-panel';

export * from '@features/dashboard/components';
export * from '@features/dashboard/widgets';
