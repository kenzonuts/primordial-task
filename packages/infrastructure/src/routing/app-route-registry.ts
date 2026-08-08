import { ROUTES } from '@core/app/constants';
import { InMemoryRouteRegistry } from '@core/routing/route-registry';

export const createAppRouteRegistry = (): InMemoryRouteRegistry => {
  const registry = new InMemoryRouteRegistry();

  const routes = [
    { id: 'splash', path: ROUTES.root, title: 'Splash' },
    { id: 'auth-check', path: ROUTES.authCheck, title: 'Authentication Check' },
    { id: 'welcome', path: ROUTES.welcome, title: 'Welcome' },
    { id: 'login', path: ROUTES.login, title: 'Login' },
    { id: 'register', path: ROUTES.register, title: 'Register' },
    { id: 'forgot-password', path: ROUTES.forgotPassword, title: 'Forgot Password' },
    { id: 'verify-email', path: ROUTES.verifyEmail, title: 'Verify Email' },
    { id: 'workspaces', path: ROUTES.workspaces, title: 'Workspaces' },
    { id: 'select-workspace', path: ROUTES.selectWorkspace, title: 'Select Workspace' },
    { id: 'dashboard', path: ROUTES.dashboard, title: 'Dashboard' },
    { id: 'projects', path: ROUTES.projects, title: 'Projects' },
    { id: 'projects-create', path: `${ROUTES.projects}/new`, title: 'Create Project' },
    { id: 'project-detail', path: `${ROUTES.projects}/:id`, title: 'Project' },
    { id: 'project-edit', path: `${ROUTES.projects}/:id/edit`, title: 'Edit Project' },
    { id: 'project-settings', path: `${ROUTES.projects}/:id/settings`, title: 'Project Settings' },
    { id: 'tasks', path: ROUTES.tasks, title: 'Tasks' },
    { id: 'tasks-create', path: `${ROUTES.tasks}/new`, title: 'Create Task' },
    { id: 'task-detail', path: `${ROUTES.tasks}/:id`, title: 'Task' },
    { id: 'task-edit', path: `${ROUTES.tasks}/:id/edit`, title: 'Edit Task' },
    { id: 'task-history', path: `${ROUTES.tasks}/:id/history`, title: 'Task History' },
    { id: 'kanban', path: ROUTES.kanban, title: 'Kanban' },
    { id: 'kanban-create', path: `${ROUTES.kanban}/new`, title: 'Create Board' },
    { id: 'kanban-board', path: `${ROUTES.kanban}/:boardId`, title: 'Board' },
    { id: 'kanban-overview', path: `${ROUTES.kanban}/:boardId/overview`, title: 'Board Overview' },
    { id: 'kanban-settings', path: `${ROUTES.kanban}/:boardId/settings`, title: 'Board Settings' },
    { id: 'calendar', path: ROUTES.calendar, title: 'Calendar' },
    { id: 'calendar-timeline', path: `${ROUTES.calendar}/timeline`, title: 'Timeline' },
    { id: 'calendar-agenda', path: `${ROUTES.calendar}/agenda`, title: 'Agenda' },
    { id: 'calendar-day', path: `${ROUTES.calendar}/day/:date`, title: 'Day' },
    { id: 'analytics', path: ROUTES.analytics, title: 'Analytics' },
    { id: 'ai-workspace', path: ROUTES.aiWorkspace, title: 'AI Workspace' },
    { id: 'developer-workspace', path: ROUTES.developerWorkspace, title: 'Developer Workspace' },
    { id: 'settings', path: ROUTES.settings, title: 'Settings' },
    { id: 'session-expired', path: ROUTES.sessionExpired, title: 'Session Expired' },
  ] as const;

  for (const route of routes) {
    registry.register({
      ...route,
      lazy: false,
    });
  }

  return registry;
};
