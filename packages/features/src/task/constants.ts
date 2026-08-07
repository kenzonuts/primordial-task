import type { TaskDependencyType, TaskPriority, TaskStatus, TaskType } from '@features/task/types';

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  backlog: 'Backlog',
  todo: 'To Do',
  in_progress: 'In Progress',
  in_review: 'In Review',
  blocked: 'Blocked',
  completed: 'Completed',
  cancelled: 'Cancelled',
  archived: 'Archived',
};

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
  none: 'No Priority',
};

export const TASK_TYPE_LABELS: Record<TaskType, string> = {
  task: 'Task',
  bug: 'Bug',
  feature: 'Feature',
  improvement: 'Improvement',
  epic: 'Epic',
  story: 'Story',
  research: 'Research',
  documentation: 'Documentation',
  chore: 'Chore',
};

export const TASK_DEPENDENCY_LABELS: Record<TaskDependencyType, string> = {
  blocks: 'Blocks',
  blocked_by: 'Blocked By',
  related: 'Related',
  duplicate: 'Duplicate',
  parent: 'Parent',
  child: 'Child',
};

/** Priority order for sorting (critical first). */
export const TASK_PRIORITY_RANK: Record<TaskPriority, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
  none: 4,
};

export const TASK_STATUS_RANK: Record<TaskStatus, number> = {
  backlog: 0,
  todo: 1,
  in_progress: 2,
  in_review: 3,
  blocked: 4,
  completed: 5,
  cancelled: 6,
  archived: 7,
};

export const TASK_LABEL_COLORS = [
  '#E6E6E6',
  '#60A5FA',
  '#4ADE80',
  '#FACC15',
  '#F87171',
  '#C084FC',
  '#FB923C',
] as const;
