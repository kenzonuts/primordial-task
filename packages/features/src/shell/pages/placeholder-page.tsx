import type { ReactElement } from 'react';
import { useLocation } from 'react-router-dom';

import { ContentLayout } from '@features/shell/layouts/content-layout';
import { findNavigationItem } from '@features/shell/navigation';
import { EmptyState } from '@shared/ui/composites/empty-state';

/**
 * Generic Coming Soon module page driven by the current navigation item.
 */
export const ModulePlaceholderPage = (): ReactElement => {
  const location = useLocation();
  const item = findNavigationItem(location.pathname);
  const title = item?.label ?? 'Coming Soon';
  const description = item?.description ?? 'This area is not available yet.';

  return (
    <ContentLayout title={title} description={description}>
      <EmptyState className="mt-24" title="Coming soon" description={description} />
    </ContentLayout>
  );
};

/** @deprecated Prefer ModulePlaceholderPage */
export const PlaceholderPage = ModulePlaceholderPage;
