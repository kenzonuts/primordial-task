import type { ReactElement } from 'react';

import { DashboardWidget } from '@features/dashboard/components';
import { useDashboardStore } from '@features/dashboard/store/dashboard-store';
import { Inline } from '@shared/ui/layout/inline';
import { Text } from '@shared/ui/typography/text';

export const UpcomingMeetingsWidget = (): ReactElement => {
  const meetings = useDashboardStore((state) => state.upcomingMeetings);

  return (
    <DashboardWidget
      id="upcoming-meetings"
      title="Upcoming Meetings"
      count={meetings.length}
      emptyTitle="No meetings today."
      emptyDescription="Scheduled meetings will appear here."
    >
      <ul className="m-0 flex list-none flex-col gap-8 p-0">
        {meetings.map((meeting) => (
          <li key={meeting.id}>
            <Inline gap={8} align="center" justify="between" className="min-w-0">
              <Text as="p" variant="body-sm" truncate className="min-w-0 font-medium">
                {meeting.title}
              </Text>
              <Text as="time" variant="caption" muted className="shrink-0 tabular-nums">
                {meeting.timeLabel}
              </Text>
            </Inline>
          </li>
        ))}
      </ul>
    </DashboardWidget>
  );
};
