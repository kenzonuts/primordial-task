import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PLACEHOLDER_TODAYS_TASKS } from '@features/dashboard/data/placeholder-data';
import { useDashboardStore } from '@features/dashboard/store/dashboard-store';

describe('dashboard store', () => {
  beforeEach(() => {
    window.localStorage.clear();
    useDashboardStore.setState({
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
    });
  });

  it('refreshAll loads placeholder tasks and summary', async () => {
    await useDashboardStore.getState().refreshAll('Primordial Studio', 'Demo');
    const state = useDashboardStore.getState();

    expect(state.status).toBe('ready');
    expect(state.summary?.greeting).toMatch(/Demo/);
    expect(state.summary?.workspaceName).toBe('Primordial Studio');
    expect(state.todaysTasks.length).toBe(PLACEHOLDER_TODAYS_TASKS.length);
    expect(state.todaysTasks[0]?.title).toBe(PLACEHOLDER_TODAYS_TASKS[0]?.title);
    expect(state.widgets['todays-tasks']?.loadState).toBe('ready');
  });

  it('setFilters updates query for client-side filtering', () => {
    useDashboardStore.getState().setFilters({ query: 'auth' });
    expect(useDashboardStore.getState().filters.query).toBe('auth');
  });

  it('refreshWidget isolates a single widget load', async () => {
    vi.useFakeTimers();
    const promise = useDashboardStore.getState().refreshWidget('todays-tasks');
    await vi.runAllTimersAsync();
    await promise;
    vi.useRealTimers();

    const state = useDashboardStore.getState();
    expect(state.todaysTasks.length).toBeGreaterThan(0);
    expect(state.widgets['todays-tasks']?.loadState).toBe('ready');
  });
});
