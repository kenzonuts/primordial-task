export const APP_ROUTES = {
  dashboard: '/dashboard',
  projects: '/projects',
  tasks: '/tasks',
  kanban: '/kanban',
  calendar: '/calendar',
  analytics: '/analytics',
  aiWorkspace: '/ai-workspace',
  developerWorkspace: '/developer-workspace',
  settings: '/settings',
} as const;

export type AppRoutePath = (typeof APP_ROUTES)[keyof typeof APP_ROUTES];

export type NavigationGroupId = 'primary' | 'intelligence' | 'developer' | 'system';

export interface NavigationItem {
  readonly id: string;
  readonly label: string;
  readonly path: AppRoutePath;
  readonly icon: string;
  readonly group: NavigationGroupId;
  readonly description: string;
}

export interface NavigationGroup {
  readonly id: NavigationGroupId;
  readonly label: string;
  readonly items: readonly NavigationItem[];
}

export type UtilityPanelMode =
  'ai-summary' | 'notifications' | 'task-details' | 'activity' | 'inspector' | 'placeholder';

export interface ShellWorkspaceOption {
  readonly id: string;
  readonly name: string;
  readonly initials: string;
  readonly role: string;
}
