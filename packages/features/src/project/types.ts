export const PROJECT_ROUTES = {
  list: '/projects',
  create: '/projects/new',
  detail: '/projects/:id',
  edit: '/projects/:id/edit',
  settings: '/projects/:id/settings',
} as const;

export const projectDetailPath = (id: string): string => `/projects/${id}`;
export const projectEditPath = (id: string): string => `/projects/${id}/edit`;
export const projectSettingsPath = (id: string): string => `/projects/${id}/settings`;

export const PROJECT_STATUSES = [
  'planning',
  'active',
  'on_hold',
  'completed',
  'archived',
  'cancelled',
] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const PROJECT_VISIBILITIES = ['workspace', 'private', 'team', 'public'] as const;

export type ProjectVisibility = (typeof PROJECT_VISIBILITIES)[number];

export type ProjectHealth = 'healthy' | 'at_risk' | 'critical';

export type ProjectViewMode = 'grid' | 'list';

export type ProjectSortKey = 'updated' | 'name' | 'status' | 'progress' | 'favorites' | 'pinned';

export type ProjectFilterKey = 'all' | 'favorites' | 'pinned' | 'archived' | 'active';

export type ProjectSettingsSection =
  'general' | 'appearance' | 'members' | 'permissions' | 'integrations' | 'danger';

export interface ProjectOwner {
  readonly id: string;
  readonly fullName: string;
  readonly email: string;
}

export interface Project {
  readonly id: string;
  readonly workspaceId: string;
  readonly name: string;
  readonly slug: string;
  readonly description: string;
  readonly icon?: string;
  readonly coverUrl?: string;
  readonly color: string;
  readonly status: ProjectStatus;
  readonly visibility: ProjectVisibility;
  readonly health: ProjectHealth;
  readonly progress: number;
  readonly owner: ProjectOwner;
  readonly memberCount: number;
  readonly isFavorite: boolean;
  readonly isPinned: boolean;
  readonly dueLabel?: string;
  readonly lastActivityAt: number;
  readonly createdAt: number;
  readonly updatedAt: number;
  readonly archivedAt: number | null;
}

export interface ProjectMember {
  readonly id: string;
  readonly userId: string;
  readonly fullName: string;
  readonly email: string;
  readonly role: 'owner' | 'admin' | 'member' | 'viewer';
  readonly status: 'active' | 'invited';
}

export interface ProjectActivityItem {
  readonly id: string;
  readonly actor: string;
  readonly action: string;
  readonly target: string;
  readonly timestampLabel: string;
}

export interface ProjectDeadlineItem {
  readonly id: string;
  readonly title: string;
  readonly dueLabel: string;
  readonly priority: 'low' | 'medium' | 'high';
}

export interface ProjectStatistic {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly hint: string;
}

export interface CreateProjectInput {
  readonly workspaceId: string;
  readonly name: string;
  readonly slug: string;
  readonly description?: string;
  readonly icon?: string;
  readonly coverUrl?: string;
  readonly color: string;
  readonly status: ProjectStatus;
  readonly visibility: ProjectVisibility;
}

export interface UpdateProjectInput {
  readonly name?: string;
  readonly slug?: string;
  readonly description?: string;
  readonly icon?: string;
  readonly coverUrl?: string;
  readonly color?: string;
  readonly status?: ProjectStatus;
  readonly visibility?: ProjectVisibility;
}

export interface ProjectFiltersState {
  readonly query: string;
  readonly sort: ProjectSortKey;
  readonly filter: ProjectFilterKey;
  readonly view: ProjectViewMode;
}

export interface ProjectPreferences {
  readonly defaultView: ProjectViewMode;
  readonly showArchivedByDefault: boolean;
  readonly denseList: boolean;
}
