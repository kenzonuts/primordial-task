import type { NavigationGroup } from '@features/shell/types';
import { APP_ROUTES } from '@features/shell/types';

export const NAVIGATION_GROUPS: readonly NavigationGroup[] = [
  {
    id: 'primary',
    label: 'Workspace',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        path: APP_ROUTES.dashboard,
        icon: 'LayoutDashboard',
        group: 'primary',
        description: 'Daily command center and priorities.',
      },
      {
        id: 'projects',
        label: 'Projects',
        path: APP_ROUTES.projects,
        icon: 'FolderKanban',
        group: 'primary',
        description: 'Project index and health views.',
      },
      {
        id: 'tasks',
        label: 'Tasks',
        path: APP_ROUTES.tasks,
        icon: 'CheckSquare',
        group: 'primary',
        description: 'Task list and planning views.',
      },
      {
        id: 'kanban',
        label: 'Kanban',
        path: APP_ROUTES.kanban,
        icon: 'Columns3',
        group: 'primary',
        description: 'Board-focused execution view.',
      },
      {
        id: 'calendar',
        label: 'Calendar',
        path: APP_ROUTES.calendar,
        icon: 'CalendarDays',
        group: 'primary',
        description: 'Schedule, deadlines, and meetings.',
      },
      {
        id: 'notes',
        label: 'Notes',
        path: APP_ROUTES.notes,
        icon: 'NotebookPen',
        group: 'primary',
        description: 'Notes, templates, and documentation.',
      },
      {
        id: 'analytics',
        label: 'Analytics',
        path: APP_ROUTES.analytics,
        icon: 'ChartColumn',
        group: 'primary',
        description: 'Velocity and productivity reporting.',
      },
    ],
  },
  {
    id: 'intelligence',
    label: 'Intelligence',
    items: [
      {
        id: 'ai-workspace',
        label: 'AI Workspace',
        path: APP_ROUTES.aiWorkspace,
        icon: 'Sparkles',
        group: 'intelligence',
        description: 'Contextual AI assistance.',
      },
    ],
  },
  {
    id: 'developer',
    label: 'Developer',
    items: [
      {
        id: 'developer-workspace',
        label: 'Developer Workspace',
        path: APP_ROUTES.developerWorkspace,
        icon: 'Terminal',
        group: 'developer',
        description: 'Git, database, API, and terminal tools.',
      },
    ],
  },
  {
    id: 'system',
    label: 'System',
    items: [
      {
        id: 'settings',
        label: 'Settings',
        path: APP_ROUTES.settings,
        icon: 'Settings',
        group: 'system',
        description: 'Application and workspace preferences.',
      },
    ],
  },
] as const;

export const ALL_NAVIGATION_ITEMS = NAVIGATION_GROUPS.flatMap((group) => group.items);

export const findNavigationItem = (pathname: string) => {
  const exact = ALL_NAVIGATION_ITEMS.find((item) => item.path === pathname);
  if (exact) {
    return exact;
  }

  // Nested module routes (e.g. /projects/:id) resolve to their parent nav item.
  return ALL_NAVIGATION_ITEMS.find((item) => pathname.startsWith(`${item.path}/`)) ?? null;
};
