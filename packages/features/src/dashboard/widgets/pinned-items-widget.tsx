import type { ReactElement } from 'react';

import { DashboardWidget } from '@features/dashboard/components';
import { filterPinnedByQuery } from '@features/dashboard/lib/filter-items';
import { useDashboardStore } from '@features/dashboard/store/dashboard-store';
import type { DashboardPinnedItem } from '@features/dashboard/types';
import { toast } from '@shared/ui/feedback/toast';
import { Inline } from '@shared/ui/layout/inline';
import { Badge } from '@shared/ui/primitives/badge';
import { Text } from '@shared/ui/typography/text';

const kindLabel = (kind: DashboardPinnedItem['kind']): string => {
  switch (kind) {
    case 'task':
      return 'Task';
    case 'project':
      return 'Project';
    case 'note':
      return 'Note';
    case 'doc':
      return 'Doc';
    default:
      return kind;
  }
};

export const PinnedItemsWidget = (): ReactElement => {
  const items = useDashboardStore((state) => state.pinnedItems);
  const query = useDashboardStore((state) => state.filters.query);
  const scope = useDashboardStore((state) => state.filters.scope);
  const scoped =
    scope === 'pinned' || scope === 'all' || scope === 'favorites'
      ? items
      : scope === 'archived'
        ? []
        : items;
  const visible = filterPinnedByQuery(scoped, query).slice(0, 5);

  return (
    <DashboardWidget
      id="pinned-items"
      title="Pinned"
      count={visible.length}
      emptyTitle="Nothing pinned yet."
      emptyDescription="Pin tasks, projects, or notes for quick access."
      onViewAll={() => {
        toast.message('Pinned items — Coming soon');
      }}
    >
      {visible.length === 0 ? (
        <Text as="p" variant="body-sm" muted>
          No pinned items match the current filters.
        </Text>
      ) : (
        <ul className="m-0 flex list-none flex-col gap-8 p-0">
          {visible.map((item) => (
            <li key={item.id}>
              <Inline gap={8} align="center" justify="between" className="min-w-0">
                <Text as="p" variant="body-sm" truncate className="min-w-0 font-medium">
                  {item.title}
                </Text>
                <Badge variant="neutral" size="sm" className="shrink-0">
                  {kindLabel(item.kind)}
                </Badge>
              </Inline>
            </li>
          ))}
        </ul>
      )}
    </DashboardWidget>
  );
};
