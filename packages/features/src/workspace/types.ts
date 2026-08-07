export const WORKSPACE_ROUTES = {
  list: '/workspaces',
  create: '/workspaces/new',
  detail: '/workspaces/:id',
  edit: '/workspaces/:id/edit',
  settings: '/workspaces/:id/settings',
} as const;

export const workspaceDetailPath = (id: string): string => `/workspaces/${id}`;
export const workspaceEditPath = (id: string): string => `/workspaces/${id}/edit`;
export const workspaceSettingsPath = (id: string): string => `/workspaces/${id}/settings`;

export type WorkspaceRole = 'owner' | 'administrator' | 'member' | 'viewer' | 'guest';

export type WorkspaceVisibility = 'private' | 'team' | 'public';

export type WorkspaceSettingsSection =
  'general' | 'appearance' | 'members' | 'permissions' | 'billing' | 'integrations' | 'danger';

export interface WorkspaceOwner {
  readonly id: string;
  readonly fullName: string;
  readonly email: string;
}

export interface Workspace {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly description: string;
  readonly logoUrl?: string;
  readonly color: string;
  readonly owner: WorkspaceOwner;
  readonly role: WorkspaceRole;
  readonly memberCount: number;
  readonly visibility: WorkspaceVisibility;
  readonly isFavorite: boolean;
  readonly lastUsedAt: number;
  readonly createdAt: number;
  readonly updatedAt: number;
  readonly archivedAt: number | null;
}

export interface WorkspaceMember {
  readonly id: string;
  readonly userId: string;
  readonly fullName: string;
  readonly email: string;
  readonly avatarUrl?: string;
  readonly role: WorkspaceRole;
  readonly status: 'active' | 'invited' | 'suspended';
  readonly lastActiveAt: number | null;
  readonly presence: 'online' | 'away' | 'offline';
}

export type WorkspacePermission =
  | 'workspace.view'
  | 'workspace.edit'
  | 'workspace.archive'
  | 'workspace.delete'
  | 'workspace.transfer'
  | 'members.view'
  | 'members.invite'
  | 'members.remove'
  | 'members.role.assign'
  | 'settings.view'
  | 'settings.edit'
  | 'billing.view';

export type WorkspaceSortKey = 'name' | 'recent' | 'created' | 'favorites';

export type WorkspaceFilterKey = 'all' | 'favorites' | 'archived' | 'owned';

export interface WorkspaceFiltersState {
  readonly query: string;
  readonly sort: WorkspaceSortKey;
  readonly filter: WorkspaceFilterKey;
}

export interface CreateWorkspaceInput {
  readonly name: string;
  readonly slug: string;
  readonly description?: string;
  readonly color: string;
  readonly logoUrl?: string;
  readonly visibility: WorkspaceVisibility;
}

export interface UpdateWorkspaceInput {
  readonly name?: string;
  readonly slug?: string;
  readonly description?: string;
  readonly color?: string;
  readonly logoUrl?: string;
  readonly visibility?: WorkspaceVisibility;
}

export interface InviteMemberInput {
  readonly email: string;
  readonly role: Exclude<WorkspaceRole, 'owner'>;
}

export interface WorkspacePreferences {
  readonly defaultView: 'dashboard' | 'projects' | 'tasks';
  readonly density: 'comfortable' | 'compact';
  readonly showArchivedInSwitcher: boolean;
}
