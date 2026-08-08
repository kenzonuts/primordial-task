import type { ReactElement } from 'react';
import { useEffect } from 'react';

import { CalendarPage } from '@features/calendar/pages/calendar-page';
import { useCalendarViewStore } from '@features/calendar/store';

/**
 * Dedicated timeline entry — same calendar shell forced into timeline view.
 */
export const TimelinePage = (): ReactElement => {
  const setView = useCalendarViewStore((state) => state.setView);

  useEffect(() => {
    setView('timeline');
  }, [setView]);

  return <CalendarPage forcedView="timeline" />;
};
