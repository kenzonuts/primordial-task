import type { ProjectHealth, ProjectStatus, ProjectVisibility } from '@features/project/types';

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  planning: 'Planning',
  active: 'Active',
  on_hold: 'On Hold',
  completed: 'Completed',
  archived: 'Archived',
  cancelled: 'Cancelled',
};

export const PROJECT_VISIBILITY_LABELS: Record<ProjectVisibility, string> = {
  workspace: 'Workspace',
  private: 'Private',
  team: 'Team',
  public: 'Public',
};

export const PROJECT_HEALTH_LABELS: Record<ProjectHealth, string> = {
  healthy: 'Healthy',
  at_risk: 'At risk',
  critical: 'Critical',
};

export const PROJECT_COLORS = [
  '#E6E6E6',
  '#A8A8A8',
  '#858585',
  '#4ADE80',
  '#FACC15',
  '#F87171',
  '#60A5FA',
] as const;

export const PROJECT_ICONS = [
  'FolderKanban',
  'Box',
  'Layers',
  'Code2',
  'Sparkles',
  'Rocket',
] as const;
