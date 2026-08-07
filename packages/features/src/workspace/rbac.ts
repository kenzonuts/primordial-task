import type { WorkspacePermission, WorkspaceRole } from '@features/workspace/types';

export const WORKSPACE_ROLE_LABELS: Record<WorkspaceRole, string> = {
  owner: 'Owner',
  administrator: 'Administrator',
  member: 'Member',
  viewer: 'Viewer',
  guest: 'Guest',
};

export const WORKSPACE_ROLE_RANK: Record<WorkspaceRole, number> = {
  owner: 50,
  administrator: 40,
  member: 30,
  viewer: 20,
  guest: 10,
};

const ROLE_PERMISSIONS: Record<WorkspaceRole, readonly WorkspacePermission[]> = {
  owner: [
    'workspace.view',
    'workspace.edit',
    'workspace.archive',
    'workspace.delete',
    'workspace.transfer',
    'members.view',
    'members.invite',
    'members.remove',
    'members.role.assign',
    'settings.view',
    'settings.edit',
    'billing.view',
  ],
  administrator: [
    'workspace.view',
    'workspace.edit',
    'workspace.archive',
    'members.view',
    'members.invite',
    'members.remove',
    'members.role.assign',
    'settings.view',
    'settings.edit',
  ],
  member: ['workspace.view', 'members.view', 'settings.view'],
  viewer: ['workspace.view', 'members.view', 'settings.view'],
  guest: ['workspace.view'],
};

/** Abstract permission evaluator for future server-backed RBAC. */
export const hasWorkspacePermission = (
  role: WorkspaceRole,
  permission: WorkspacePermission,
): boolean => {
  return ROLE_PERMISSIONS[role].includes(permission);
};

export const canAssignRole = (actor: WorkspaceRole, target: WorkspaceRole): boolean => {
  if (target === 'owner') {
    return false;
  }
  return WORKSPACE_ROLE_RANK[actor] > WORKSPACE_ROLE_RANK[target];
};

export const WORKSPACE_COLORS = [
  '#E6E6E6',
  '#A8A8A8',
  '#858585',
  '#4ADE80',
  '#FACC15',
  '#F87171',
  '#60A5FA',
] as const;
