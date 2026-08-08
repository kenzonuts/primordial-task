import type { PropsWithChildren, ReactElement } from 'react';
import { createContext, useContext, useEffect, useMemo } from 'react';

import { useAnalyticsFilterStore } from '@features/analytics/store/analytics-stores';
import { useWorkspaceContext } from '@features/workspace/context/workspace-context';

export interface AnalyticsContextValue {
  readonly workspaceId: string | null;
}

const AnalyticsContext = createContext<AnalyticsContextValue | null>(null);

export const AnalyticsProvider = ({ children }: PropsWithChildren): ReactElement => {
  const { currentWorkspace } = useWorkspaceContext();
  const workspaceId = currentWorkspace?.id ?? null;
  const setFilters = useAnalyticsFilterStore((state) => state.setFilters);

  useEffect(() => {
    setFilters({ workspaceId });
  }, [workspaceId, setFilters]);

  const value = useMemo(() => ({ workspaceId }), [workspaceId]);
  return <AnalyticsContext.Provider value={value}>{children}</AnalyticsContext.Provider>;
};

export const useAnalyticsContext = (): AnalyticsContextValue => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalyticsContext must be used within AnalyticsProvider');
  }
  return context;
};
