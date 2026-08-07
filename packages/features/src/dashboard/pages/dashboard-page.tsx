import { useEffect, type ReactElement } from 'react';

import { useAuthStore } from '@features/auth/store/auth-store';
import {
  DashboardErrorState,
  DashboardHeader,
  DashboardSkeleton,
} from '@features/dashboard/components';
import { useDashboardStore } from '@features/dashboard/store/dashboard-store';
import type { DashboardScopeFilter, DashboardTimeFilter } from '@features/dashboard/types';
import {
  FavoriteProjectsWidget,
  OverdueTasksWidget,
  PinnedItemsWidget,
  ProjectProgressWidget,
  RecentActivityWidget,
  RecentProjectsWidget,
  TodaysTasksWidget,
  UpcomingDeadlinesWidget,
} from '@features/dashboard/widgets';
import { useWorkspaceContext } from '@features/workspace/context/workspace-context';
import { SearchInput } from '@shared/ui/composites/search-input';
import { Inline } from '@shared/ui/layout/inline';
import { Stack } from '@shared/ui/layout/stack';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/ui/primitives/select';

const TIME_OPTIONS: readonly { readonly value: DashboardTimeFilter; readonly label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This week' },
  { value: 'month', label: 'This month' },
];

const SCOPE_OPTIONS: readonly { readonly value: DashboardScopeFilter; readonly label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'favorites', label: 'Favorites' },
  { value: 'pinned', label: 'Pinned' },
  { value: 'archived', label: 'Archived' },
];

export const DashboardPage = (): ReactElement => {
  const { currentWorkspace } = useWorkspaceContext();
  const user = useAuthStore((state) => state.user);
  const summary = useDashboardStore((state) => state.summary);
  const status = useDashboardStore((state) => state.status);
  const error = useDashboardStore((state) => state.error);
  const filters = useDashboardStore((state) => state.filters);
  const setFilters = useDashboardStore((state) => state.setFilters);
  const refreshAll = useDashboardStore((state) => state.refreshAll);

  useEffect(() => {
    const workspaceName = currentWorkspace?.name ?? 'Primordial Studio';
    const userName = user?.fullName?.split(' ')[0] ?? 'Alex';
    void refreshAll(workspaceName, userName);
  }, [currentWorkspace?.name, user?.fullName, refreshAll]);

  const showSkeleton = status === 'loading' && !summary;
  const showError = status === 'error' && !summary;

  return (
    <div className="mx-auto w-full max-w-[1600px] p-24">
      <Stack gap={24}>
        {showError ? (
          <DashboardErrorState
            message={error ?? undefined}
            onRetry={() => {
              const workspaceName = currentWorkspace?.name ?? 'Primordial Studio';
              const userName = user?.fullName?.split(' ')[0] ?? 'Alex';
              void refreshAll(workspaceName, userName);
            }}
          />
        ) : null}

        {showSkeleton ? (
          <DashboardSkeleton />
        ) : (
          <>
            <DashboardHeader />

            <Inline gap={12} align="center" wrap className="w-full min-w-0">
              <Select
                value={filters.time}
                onValueChange={(value) => {
                  setFilters({ time: value as DashboardTimeFilter });
                }}
              >
                <SelectTrigger size="sm" className="w-[140px]" aria-label="Time filter">
                  <SelectValue placeholder="Time" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.scope}
                onValueChange={(value) => {
                  setFilters({ scope: value as DashboardScopeFilter });
                }}
              >
                <SelectTrigger size="sm" className="w-[140px]" aria-label="Scope filter">
                  <SelectValue placeholder="Scope" />
                </SelectTrigger>
                <SelectContent>
                  {SCOPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <SearchInput
                value={filters.query}
                onChange={(event) => {
                  setFilters({ query: event.target.value });
                }}
                onClear={() => {
                  setFilters({ query: '' });
                }}
                placeholder="Filter tasks and projects…"
                aria-label="Filter dashboard items"
                className="min-w-[220px] max-w-sm flex-1"
              />
            </Inline>

            <div className="grid grid-cols-1 gap-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,4fr)]">
              <div className="flex min-w-0 flex-col gap-16">
                <TodaysTasksWidget />
                <OverdueTasksWidget />
                <UpcomingDeadlinesWidget />
              </div>
              <div className="flex min-w-0 flex-col gap-16">
                <RecentProjectsWidget />
                <ProjectProgressWidget />
                <RecentActivityWidget />
                <PinnedItemsWidget />
                <FavoriteProjectsWidget />
              </div>
            </div>
          </>
        )}
      </Stack>
    </div>
  );
};
