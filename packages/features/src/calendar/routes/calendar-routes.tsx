import type { ReactElement, ReactNode } from 'react';
import { useEffect } from 'react';
import { Route, useParams } from 'react-router-dom';

import { CalendarPage, TimelinePage } from '@features/calendar/pages';
import { useCalendarNavigationStore, useCalendarViewStore } from '@features/calendar/store';
import { CALENDAR_ROUTES } from '@features/calendar/types';
import { parseDateIso, startOfDay } from '@features/calendar/utils/date-utils';

const AgendaRoutePage = (): ReactElement => {
  const setView = useCalendarViewStore((state) => state.setView);

  useEffect(() => {
    setView('agenda');
  }, [setView]);

  return <CalendarPage forcedView="agenda" />;
};

const DayRoutePage = (): ReactElement => {
  const { date = '' } = useParams<{ date: string }>();
  const setView = useCalendarViewStore((state) => state.setView);
  const setAnchorDate = useCalendarNavigationStore((state) => state.setAnchorDate);

  useEffect(() => {
    setView('day');
    if (date) {
      const parsed = parseDateIso(date);
      if (!Number.isNaN(parsed)) {
        setAnchorDate(startOfDay(parsed));
      }
    }
  }, [date, setView, setAnchorDate]);

  return <CalendarPage forcedView="day" />;
};

/**
 * Nested calendar routes for the authenticated shell.
 * Spread as children of AuthenticatedLayout Route alongside AppShellRoutes.
 */
export const CalendarRoutes: ReactNode = (
  <>
    <Route path={CALENDAR_ROUTES.root} element={<CalendarPage />} />
    <Route path={CALENDAR_ROUTES.timeline} element={<TimelinePage />} />
    <Route path={CALENDAR_ROUTES.agenda} element={<AgendaRoutePage />} />
    <Route path={CALENDAR_ROUTES.day} element={<DayRoutePage />} />
  </>
);
