import type { ReactElement } from 'react';

import { DashboardWidget } from '@features/dashboard/components';
import { useDashboardStore } from '@features/dashboard/store/dashboard-store';
import { Stack } from '@shared/ui/layout/stack';
import { Text } from '@shared/ui/typography/text';

export const QuickNotesWidget = (): ReactElement => {
  const notes = useDashboardStore((state) => state.quickNotes);

  return (
    <DashboardWidget
      id="quick-notes"
      title="Quick Notes"
      count={notes.length}
      emptyTitle="No notes yet."
      emptyDescription="Capture short reminders for the day."
    >
      <Stack gap={12}>
        {notes.map((note) => (
          <div key={note.id} className="rounded-md border border-border-subtle px-3 py-2">
            <Text as="p" variant="body-sm">
              {note.body}
            </Text>
            <Text as="p" variant="caption" muted className="mt-4">
              {note.updatedLabel}
            </Text>
          </div>
        ))}
      </Stack>
    </DashboardWidget>
  );
};
