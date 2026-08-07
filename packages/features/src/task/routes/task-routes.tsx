import type { ReactNode } from 'react';
import { Route } from 'react-router-dom';

import {
  TaskCreatePage,
  TaskDetailPage,
  TaskEditPage,
  TaskHistoryPage,
  TaskListPage,
} from '@features/task/pages';
import { TASK_ROUTES } from '@features/task/types';

/**
 * Nested task management routes for the authenticated shell.
 * Spread as children of AuthenticatedLayout Route alongside AppShellRoutes.
 */
export const TaskRoutes: ReactNode = (
  <>
    <Route path={TASK_ROUTES.list} element={<TaskListPage />} />
    <Route path={TASK_ROUTES.create} element={<TaskCreatePage />} />
    <Route path={TASK_ROUTES.detail} element={<TaskDetailPage />} />
    <Route path={TASK_ROUTES.edit} element={<TaskEditPage />} />
    <Route path={TASK_ROUTES.history} element={<TaskHistoryPage />} />
  </>
);
