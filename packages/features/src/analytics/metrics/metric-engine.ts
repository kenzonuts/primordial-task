import type { MetricComparison, MetricResult, AnalyticsTimeRange } from '@features/analytics/types';

/**
 * Safe percent change. Returns null when previous is 0/null to avoid misleading %.
 */
export const computeComparison = (
  current: number,
  previous: number | null | undefined,
): MetricComparison => {
  if (previous == null || Number.isNaN(previous) || Number.isNaN(current)) {
    return {
      current,
      previous: previous ?? null,
      absoluteChange: null,
      percentChange: null,
      direction: 'na',
    };
  }
  const absoluteChange = current - previous;
  if (previous === 0) {
    return {
      current,
      previous,
      absoluteChange,
      percentChange: current === 0 ? 0 : null,
      direction: absoluteChange === 0 ? 'flat' : absoluteChange > 0 ? 'up' : 'down',
    };
  }
  const percentChange = (absoluteChange / Math.abs(previous)) * 100;
  const direction = Math.abs(percentChange) < 0.05 ? 'flat' : percentChange > 0 ? 'up' : 'down';
  return {
    current,
    previous,
    absoluteChange,
    percentChange,
    direction,
  };
};

export const formatMetricValue = (
  value: number | null,
  format: 'number' | 'percent' | 'score' | 'duration' | 'ratio',
): string => {
  if (value == null || Number.isNaN(value)) {
    return '—';
  }
  if (format === 'percent') {
    return `${round(value, 1)}%`;
  }
  if (format === 'score') {
    return String(round(value, 1));
  }
  if (format === 'duration') {
    if (value < 60) {
      return `${round(value, 0)}m`;
    }
    if (value < 60 * 24) {
      return `${round(value / 60, 1)}h`;
    }
    return `${round(value / (60 * 24), 1)}d`;
  }
  if (format === 'ratio') {
    return String(round(value, 2));
  }
  return String(round(value, value >= 100 ? 0 : 1));
};

export const round = (value: number, digits: number): number => {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
};

export const buildMetricResult = (input: {
  id: string;
  name: string;
  description: string;
  value: number | null;
  previous: number | null;
  format: 'number' | 'percent' | 'score' | 'duration' | 'ratio';
  timeRange: AnalyticsTimeRange;
  unavailableReason?: string;
}): MetricResult => {
  const comparison = computeComparison(input.value ?? Number.NaN, input.previous);
  return {
    id: input.id,
    name: input.name,
    description: input.description,
    value: input.value,
    formatted: formatMetricValue(input.value, input.format),
    comparison: {
      ...comparison,
      current: input.value ?? 0,
    },
    timeRange: input.timeRange,
    unavailableReason: input.unavailableReason,
  };
};

/** Spec §6: Workspace Health (%) = (On-Track Projects / Total Projects) * 100 */
export const workspaceHealthPercent = (
  onTrackProjects: number,
  totalProjects: number,
): number | null => {
  if (totalProjects <= 0) {
    return null;
  }
  return (onTrackProjects / totalProjects) * 100;
};

/**
 * Spec §6: Project Health (0-100) =
 * Progress(40%) + Deadline Risk inverted(30%) + Blocked Status inverted(30%)
 * Deadline risk = overdueRatio; blocked status = blockedRatio.
 */
export const projectHealthScore = (input: {
  progressPercent: number;
  overdueRatio: number;
  blockedRatio: number;
}): number => {
  const progress = clamp(input.progressPercent, 0, 100);
  const deadlineComponent = (1 - clamp(input.overdueRatio, 0, 1)) * 100;
  const blockedComponent = (1 - clamp(input.blockedRatio, 0, 1)) * 100;
  return round(progress * 0.4 + deadlineComponent * 0.3 + blockedComponent * 0.3, 1);
};

/** Spec §6: Productivity Score = (Completed / Planned) * (1 - Overdue Ratio) */
export const productivityScore = (
  completed: number,
  planned: number,
  overdueRatio: number,
): number | null => {
  if (planned <= 0) {
    return null;
  }
  return round((completed / planned) * (1 - clamp(overdueRatio, 0, 1)), 3);
};

/**
 * Spec §6: Focus Score (0-10) = Tracked Task Time / (Work Day Hours - Non-Task Time)
 * Returns null when denominator is unavailable/zero.
 */
export const focusScore = (
  trackedTaskMinutes: number,
  workDayMinutes: number,
  nonTaskMinutes: number,
): number | null => {
  const denominator = workDayMinutes - nonTaskMinutes;
  if (denominator <= 0) {
    return null;
  }
  return round(clamp((trackedTaskMinutes / denominator) * 10, 0, 10), 1);
};

/** Spec §6: Task Velocity = Tasks Completed / Time Unit */
export const taskVelocity = (completed: number, timeUnits: number): number | null => {
  if (timeUnits <= 0) {
    return null;
  }
  return round(completed / timeUnits, 2);
};

/** Spec §6: Overdue Rate = (Overdue / Open) * 100 */
export const overdueRatePercent = (overdue: number, open: number): number | null => {
  if (open <= 0) {
    return null;
  }
  return round((overdue / open) * 100, 1);
};

/** Spec §6: Blocked Ratio = (Blocked / Open) * 100 */
export const blockedRatioPercent = (blocked: number, open: number): number | null => {
  if (open <= 0) {
    return null;
  }
  return round((blocked / open) * 100, 1);
};

/** Spec §6: Member Capacity (%) = (Current Estimated Work / Average Velocity) * 100 */
export const memberCapacityPercent = (
  currentEstimatedWork: number,
  averageVelocity: number,
): number | null => {
  if (averageVelocity <= 0) {
    return null;
  }
  return round((currentEstimatedWork / averageVelocity) * 100, 1);
};

/**
 * Spec §5.3 Risk Score = (Overdue * 0.5 + Blocked * 0.5) / Total Tasks
 */
export const projectRiskScore = (
  overdue: number,
  blocked: number,
  totalTasks: number,
): number | null => {
  if (totalTasks <= 0) {
    return null;
  }
  return round((overdue * 0.5 + blocked * 0.5) / totalTasks, 3);
};

export const averageResolutionMinutes = (
  completedTasks: readonly { createdAt: number; completedDate: number | null }[],
): number | null => {
  const durations = completedTasks
    .filter((task) => task.completedDate != null)
    .map((task) => (task.completedDate! - task.createdAt) / 60_000)
    .filter((value) => value >= 0);
  if (durations.length === 0) {
    return null;
  }
  const sum = durations.reduce((acc, value) => acc + value, 0);
  return round(sum / durations.length, 1);
};

export const estimatedVsActualAccuracy = (
  tasks: readonly { estimatedMinutes: number | null; actualMinutes: number | null }[],
): number | null => {
  const pairs = tasks.filter(
    (task) =>
      task.estimatedMinutes != null &&
      task.estimatedMinutes > 0 &&
      task.actualMinutes != null &&
      task.actualMinutes > 0,
  );
  if (pairs.length === 0) {
    return null;
  }
  const ratios = pairs.map(
    (task) =>
      Math.min(task.estimatedMinutes!, task.actualMinutes!) /
      Math.max(task.estimatedMinutes!, task.actualMinutes!),
  );
  const avg = ratios.reduce((acc, value) => acc + value, 0) / ratios.length;
  return round(avg * 100, 1);
};

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));
