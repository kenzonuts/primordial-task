import type { ReactElement } from 'react';
import { useEffect, useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { ExportDialog, type FilterOption, AnalyticsToolbar } from '@features/analytics/components';
import { useAnalyticsContext } from '@features/analytics/context/analytics-context';
import { useAnalyticsDashboardQuery } from '@features/analytics/hooks/use-analytics-dashboard';
import { downloadTextFile, exportDashboard } from '@features/analytics/services/export';
import {
  useAnalyticsExportStore,
  useAnalyticsFilterStore,
  useAnalyticsStore,
  useAnalyticsTimeRangeStore,
} from '@features/analytics/store';
import {
  ANALYTICS_ROUTES,
  type AnalyticsSection,
  type ExportFormat,
} from '@features/analytics/types';
import { useProjectStore } from '@features/project/store/project-store';
import { TASK_PRIORITY_LABELS, TASK_STATUS_LABELS } from '@features/task/constants';
import { TASK_PRIORITIES, TASK_STATUSES } from '@features/task/types';
import { useWorkspaceStore } from '@features/workspace/store/workspace-store';
import { toast } from '@shared/ui/feedback/toast';

const SECTION_PATH: Record<AnalyticsSection, string> = {
  overview: ANALYTICS_ROUTES.overview,
  workspace: ANALYTICS_ROUTES.workspace,
  projects: ANALYTICS_ROUTES.projects,
  tasks: ANALYTICS_ROUTES.tasks,
  team: ANALYTICS_ROUTES.team,
  time: ANALYTICS_ROUTES.time,
  reports: ANALYTICS_ROUTES.reports,
};

const sectionFromPath = (pathname: string): AnalyticsSection => {
  const match = (Object.entries(SECTION_PATH) as [AnalyticsSection, string][]).find(
    ([, path]) => pathname === path || pathname.startsWith(`${path}/`),
  );
  return match?.[0] ?? 'overview';
};

const mimeForFormat = (format: ExportFormat): string => {
  switch (format) {
    case 'json':
      return 'application/json';
    case 'csv':
    case 'xlsx':
      return 'text/csv';
    case 'pdf':
    case 'png':
    default:
      return 'text/plain';
  }
};

const extensionForFormat = (format: ExportFormat): string => {
  if (format === 'xlsx') {
    return 'csv';
  }
  if (format === 'png' || format === 'pdf') {
    return 'txt';
  }
  return format;
};

/**
 * Shared analytics chrome: section toolbar, filters, export dialog, and page outlet.
 */
export const AnalyticsShell = (): ReactElement => {
  const navigate = useNavigate();
  const location = useLocation();
  const { workspaceId } = useAnalyticsContext();

  const section = useAnalyticsStore((state) => state.section);
  const setSection = useAnalyticsStore((state) => state.setSection);
  const showAiPanel = useAnalyticsStore((state) => state.showAiPanel);
  const setShowAiPanel = useAnalyticsStore((state) => state.setShowAiPanel);

  const preset = useAnalyticsTimeRangeStore((state) => state.preset);
  const setPreset = useAnalyticsTimeRangeStore((state) => state.setPreset);

  const filters = useAnalyticsFilterStore((state) => state.filters);
  const setFilters = useAnalyticsFilterStore((state) => state.setFilters);
  const resetFilters = useAnalyticsFilterStore((state) => state.resetFilters);

  const exportOpen = useAnalyticsExportStore((state) => state.open);
  const setExportOpen = useAnalyticsExportStore((state) => state.setOpen);
  const exportBusy = useAnalyticsExportStore((state) => state.busy);
  const setExportBusy = useAnalyticsExportStore((state) => state.setBusy);
  const setFormat = useAnalyticsExportStore((state) => state.setFormat);
  const setLastPayload = useAnalyticsExportStore((state) => state.setLastPayload);

  const projects = useProjectStore((state) => state.projects);
  const members = useWorkspaceStore((state) => state.members);
  const loadMembers = useWorkspaceStore((state) => state.loadMembers);

  const dashboardQuery = useAnalyticsDashboardQuery(workspaceId);

  useEffect(() => {
    const next = sectionFromPath(location.pathname);
    if (next !== section) {
      setSection(next);
    }
  }, [location.pathname, section, setSection]);

  useEffect(() => {
    if (workspaceId) {
      void loadMembers(workspaceId);
    }
  }, [workspaceId, loadMembers]);

  const projectOptions: FilterOption[] = useMemo(
    () => projects.map((project) => ({ id: project.id, label: project.name })),
    [projects],
  );

  const memberOptions: FilterOption[] = useMemo(
    () => members.map((member) => ({ id: member.userId, label: member.fullName })),
    [members],
  );

  const statusOptions: FilterOption[] = useMemo(
    () => TASK_STATUSES.map((status) => ({ id: status, label: TASK_STATUS_LABELS[status] })),
    [],
  );

  const priorityOptions: FilterOption[] = useMemo(
    () =>
      TASK_PRIORITIES.map((priority) => ({
        id: priority,
        label: TASK_PRIORITY_LABELS[priority],
      })),
    [],
  );

  const handleSectionChange = (next: AnalyticsSection): void => {
    setSection(next);
    navigate(SECTION_PATH[next]);
  };

  const handleExport = async (format: ExportFormat): Promise<void> => {
    setFormat(format);
    setExportBusy(true);
    try {
      let snapshot = dashboardQuery.data;
      if (!snapshot) {
        snapshot = await dashboardQuery.refetch().then((result) => result.data);
      }
      if (!snapshot) {
        toast.error('Load analytics data before exporting.');
        return;
      }
      const payload = exportDashboard(snapshot, format);
      setLastPayload(payload);
      downloadTextFile(
        `primordial-analytics-${section}.${extensionForFormat(format)}`,
        payload,
        mimeForFormat(format),
      );
      toast.success(`Downloaded ${format.toUpperCase()} analytics export.`);
      setExportOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to export analytics.');
    } finally {
      setExportBusy(false);
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col" data-testid="analytics-shell">
      <AnalyticsToolbar
        section={section}
        onSectionChange={handleSectionChange}
        timeRangePreset={preset}
        onTimeRangeChange={setPreset}
        filters={filters}
        onFiltersChange={setFilters}
        onResetFilters={() => resetFilters(workspaceId)}
        projectOptions={projectOptions}
        memberOptions={memberOptions}
        statusOptions={statusOptions}
        priorityOptions={priorityOptions}
        aiEnabled={showAiPanel}
        onAiToggle={setShowAiPanel}
        onExport={() => setExportOpen(true)}
      />
      <div className="mx-auto w-full max-w-[1600px] flex-1 p-24">
        <Outlet />
      </div>
      <ExportDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        loading={exportBusy}
        onExport={(format) => {
          void handleExport(format);
        }}
      />
    </div>
  );
};
