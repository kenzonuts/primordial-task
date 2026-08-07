import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import {
  PLACEHOLDER_ACTIVITY,
  PLACEHOLDER_AI_SUMMARY,
  PLACEHOLDER_DEADLINES,
  PLACEHOLDER_INSIGHTS,
  PLACEHOLDER_MEETINGS,
  PLACEHOLDER_NOTES,
  PLACEHOLDER_OVERDUE_TASKS,
  PLACEHOLDER_PINNED,
  PLACEHOLDER_PROJECTS,
  PLACEHOLDER_RECOMMENDATIONS,
  PLACEHOLDER_RISKS,
  PLACEHOLDER_TODAYS_TASKS,
  buildDashboardSummary,
  fetchDashboardPlaceholder,
} from '@features/dashboard/data/placeholder-data';
import type {
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
  DashboardSummary,
  DashboardTaskPreview,
  DashboardWidgetId,
  DashboardWidgetState,
  WidgetLoadState,
} from '@features/dashboard/types';

const DEFAULT_WIDGET_IDS: readonly DashboardWidgetId[] = [
  'todays-tasks',
  'overdue-tasks',
  'upcoming-deadlines',
  'recent-projects',
  'project-progress',
  'recent-activity',
  'pinned-items',
  'favorite-projects',
  'ai-daily-summary',
  'recommendations',
  'productivity-insights',
  'risk-detection',
  'quick-notes',
  'upcoming-meetings',
] as const;

const createWidgetMap = (): Record<DashboardWidgetId, DashboardWidgetState> => {
  return DEFAULT_WIDGET_IDS.reduce(
    (accumulator, id) => {
      accumulator[id] = {
        id,
        collapsed: false,
        loadState: 'idle',
        error: null,
      };
      return accumulator;
    },
    {} as Record<DashboardWidgetId, DashboardWidgetState>,
  );
};

interface DashboardStoreState {
  readonly summary: DashboardSummary | null;
  readonly todaysTasks: readonly DashboardTaskPreview[];
  readonly overdueTasks: readonly DashboardTaskPreview[];
  readonly upcomingDeadlines: readonly DashboardTaskPreview[];
  readonly recentProjects: readonly DashboardProjectPreview[];
  readonly recentActivity: readonly DashboardActivityItem[];
  readonly pinnedItems: readonly DashboardPinnedItem[];
  readonly favoriteProjects: readonly DashboardProjectPreview[];
  readonly aiSummary: string;
  readonly recommendations: readonly DashboardRecommendation[];
  readonly insights: readonly DashboardInsight[];
  readonly risks: readonly DashboardRisk[];
  readonly quickNotes: readonly DashboardNote[];
  readonly upcomingMeetings: readonly DashboardMeeting[];
  readonly widgets: Record<DashboardWidgetId, DashboardWidgetState>;
  readonly filters: DashboardFiltersState;
  readonly preferences: DashboardPreferences;
  readonly status: WidgetLoadState;
  readonly error: string | null;
  setFilters(partial: Partial<DashboardFiltersState>): void;
  setPreferences(partial: Partial<DashboardPreferences>): void;
  toggleWidgetCollapsed(id: DashboardWidgetId): void;
  refreshWidget(id: DashboardWidgetId): Promise<void>;
  refreshAll(workspaceName?: string, userName?: string): Promise<void>;
  clearError(): void;
}

const setWidget = (
  widgets: Record<DashboardWidgetId, DashboardWidgetState>,
  id: DashboardWidgetId,
  patch: Partial<DashboardWidgetState>,
): Record<DashboardWidgetId, DashboardWidgetState> => ({
  ...widgets,
  [id]: { ...widgets[id], ...patch, id },
});

export const useDashboardStore = create<DashboardStoreState>()(
  persist(
    (set, get) => ({
      summary: null,
      todaysTasks: [],
      overdueTasks: [],
      upcomingDeadlines: [],
      recentProjects: [],
      recentActivity: [],
      pinnedItems: [],
      favoriteProjects: [],
      aiSummary: '',
      recommendations: [],
      insights: [],
      risks: [],
      quickNotes: [],
      upcomingMeetings: [],
      widgets: createWidgetMap(),
      filters: {
        time: 'today',
        scope: 'all',
        query: '',
      },
      preferences: {
        denseLists: false,
        showOverdueWhenEmpty: false,
        persistWidgetLayout: true,
      },
      status: 'idle',
      error: null,

      clearError: () => {
        set({ error: null });
      },

      setFilters: (partial) => {
        set({ filters: { ...get().filters, ...partial } });
      },

      setPreferences: (partial) => {
        set({ preferences: { ...get().preferences, ...partial } });
      },

      toggleWidgetCollapsed: (id) => {
        const current = get().widgets[id];
        set({
          widgets: setWidget(get().widgets, id, { collapsed: !current.collapsed }),
        });
      },

      refreshWidget: async (id) => {
        set({
          widgets: setWidget(get().widgets, id, { loadState: 'loading', error: null }),
        });

        try {
          switch (id) {
            case 'todays-tasks': {
              const todaysTasks = await fetchDashboardPlaceholder(PLACEHOLDER_TODAYS_TASKS);
              set({
                todaysTasks,
                widgets: setWidget(get().widgets, id, {
                  loadState: todaysTasks.length ? 'ready' : 'empty',
                }),
              });
              break;
            }
            case 'overdue-tasks': {
              const overdueTasks = await fetchDashboardPlaceholder(PLACEHOLDER_OVERDUE_TASKS);
              set({
                overdueTasks,
                widgets: setWidget(get().widgets, id, {
                  loadState: overdueTasks.length ? 'ready' : 'empty',
                }),
              });
              break;
            }
            case 'upcoming-deadlines': {
              const upcomingDeadlines = await fetchDashboardPlaceholder(PLACEHOLDER_DEADLINES);
              set({
                upcomingDeadlines,
                widgets: setWidget(get().widgets, id, {
                  loadState: upcomingDeadlines.length ? 'ready' : 'empty',
                }),
              });
              break;
            }
            case 'recent-projects':
            case 'project-progress':
            case 'favorite-projects': {
              const recentProjects = await fetchDashboardPlaceholder(PLACEHOLDER_PROJECTS);
              set({
                recentProjects,
                favoriteProjects: recentProjects.filter((project) => project.isFavorite),
                widgets: setWidget(get().widgets, id, {
                  loadState: recentProjects.length ? 'ready' : 'empty',
                }),
              });
              break;
            }
            case 'recent-activity': {
              const recentActivity = await fetchDashboardPlaceholder(PLACEHOLDER_ACTIVITY);
              set({
                recentActivity,
                widgets: setWidget(get().widgets, id, {
                  loadState: recentActivity.length ? 'ready' : 'empty',
                }),
              });
              break;
            }
            case 'pinned-items': {
              const pinnedItems = await fetchDashboardPlaceholder(PLACEHOLDER_PINNED);
              set({
                pinnedItems,
                widgets: setWidget(get().widgets, id, {
                  loadState: pinnedItems.length ? 'ready' : 'empty',
                }),
              });
              break;
            }
            case 'ai-daily-summary': {
              const aiSummary = await fetchDashboardPlaceholder(PLACEHOLDER_AI_SUMMARY);
              set({
                aiSummary,
                widgets: setWidget(get().widgets, id, {
                  loadState: aiSummary ? 'ready' : 'empty',
                }),
              });
              break;
            }
            case 'recommendations': {
              const recommendations = await fetchDashboardPlaceholder(PLACEHOLDER_RECOMMENDATIONS);
              set({
                recommendations,
                widgets: setWidget(get().widgets, id, {
                  loadState: recommendations.length ? 'ready' : 'empty',
                }),
              });
              break;
            }
            case 'productivity-insights': {
              const insights = await fetchDashboardPlaceholder(PLACEHOLDER_INSIGHTS);
              set({
                insights,
                widgets: setWidget(get().widgets, id, {
                  loadState: insights.length ? 'ready' : 'empty',
                }),
              });
              break;
            }
            case 'risk-detection': {
              const risks = await fetchDashboardPlaceholder(PLACEHOLDER_RISKS);
              set({
                risks,
                widgets: setWidget(get().widgets, id, {
                  loadState: risks.length ? 'ready' : 'empty',
                }),
              });
              break;
            }
            case 'quick-notes': {
              const quickNotes = await fetchDashboardPlaceholder(PLACEHOLDER_NOTES);
              set({
                quickNotes,
                widgets: setWidget(get().widgets, id, {
                  loadState: quickNotes.length ? 'ready' : 'empty',
                }),
              });
              break;
            }
            case 'upcoming-meetings': {
              const upcomingMeetings = await fetchDashboardPlaceholder(PLACEHOLDER_MEETINGS);
              set({
                upcomingMeetings,
                widgets: setWidget(get().widgets, id, {
                  loadState: upcomingMeetings.length ? 'ready' : 'empty',
                }),
              });
              break;
            }
            default:
              set({
                widgets: setWidget(get().widgets, id, { loadState: 'ready' }),
              });
          }
        } catch (error) {
          set({
            widgets: setWidget(get().widgets, id, {
              loadState: 'error',
              error: error instanceof Error ? error.message : 'Widget failed to load.',
            }),
          });
        }
      },

      refreshAll: async (workspaceName = 'Primordial Studio', userName = 'Alex') => {
        set({ status: 'loading', error: null });
        try {
          const summary = await fetchDashboardPlaceholder(
            buildDashboardSummary(workspaceName, userName),
          );
          set({ summary });

          await Promise.all(
            DEFAULT_WIDGET_IDS.map(async (id) => {
              await get().refreshWidget(id);
            }),
          );

          set({ status: 'ready' });
        } catch (error) {
          set({
            status: 'error',
            error:
              error instanceof Error ? error.message : 'Dashboard summary could not be loaded.',
          });
        }
      },
    }),
    {
      name: 'primordial-dashboard-preferences',
      partialize: (state) => ({
        preferences: state.preferences,
        filters: state.filters,
        widgets: Object.fromEntries(
          Object.entries(state.widgets).map(([id, widget]) => [
            id,
            { id: widget.id, collapsed: widget.collapsed, loadState: 'idle', error: null },
          ]),
        ) as Record<DashboardWidgetId, DashboardWidgetState>,
      }),
    },
  ),
);
