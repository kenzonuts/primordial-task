import type {
  DashboardActivityItem,
  DashboardInsight,
  DashboardMeeting,
  DashboardNote,
  DashboardPinnedItem,
  DashboardProjectPreview,
  DashboardRecommendation,
  DashboardRisk,
  DashboardSummary,
  DashboardTaskPreview,
} from '@features/dashboard/types';

const delay = async (ms = 280): Promise<void> => {
  await new Promise((resolve) => {
    globalThis.setTimeout(resolve, ms);
  });
};

const greetingForHour = (hour: number): string => {
  if (hour < 12) {
    return 'Good morning';
  }
  if (hour < 18) {
    return 'Good afternoon';
  }
  return 'Good evening';
};

export const buildDashboardSummary = (
  workspaceName: string,
  userName = 'Alex',
): DashboardSummary => {
  const now = new Date();
  return {
    greeting: `${greetingForHour(now.getHours())}, ${userName}.`,
    dateLabel: now.toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    }),
    workspaceName,
    summaryLine: '6 tasks due today, 2 projects need attention.',
    lastSyncLabel: 'Synced just now',
    tasksDueToday: 6,
    projectsNeedingAttention: 2,
  };
};

export const PLACEHOLDER_TODAYS_TASKS: readonly DashboardTaskPreview[] = [
  {
    id: 'task-1',
    title: 'Finalize auth session refresh flow',
    projectName: 'Primordial Core',
    status: 'in_progress',
    priority: 'high',
    dueLabel: 'Due today · 2:00 PM',
    assigneeInitials: 'AR',
  },
  {
    id: 'task-2',
    title: 'Review workspace switcher persistence',
    projectName: 'Workspace',
    status: 'todo',
    priority: 'medium',
    dueLabel: 'Due today · 4:30 PM',
    assigneeInitials: 'SC',
  },
  {
    id: 'task-3',
    title: 'Polish dashboard empty states',
    projectName: 'Design System',
    status: 'todo',
    priority: 'medium',
    dueLabel: 'Due today',
    assigneeInitials: 'AR',
  },
  {
    id: 'task-4',
    title: 'Draft AI summary widget copy',
    projectName: 'AI Workspace',
    status: 'blocked',
    priority: 'urgent',
    dueLabel: 'Due today · blocked',
    assigneeInitials: 'JN',
  },
  {
    id: 'task-5',
    title: 'Update command palette placeholders',
    projectName: 'Shell',
    status: 'todo',
    priority: 'low',
    dueLabel: 'Due today',
    assigneeInitials: 'AR',
  },
  {
    id: 'task-6',
    title: 'Verify keyboard focus order',
    projectName: 'Accessibility',
    status: 'in_progress',
    priority: 'high',
    dueLabel: 'Due today · evening',
    assigneeInitials: 'SC',
  },
];

export const PLACEHOLDER_OVERDUE_TASKS: readonly DashboardTaskPreview[] = [
  {
    id: 'task-o1',
    title: 'Ship sidebar collapse persistence',
    projectName: 'Shell',
    status: 'todo',
    priority: 'urgent',
    dueLabel: '2 days overdue',
    daysOverdue: 2,
    assigneeInitials: 'AR',
  },
  {
    id: 'task-o2',
    title: 'Resolve invite member form validation',
    projectName: 'Workspace',
    status: 'in_progress',
    priority: 'high',
    dueLabel: '1 day overdue',
    daysOverdue: 1,
    assigneeInitials: 'SC',
  },
  {
    id: 'task-o3',
    title: 'Document RBAC permission matrix',
    projectName: 'Workspace',
    status: 'todo',
    priority: 'medium',
    dueLabel: '3 days overdue',
    daysOverdue: 3,
    assigneeInitials: 'JN',
  },
];

export const PLACEHOLDER_DEADLINES: readonly DashboardTaskPreview[] = [
  {
    id: 'task-d1',
    title: 'Release candidate checklist',
    projectName: 'Primordial Core',
    status: 'todo',
    priority: 'high',
    dueLabel: 'Tomorrow',
    assigneeInitials: 'AR',
  },
  {
    id: 'task-d2',
    title: 'Stakeholder demo walkthrough',
    projectName: 'Product',
    status: 'todo',
    priority: 'medium',
    dueLabel: 'Thu',
    assigneeInitials: 'SC',
  },
  {
    id: 'task-d3',
    title: 'Accessibility audit pass',
    projectName: 'Design System',
    status: 'in_progress',
    priority: 'high',
    dueLabel: 'Fri',
    assigneeInitials: 'JN',
  },
  {
    id: 'task-d4',
    title: 'API client skeleton review',
    projectName: 'Developer Workspace',
    status: 'todo',
    priority: 'low',
    dueLabel: 'Next Mon',
    assigneeInitials: 'AR',
  },
  {
    id: 'task-d5',
    title: 'Calendar module kickoff notes',
    projectName: 'Calendar',
    status: 'todo',
    priority: 'medium',
    dueLabel: 'Next Tue',
    assigneeInitials: 'SC',
  },
];

export const PLACEHOLDER_PROJECTS: readonly DashboardProjectPreview[] = [
  {
    id: 'proj-1',
    name: 'Primordial Core',
    progress: 72,
    status: 'on_track',
    updatedLabel: 'Updated 1h ago',
    isFavorite: true,
    isPinned: true,
  },
  {
    id: 'proj-2',
    name: 'Workspace Management',
    progress: 58,
    status: 'on_track',
    updatedLabel: 'Updated 3h ago',
    isFavorite: true,
    isPinned: false,
  },
  {
    id: 'proj-3',
    name: 'Design System',
    progress: 91,
    status: 'at_risk',
    updatedLabel: 'Updated yesterday',
    isFavorite: false,
    isPinned: true,
  },
  {
    id: 'proj-4',
    name: 'AI Workspace',
    progress: 24,
    status: 'blocked',
    updatedLabel: 'Updated 2d ago',
    isFavorite: true,
    isPinned: false,
  },
];

export const PLACEHOLDER_ACTIVITY: readonly DashboardActivityItem[] = [
  {
    id: 'act-1',
    actor: 'Alex Rivera',
    action: 'completed',
    target: 'Session restore foundation',
    timestampLabel: '12 min ago',
  },
  {
    id: 'act-2',
    actor: 'Sam Chen',
    action: 'commented on',
    target: 'Workspace switcher menu',
    timestampLabel: '34 min ago',
  },
  {
    id: 'act-3',
    actor: 'Jordan Lee',
    action: 'moved',
    target: 'Auth guard polish → In Progress',
    timestampLabel: '1h ago',
  },
  {
    id: 'act-4',
    actor: 'Alex Rivera',
    action: 'created',
    target: 'Dashboard widget architecture',
    timestampLabel: '2h ago',
  },
  {
    id: 'act-5',
    actor: 'Sam Chen',
    action: 'updated',
    target: 'Role badge styles',
    timestampLabel: '3h ago',
  },
  {
    id: 'act-6',
    actor: 'System',
    action: 'synced',
    target: 'Local workspace cache',
    timestampLabel: '4h ago',
  },
  {
    id: 'act-7',
    actor: 'Jordan Lee',
    action: 'assigned',
    target: 'Keyboard navigation pass',
    timestampLabel: 'Yesterday',
  },
  {
    id: 'act-8',
    actor: 'Alex Rivera',
    action: 'pinned',
    target: 'Primordial Core',
    timestampLabel: 'Yesterday',
  },
];

export const PLACEHOLDER_PINNED: readonly DashboardPinnedItem[] = [
  { id: 'pin-1', title: 'Primordial Core', kind: 'project' },
  { id: 'pin-2', title: 'Auth session checklist', kind: 'task' },
  { id: 'pin-3', title: 'Shell landmarks notes', kind: 'note' },
  { id: 'pin-4', title: 'Design tokens reference', kind: 'doc' },
  { id: 'pin-5', title: 'Workspace RBAC matrix', kind: 'doc' },
];

export const PLACEHOLDER_RECOMMENDATIONS: readonly DashboardRecommendation[] = [
  {
    id: 'rec-1',
    title: 'Clear overdue work first',
    body: 'Resolve the 3 overdue tasks before expanding today’s list.',
    tone: 'warning',
  },
  {
    id: 'rec-2',
    title: 'Unblock AI summary copy',
    body: 'A blocked task is preventing the daily AI summary draft.',
    tone: 'info',
  },
  {
    id: 'rec-3',
    title: 'Keep Design System on track',
    body: 'Progress is high but marked at risk — review remaining polish.',
    tone: 'success',
  },
];

export const PLACEHOLDER_RISKS: readonly DashboardRisk[] = [
  {
    id: 'risk-1',
    title: 'Blocked critical path',
    body: 'AI Workspace has a blocked task affecting today’s recommendations.',
    severity: 'danger',
  },
  {
    id: 'risk-2',
    title: 'At-risk project',
    body: 'Design System is near completion but flagged for attention.',
    severity: 'warning',
  },
];

export const PLACEHOLDER_INSIGHTS: readonly DashboardInsight[] = [
  {
    id: 'ins-1',
    label: 'Focus score',
    value: '78%',
    hint: 'Based on completed high-priority work this week.',
  },
  {
    id: 'ins-2',
    label: 'Throughput',
    value: '14 tasks',
    hint: 'Completed in the last 7 days (placeholder).',
  },
  {
    id: 'ins-3',
    label: 'Attention load',
    value: '5 items',
    hint: 'Overdue + blocked items needing review.',
  },
];

export const PLACEHOLDER_MEETINGS: readonly DashboardMeeting[] = [
  { id: 'meet-1', title: 'Daily standup', timeLabel: '9:30 AM' },
  { id: 'meet-2', title: 'Design critique', timeLabel: '1:00 PM' },
  { id: 'meet-3', title: 'Release readiness', timeLabel: '4:00 PM' },
];

export const PLACEHOLDER_NOTES: readonly DashboardNote[] = [
  {
    id: 'note-1',
    body: 'Keep dashboard widgets reusable for Analytics later.',
    updatedLabel: 'Today',
  },
  {
    id: 'note-2',
    body: 'Utility panel should host AI summary without becoming a chat.',
    updatedLabel: 'Yesterday',
  },
];

export const PLACEHOLDER_AI_SUMMARY =
  'Focus on clearing overdue shell and workspace tasks, then finish today’s auth and accessibility items. Two projects need attention; AI Workspace remains blocked pending copy.';

/** Simulates async dashboard loads with isolated placeholder datasets. */
export const fetchDashboardPlaceholder = async <T>(data: T): Promise<T> => {
  await delay();
  return data;
};
