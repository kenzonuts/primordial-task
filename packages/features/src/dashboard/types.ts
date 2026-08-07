export type DashboardTimeFilter = 'today' | 'week' | 'month';

export type DashboardScopeFilter = 'all' | 'favorites' | 'pinned' | 'archived';

export type DashboardWidgetId =
  | 'todays-tasks'
  | 'overdue-tasks'
  | 'upcoming-deadlines'
  | 'recent-projects'
  | 'project-progress'
  | 'recent-activity'
  | 'pinned-items'
  | 'favorite-projects'
  | 'ai-daily-summary'
  | 'recommendations'
  | 'productivity-insights'
  | 'risk-detection'
  | 'quick-notes'
  | 'upcoming-meetings';

export type WidgetLoadState = 'idle' | 'loading' | 'ready' | 'error' | 'empty';

export interface DashboardTaskPreview {
  readonly id: string;
  readonly title: string;
  readonly projectName: string;
  readonly status: 'todo' | 'in_progress' | 'blocked' | 'done';
  readonly priority: 'low' | 'medium' | 'high' | 'urgent';
  readonly dueLabel: string;
  readonly assigneeInitials: string;
  readonly daysOverdue?: number;
  readonly completed?: boolean;
}

export interface DashboardProjectPreview {
  readonly id: string;
  readonly name: string;
  readonly progress: number;
  readonly status: 'on_track' | 'at_risk' | 'blocked';
  readonly updatedLabel: string;
  readonly isFavorite: boolean;
  readonly isPinned: boolean;
}

export interface DashboardActivityItem {
  readonly id: string;
  readonly actor: string;
  readonly action: string;
  readonly target: string;
  readonly timestampLabel: string;
}

export interface DashboardPinnedItem {
  readonly id: string;
  readonly title: string;
  readonly kind: 'task' | 'project' | 'note' | 'doc';
}

export interface DashboardRecommendation {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly tone: 'info' | 'success' | 'warning';
}

export interface DashboardRisk {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly severity: 'warning' | 'danger';
}

export interface DashboardInsight {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly hint: string;
}

export interface DashboardMeeting {
  readonly id: string;
  readonly title: string;
  readonly timeLabel: string;
}

export interface DashboardNote {
  readonly id: string;
  readonly body: string;
  readonly updatedLabel: string;
}

export interface DashboardSummary {
  readonly greeting: string;
  readonly dateLabel: string;
  readonly workspaceName: string;
  readonly summaryLine: string;
  readonly lastSyncLabel: string;
  readonly tasksDueToday: number;
  readonly projectsNeedingAttention: number;
}

export interface DashboardWidgetState {
  readonly id: DashboardWidgetId;
  readonly collapsed: boolean;
  readonly loadState: WidgetLoadState;
  readonly error: string | null;
}

export interface DashboardFiltersState {
  readonly time: DashboardTimeFilter;
  readonly scope: DashboardScopeFilter;
  readonly query: string;
}

export interface DashboardPreferences {
  readonly denseLists: boolean;
  readonly showOverdueWhenEmpty: boolean;
  readonly persistWidgetLayout: boolean;
}
