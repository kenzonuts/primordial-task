import type { ReactElement, ReactNode } from 'react';

import { WidgetCard } from '@features/dashboard/components/widget-card';
import { WidgetFooter } from '@features/dashboard/components/widget-footer';
import { WidgetHeader } from '@features/dashboard/components/widget-header';
import { WidgetToolbar } from '@features/dashboard/components/widget-toolbar';
import { useDashboardStore } from '@features/dashboard/store/dashboard-store';
import type { DashboardWidgetId } from '@features/dashboard/types';
import { EmptyState } from '@shared/ui/composites/empty-state';
import { Alert } from '@shared/ui/feedback/alert';
import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import { Button } from '@shared/ui/primitives/button';
import { Skeleton } from '@shared/ui/primitives/skeleton';

type DashboardWidgetProps = {
  readonly id: DashboardWidgetId;
  readonly title: string;
  readonly count?: number;
  readonly children?: ReactNode;
  readonly emptyTitle?: string;
  readonly emptyDescription?: string;
  readonly onViewAll?: () => void;
  readonly viewAllLabel?: string;
  readonly className?: string;
};

const WidgetBodySkeleton = (): ReactElement => {
  return (
    <Stack gap={12} aria-hidden>
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-5/6" />
    </Stack>
  );
};

export const DashboardWidget = ({
  id,
  title,
  count,
  children,
  emptyTitle = 'Nothing here yet',
  emptyDescription = 'Items will appear when data is available.',
  onViewAll,
  viewAllLabel,
  className,
}: DashboardWidgetProps): ReactElement => {
  const widget = useDashboardStore((state) => state.widgets[id]);
  const refreshWidget = useDashboardStore((state) => state.refreshWidget);
  const toggleWidgetCollapsed = useDashboardStore((state) => state.toggleWidgetCollapsed);

  const collapsed = widget?.collapsed ?? false;
  const loadState = widget?.loadState ?? 'idle';
  const error = widget?.error ?? null;
  const refreshing = loadState === 'loading';

  const handleRefresh = (): void => {
    void refreshWidget(id);
  };

  const handleToggleCollapsed = (): void => {
    toggleWidgetCollapsed(id);
  };

  let body: ReactNode = children;

  if (refreshing && !children) {
    body = <WidgetBodySkeleton />;
  } else if (loadState === 'loading' && !children) {
    body = <WidgetBodySkeleton />;
  } else if (loadState === 'error') {
    body = (
      <Alert variant="danger" title="Unable to load widget">
        <Stack gap={12}>
          <span>{error ?? 'Something went wrong while loading this section.'}</span>
          <div>
            <Button type="button" variant="secondary" size="sm" onClick={handleRefresh}>
              Retry
            </Button>
          </div>
        </Stack>
      </Alert>
    );
  } else if (loadState === 'empty') {
    body = <EmptyState className="px-2 py-8" title={emptyTitle} description={emptyDescription} />;
  } else if (loadState === 'loading') {
    body = <WidgetBodySkeleton />;
  }

  const contentId = `dashboard-widget-${id}-content`;

  return (
    <WidgetCard
      className={cn('ds-transition-fast', className)}
      aria-labelledby={`dashboard-widget-${id}-title`}
    >
      <WidgetHeader
        title={title}
        count={count}
        actions={
          <WidgetToolbar
            collapsed={collapsed}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            onToggleCollapsed={handleToggleCollapsed}
          />
        }
      />

      <div
        id={contentId}
        hidden={collapsed}
        aria-hidden={collapsed || undefined}
        className={cn('mt-3 ds-transition-fast', collapsed && 'pointer-events-none')}
      >
        {body}
        {loadState === 'ready' || (loadState !== 'empty' && loadState !== 'error' && children) ? (
          <WidgetFooter onViewAll={onViewAll} viewAllLabel={viewAllLabel} />
        ) : null}
      </div>

      <span id={`dashboard-widget-${id}-title`} className="sr-only">
        {title}
      </span>
    </WidgetCard>
  );
};

export type { DashboardWidgetProps };
