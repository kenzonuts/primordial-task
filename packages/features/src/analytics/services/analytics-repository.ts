import {
  averageResolutionMinutes,
  blockedRatioPercent,
  buildMetricResult,
  estimatedVsActualAccuracy,
  focusScore,
  memberCapacityPercent,
  overdueRatePercent,
  productivityScore,
  projectHealthScore,
  projectRiskScore,
  taskVelocity,
  workspaceHealthPercent,
} from '@features/analytics/metrics/metric-engine';
import type {
  AnalyticsDashboardSnapshot,
  AnalyticsFilters,
  AnalyticsTimeRange,
  ChartModel,
  MemberAnalyticsRow,
  ProjectAnalyticsRow,
  WorkloadCell,
} from '@features/analytics/types';
import { MS_DAY, startOfDay } from '@features/analytics/utils/time-range';
import { createProjectService } from '@features/project/services/project-service';
import type { Project } from '@features/project/types';
import { createTaskService } from '@features/task/services/task-service';
import type { Task } from '@features/task/types';

const delay = async (ms = 180): Promise<void> => {
  await new Promise((resolve) => {
    globalThis.setTimeout(resolve, ms);
  });
};

const isCompleted = (task: Task): boolean =>
  task.status === 'completed' || task.completedDate != null;

const isOpen = (task: Task): boolean =>
  !isCompleted(task) &&
  task.status !== 'cancelled' &&
  task.status !== 'archived' &&
  task.archivedAt == null;

const isOverdue = (task: Task, now: number): boolean =>
  isOpen(task) && task.dueDate != null && task.dueDate < now;

const isBlocked = (task: Task): boolean => task.status === 'blocked';

const inRange = (ms: number | null, start: number, end: number): boolean =>
  ms != null && ms >= start && ms <= end;

const applyTaskFilters = (tasks: readonly Task[], filters: AnalyticsFilters): Task[] => {
  let items = [...tasks];
  if (!filters.includeArchived) {
    items = items.filter((task) => task.archivedAt == null && task.status !== 'archived');
  }
  if (filters.projectIds.length > 0) {
    items = items.filter((task) => filters.projectIds.includes(task.projectId));
  }
  if (filters.memberIds.length > 0) {
    items = items.filter(
      (task) => task.assignee != null && filters.memberIds.includes(task.assignee.id),
    );
  }
  if (filters.statuses.length > 0) {
    items = items.filter((task) => filters.statuses.includes(task.status));
  }
  if (filters.priorities.length > 0) {
    items = items.filter((task) => filters.priorities.includes(task.priority));
  }
  if (filters.labels.length > 0) {
    items = items.filter((task) =>
      task.labels.some((label) => filters.labels.includes(label.name)),
    );
  }
  if (filters.tags.length > 0) {
    items = items.filter((task) => task.tags.some((tag) => filters.tags.includes(tag)));
  }
  // Cancelled/archived excluded from productivity calculations per business rules
  return items.filter((task) => task.status !== 'cancelled');
};

const weeksInRange = (range: AnalyticsTimeRange): number => {
  const days = Math.max(1, Math.ceil((range.end - range.start) / MS_DAY));
  return Math.max(1, days / 7);
};

const buildTrendChart = (
  tasks: readonly Task[],
  range: AnalyticsTimeRange,
  id: string,
  title: string,
): ChartModel => {
  const days = Math.min(30, Math.ceil((range.end - range.start) / MS_DAY) + 1);
  const points: { key: string; label: string; value: number; secondary: number }[] = [];
  for (let index = 0; index < days; index += 1) {
    const dayStart = startOfDay(range.start + index * MS_DAY);
    if (dayStart > range.end) {
      break;
    }
    const dayEnd = dayStart + MS_DAY - 1;
    const created = tasks.filter((task) => inRange(task.createdAt, dayStart, dayEnd)).length;
    const completed = tasks.filter((task) => inRange(task.completedDate, dayStart, dayEnd)).length;
    points.push({
      key: String(dayStart),
      label: new Date(dayStart).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      value: completed,
      secondary: created,
    });
  }
  return {
    id,
    type: 'area',
    title,
    description: 'Completed vs created tasks over the selected range.',
    series: [
      { id: 'completed', name: 'Completed', points },
      {
        id: 'created',
        name: 'Created',
        points: points.map((point) => ({
          key: point.key,
          label: point.label,
          value: point.secondary,
        })),
      },
    ],
    tableRows: points.map((point) => ({
      label: point.label,
      values: [point.value, point.secondary],
    })),
  };
};

const distributionChart = (
  id: string,
  title: string,
  description: string,
  entries: readonly { key: string; label: string; value: number }[],
): ChartModel => ({
  id,
  type: 'donut',
  title,
  description,
  series: [
    {
      id: 'distribution',
      name: title,
      points: entries.map((entry) => ({
        key: entry.key,
        label: entry.label,
        value: entry.value,
      })),
    },
  ],
  tableRows: entries.map((entry) => ({ label: entry.label, values: [entry.value] })),
});

export interface AnalyticsRepository {
  getDashboard(
    workspaceId: string,
    range: AnalyticsTimeRange,
    filters: AnalyticsFilters,
  ): Promise<AnalyticsDashboardSnapshot>;
}

export class DomainAnalyticsRepository implements AnalyticsRepository {
  private readonly taskService = createTaskService();
  private readonly projectService = createProjectService();

  async getDashboard(
    workspaceId: string,
    range: AnalyticsTimeRange,
    filters: AnalyticsFilters,
  ): Promise<AnalyticsDashboardSnapshot> {
    await delay();
    const now = Date.now();
    const [allTasks, allProjects] = await Promise.all([
      this.taskService.listTasks(workspaceId),
      this.projectService.listProjects(workspaceId),
    ]);

    const projects = allProjects.filter((project) => !project.archivedAt);
    const tasks = applyTaskFilters(allTasks, {
      ...filters,
      workspaceId,
    });

    const currentTasks = tasks.filter(
      (task) =>
        inRange(task.updatedAt, range.start, range.end) ||
        inRange(task.createdAt, range.start, range.end) ||
        inRange(task.completedDate, range.start, range.end) ||
        isOpen(task),
    );
    const previousTasks = tasks.filter(
      (task) =>
        inRange(task.updatedAt, range.previousStart, range.previousEnd) ||
        inRange(task.createdAt, range.previousStart, range.previousEnd) ||
        inRange(task.completedDate, range.previousStart, range.previousEnd),
    );

    const open = currentTasks.filter(isOpen);
    const completed = currentTasks.filter(
      (task) => isCompleted(task) && inRange(task.completedDate, range.start, range.end),
    );
    const planned = currentTasks.filter(
      (task) =>
        inRange(task.createdAt, range.start, range.end) ||
        isOpen(task) ||
        (isCompleted(task) && inRange(task.completedDate, range.start, range.end)),
    );
    const overdue = open.filter((task) => isOverdue(task, now));
    const blocked = open.filter(isBlocked);

    const prevCompleted = previousTasks.filter(
      (task) =>
        isCompleted(task) && inRange(task.completedDate, range.previousStart, range.previousEnd),
    ).length;
    const prevOpen = previousTasks.filter(isOpen);
    const prevOverdue = prevOpen.filter((task) => isOverdue(task, range.previousEnd)).length;

    const overdueRatio = open.length > 0 ? overdue.length / open.length : 0;
    const prevOverdueRatio = prevOpen.length > 0 ? prevOverdue / prevOpen.length : 0;

    const onTrackProjects = projects.filter((project) => project.health === 'healthy').length;
    const health = workspaceHealthPercent(onTrackProjects, projects.length);
    const prevHealth = health; // projects don't have historical snapshots locally

    const prod = productivityScore(
      completed.length,
      planned.length || completed.length,
      overdueRatio,
    );
    const prevProd = productivityScore(
      prevCompleted,
      previousTasks.length || prevCompleted,
      prevOverdueRatio,
    );

    const velocity = taskVelocity(completed.length, weeksInRange(range));
    const prevVelocity = taskVelocity(
      prevCompleted,
      weeksInRange({
        ...range,
        start: range.previousStart,
        end: range.previousEnd,
      }),
    );

    const overdueRate = overdueRatePercent(overdue.length, open.length);
    const prevOverdueRate = overdueRatePercent(prevOverdue, prevOpen.length);
    const blockedRate = blockedRatioPercent(blocked.length, open.length);

    const trackedMinutes = currentTasks.reduce((sum, task) => sum + (task.actualMinutes ?? 0), 0);
    // Work-day approximation: 8h * weekdays in range
    const workDays = Math.max(
      1,
      Array.from({ length: Math.ceil((range.end - range.start) / MS_DAY) + 1 }).filter(
        (_, index) => {
          const day = new Date(range.start + index * MS_DAY).getDay();
          return day !== 0 && day !== 6;
        },
      ).length,
    );
    const focus = focusScore(trackedMinutes, workDays * 8 * 60, 0);

    const kpis = [
      buildMetricResult({
        id: 'workspace_health',
        name: 'Workspace Health',
        description: '(On-Track Projects / Total Projects) × 100',
        value: health,
        previous: prevHealth,
        format: 'percent',
        timeRange: range,
        unavailableReason: health == null ? 'No projects available.' : undefined,
      }),
      buildMetricResult({
        id: 'active_projects',
        name: 'Active Projects',
        description: 'Non-archived projects in the workspace.',
        value: projects.filter((project) => project.status === 'active').length,
        previous: projects.filter((project) => project.status === 'active').length,
        format: 'number',
        timeRange: range,
      }),
      buildMetricResult({
        id: 'completion_rate',
        name: 'Completion Rate',
        description: 'Completed tasks in range ÷ planned tasks.',
        value: planned.length > 0 ? (completed.length / planned.length) * 100 : null,
        previous: previousTasks.length > 0 ? (prevCompleted / previousTasks.length) * 100 : null,
        format: 'percent',
        timeRange: range,
      }),
      buildMetricResult({
        id: 'overdue_rate',
        name: 'Overdue Rate',
        description: '(Overdue Tasks / Total Open Tasks) × 100',
        value: overdueRate,
        previous: prevOverdueRate,
        format: 'percent',
        timeRange: range,
      }),
      buildMetricResult({
        id: 'productivity_score',
        name: 'Productivity Score',
        description: '(Completed / Planned) × (1 − Overdue Ratio)',
        value: prod,
        previous: prevProd,
        format: 'score',
        timeRange: range,
      }),
      buildMetricResult({
        id: 'task_velocity',
        name: 'Task Velocity',
        description: 'Tasks completed per week in the selected range.',
        value: velocity,
        previous: prevVelocity,
        format: 'number',
        timeRange: range,
      }),
      buildMetricResult({
        id: 'blocked_ratio',
        name: 'Blocked Ratio',
        description: '(Blocked Tasks / Total Open Tasks) × 100',
        value: blockedRate,
        previous: null,
        format: 'percent',
        timeRange: range,
      }),
      buildMetricResult({
        id: 'focus_score',
        name: 'Focus Score',
        description: 'Tracked task time ÷ available work-day capacity (0–10).',
        value: focus,
        previous: null,
        format: 'score',
        timeRange: range,
        unavailableReason: focus == null ? 'Insufficient time-tracking data.' : undefined,
      }),
      buildMetricResult({
        id: 'avg_resolution',
        name: 'Avg Resolution Time',
        description: 'Mean time from creation to completion.',
        value: averageResolutionMinutes(
          completed.map((task) => ({
            createdAt: task.createdAt,
            completedDate: task.completedDate,
          })),
        ),
        previous: null,
        format: 'duration',
        timeRange: range,
      }),
      buildMetricResult({
        id: 'estimate_accuracy',
        name: 'Estimate Accuracy',
        description: 'Estimated vs actual time accuracy ratio.',
        value: estimatedVsActualAccuracy(currentTasks),
        previous: null,
        format: 'percent',
        timeRange: range,
      }),
    ];

    const statusCounts = new Map<string, number>();
    for (const task of currentTasks) {
      statusCounts.set(task.status, (statusCounts.get(task.status) ?? 0) + 1);
    }
    const priorityCounts = new Map<string, number>();
    for (const task of currentTasks) {
      priorityCounts.set(task.priority, (priorityCounts.get(task.priority) ?? 0) + 1);
    }

    const healthBuckets = {
      healthy: projects.filter((project) => project.health === 'healthy').length,
      at_risk: projects.filter((project) => project.health === 'at_risk').length,
      critical: projects.filter((project) => project.health === 'critical').length,
    };

    const projectRows = this.buildProjectRows(projects, tasks, now, weeksInRange(range));
    const memberRows = this.buildMemberRows(tasks, now, weeksInRange(range));
    const workloadHeatmap = this.buildWorkloadHeatmap(tasks, range);

    return {
      generatedAt: Date.now(),
      timeRange: range,
      kpis,
      productivityTrend: buildTrendChart(
        currentTasks,
        range,
        'productivity_trend',
        'Productivity Trend',
      ),
      projectHealthDistribution: distributionChart(
        'project_health',
        'Project Health Distribution',
        'Count of projects by health state.',
        [
          { key: 'healthy', label: 'Healthy', value: healthBuckets.healthy },
          { key: 'at_risk', label: 'At Risk', value: healthBuckets.at_risk },
          { key: 'critical', label: 'Critical', value: healthBuckets.critical },
        ],
      ),
      statusDistribution: distributionChart(
        'status_distribution',
        'Status Breakdown',
        'Tasks by status in the current scope.',
        [...statusCounts.entries()].map(([key, value]) => ({
          key,
          label: key.replaceAll('_', ' '),
          value,
        })),
      ),
      priorityDistribution: distributionChart(
        'priority_distribution',
        'Priority Distribution',
        'Tasks by priority.',
        [...priorityCounts.entries()].map(([key, value]) => ({
          key,
          label: key,
          value,
        })),
      ),
      workloadHeatmap,
      projectRows,
      memberRows,
      aiInsightPlaceholder:
        'AI insights are prepared for a later phase. Risk and velocity summaries will appear here.',
    };
  }

  private buildProjectRows(
    projects: readonly Project[],
    tasks: readonly Task[],
    now: number,
    weeks: number,
  ): ProjectAnalyticsRow[] {
    return projects.map((project) => {
      const projectTasks = tasks.filter((task) => task.projectId === project.id);
      const open = projectTasks.filter(isOpen);
      const overdue = open.filter((task) => isOverdue(task, now));
      const blocked = open.filter(isBlocked);
      const completed = projectTasks.filter(isCompleted);
      const overdueRatio = open.length > 0 ? overdue.length / open.length : 0;
      const blockedRatio = open.length > 0 ? blocked.length / open.length : 0;
      return {
        projectId: project.id,
        projectName: project.name,
        progress: project.progress,
        healthScore: projectHealthScore({
          progressPercent: project.progress,
          overdueRatio,
          blockedRatio,
        }),
        riskScore: projectRiskScore(overdue.length, blocked.length, projectTasks.length) ?? 0,
        overdueCount: overdue.length,
        blockedCount: blocked.length,
        completedCount: completed.length,
        openCount: open.length,
        velocity: taskVelocity(completed.length, weeks) ?? 0,
      };
    });
  }

  private buildMemberRows(
    tasks: readonly Task[],
    now: number,
    weeks: number,
  ): MemberAnalyticsRow[] {
    type MemberDraft = {
      memberId: string;
      memberName: string;
      assigned: number;
      completed: number;
      overdue: number;
      capacityPercent: number;
      estimatedMinutes: number;
    };
    const map = new Map<string, MemberDraft>();
    for (const task of tasks) {
      const memberId = task.assignee?.id ?? 'unassigned';
      const memberName = task.assignee?.fullName ?? 'Unassigned';
      const existing =
        map.get(memberId) ??
        ({
          memberId,
          memberName,
          assigned: 0,
          completed: 0,
          overdue: 0,
          capacityPercent: 0,
          estimatedMinutes: 0,
        } satisfies MemberDraft);
      if (isOpen(task)) {
        existing.assigned += 1;
        existing.estimatedMinutes += task.estimatedMinutes ?? 0;
        if (isOverdue(task, now)) {
          existing.overdue += 1;
        }
      }
      if (isCompleted(task)) {
        existing.completed += 1;
      }
      map.set(memberId, existing);
    }

    return [...map.values()].map((row) => {
      const avgVelocity = row.completed / Math.max(weeks, 1) || 0;
      return {
        memberId: row.memberId,
        memberName: row.memberName,
        assigned: row.assigned,
        completed: row.completed,
        overdue: row.overdue,
        estimatedMinutes: row.estimatedMinutes,
        capacityPercent: memberCapacityPercent(row.assigned, Math.max(avgVelocity, 1)) ?? 0,
      };
    });
  }

  private buildWorkloadHeatmap(tasks: readonly Task[], range: AnalyticsTimeRange): WorkloadCell[] {
    const cells: WorkloadCell[] = [];
    const members = new Map<string, string>();
    for (const task of tasks) {
      if (task.assignee) {
        members.set(task.assignee.id, task.assignee.fullName);
      }
    }
    const dayCount = Math.min(14, Math.ceil((range.end - range.start) / MS_DAY) + 1);
    for (const [memberId, memberName] of members) {
      for (let index = 0; index < dayCount; index += 1) {
        const dayStart = startOfDay(range.start + index * MS_DAY);
        const dayEnd = dayStart + MS_DAY - 1;
        const load = tasks.filter(
          (task) =>
            task.assignee?.id === memberId &&
            isOpen(task) &&
            (task.dueDate == null ||
              inRange(task.dueDate, dayStart, dayEnd) ||
              task.dueDate >= dayStart),
        ).length;
        cells.push({
          memberId,
          memberName,
          dayKey: new Date(dayStart).toLocaleDateString(undefined, {
            weekday: 'short',
            day: 'numeric',
          }),
          load,
        });
      }
    }
    return cells;
  }
}

export const createAnalyticsRepository = (): AnalyticsRepository => new DomainAnalyticsRepository();

export const emptyFilters = (workspaceId: string | null = null): AnalyticsFilters => ({
  workspaceId,
  projectIds: [],
  memberIds: [],
  statuses: [],
  priorities: [],
  labels: [],
  tags: [],
  includeArchived: false,
  includeCompleted: true,
});
