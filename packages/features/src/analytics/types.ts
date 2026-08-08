export const ANALYTICS_ROUTES = {
  root: '/analytics',
  overview: '/analytics/overview',
  workspace: '/analytics/workspace',
  projects: '/analytics/projects',
  tasks: '/analytics/tasks',
  team: '/analytics/team',
  time: '/analytics/time',
  reports: '/analytics/reports',
  reportDetail: '/analytics/reports/:id',
} as const;

export const analyticsReportPath = (id: string): string => `/analytics/reports/${id}`;

export const TIME_RANGE_PRESETS = [
  'today',
  'yesterday',
  'this_week',
  'last_week',
  'last_7_days',
  'last_30_days',
  'this_month',
  'last_month',
  'this_quarter',
  'this_year',
  'custom',
] as const;

export type TimeRangePreset = (typeof TIME_RANGE_PRESETS)[number];

export const ANALYTICS_SECTIONS = [
  'overview',
  'workspace',
  'projects',
  'tasks',
  'team',
  'time',
  'reports',
] as const;

export type AnalyticsSection = (typeof ANALYTICS_SECTIONS)[number];

export const CHART_TYPES = [
  'line',
  'area',
  'bar',
  'stacked_bar',
  'donut',
  'heatmap',
  'scatter',
  'progress',
  'table',
] as const;

export type ChartType = (typeof CHART_TYPES)[number];

export const EXPORT_FORMATS = ['csv', 'json', 'pdf', 'xlsx', 'png'] as const;
export type ExportFormat = (typeof EXPORT_FORMATS)[number];

export interface AnalyticsTimeRange {
  readonly preset: TimeRangePreset;
  readonly start: number;
  readonly end: number;
  readonly previousStart: number;
  readonly previousEnd: number;
}

export interface AnalyticsFilters {
  readonly workspaceId: string | null;
  readonly projectIds: readonly string[];
  readonly memberIds: readonly string[];
  readonly statuses: readonly string[];
  readonly priorities: readonly string[];
  readonly labels: readonly string[];
  readonly tags: readonly string[];
  readonly includeArchived: boolean;
  readonly includeCompleted: boolean;
}

export interface MetricDefinition {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly format: 'number' | 'percent' | 'score' | 'duration' | 'ratio';
  readonly unit?: string;
}

export interface MetricComparison {
  readonly current: number;
  readonly previous: number | null;
  readonly absoluteChange: number | null;
  readonly percentChange: number | null;
  readonly direction: 'up' | 'down' | 'flat' | 'na';
}

export interface MetricResult {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly value: number | null;
  readonly formatted: string;
  readonly comparison: MetricComparison;
  readonly timeRange: AnalyticsTimeRange;
  readonly unavailableReason?: string;
}

export interface ChartSeriesPoint {
  readonly key: string;
  readonly label: string;
  readonly value: number;
  readonly secondary?: number;
}

export interface ChartSeries {
  readonly id: string;
  readonly name: string;
  readonly points: readonly ChartSeriesPoint[];
}

export interface ChartModel {
  readonly id: string;
  readonly type: ChartType;
  readonly title: string;
  readonly description: string;
  readonly series: readonly ChartSeries[];
  readonly tableRows: readonly { label: string; values: readonly number[] }[];
}

export interface WorkloadCell {
  readonly memberId: string;
  readonly memberName: string;
  readonly dayKey: string;
  readonly load: number;
}

export interface ProjectAnalyticsRow {
  readonly projectId: string;
  readonly projectName: string;
  readonly progress: number;
  readonly healthScore: number;
  readonly riskScore: number;
  readonly overdueCount: number;
  readonly blockedCount: number;
  readonly completedCount: number;
  readonly openCount: number;
  readonly velocity: number;
}

export interface MemberAnalyticsRow {
  readonly memberId: string;
  readonly memberName: string;
  readonly assigned: number;
  readonly completed: number;
  readonly overdue: number;
  readonly capacityPercent: number;
  readonly estimatedMinutes: number;
}

export interface AnalyticsDashboardSnapshot {
  readonly generatedAt: number;
  readonly timeRange: AnalyticsTimeRange;
  readonly kpis: readonly MetricResult[];
  readonly productivityTrend: ChartModel;
  readonly projectHealthDistribution: ChartModel;
  readonly statusDistribution: ChartModel;
  readonly priorityDistribution: ChartModel;
  readonly workloadHeatmap: readonly WorkloadCell[];
  readonly projectRows: readonly ProjectAnalyticsRow[];
  readonly memberRows: readonly MemberAnalyticsRow[];
  readonly aiInsightPlaceholder: string;
}

export interface SavedReport {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly section: AnalyticsSection;
  readonly filters: AnalyticsFilters;
  readonly timeRangePreset: TimeRangePreset;
  readonly chartIds: readonly string[];
  readonly favorite: boolean;
  readonly pinned: boolean;
  readonly createdAt: number;
  readonly updatedAt: number;
}

export interface AnalyticsPreferences {
  readonly defaultPreset: TimeRangePreset;
  readonly defaultSection: AnalyticsSection;
  readonly showTableAlternatives: boolean;
  readonly debounceMs: number;
}

export interface AnalyticsExportRequest {
  readonly format: ExportFormat;
  readonly section: AnalyticsSection;
  readonly includeCharts: boolean;
  readonly includeTables: boolean;
}
