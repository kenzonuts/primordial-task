import { describe, expect, it } from 'vitest';

import {
  blockedRatioPercent,
  computeComparison,
  focusScore,
  memberCapacityPercent,
  overdueRatePercent,
  productivityScore,
  projectHealthScore,
  projectRiskScore,
  taskVelocity,
  workspaceHealthPercent,
} from '@features/analytics/metrics/metric-engine';

describe('analytics metric engine', () => {
  it('computes workspace health from on-track ratio', () => {
    expect(workspaceHealthPercent(3, 4)).toBe(75);
    expect(workspaceHealthPercent(0, 0)).toBeNull();
  });

  it('computes project health with documented weights', () => {
    // progress 100, no overdue, no blocked => 100
    expect(projectHealthScore({ progressPercent: 100, overdueRatio: 0, blockedRatio: 0 })).toBe(
      100,
    );
    // progress 0, all overdue & blocked => 0
    expect(projectHealthScore({ progressPercent: 0, overdueRatio: 1, blockedRatio: 1 })).toBe(0);
  });

  it('computes productivity score', () => {
    expect(productivityScore(8, 10, 0.2)).toBe(0.64);
    expect(productivityScore(1, 0, 0)).toBeNull();
  });

  it('computes focus score and handles zero denominator', () => {
    expect(focusScore(240, 480, 0)).toBe(5);
    expect(focusScore(100, 100, 100)).toBeNull();
  });

  it('computes velocity, overdue rate, blocked ratio, capacity, risk', () => {
    expect(taskVelocity(14, 2)).toBe(7);
    expect(taskVelocity(5, 0)).toBeNull();
    expect(overdueRatePercent(2, 10)).toBe(20);
    expect(overdueRatePercent(1, 0)).toBeNull();
    expect(blockedRatioPercent(1, 4)).toBe(25);
    expect(memberCapacityPercent(10, 5)).toBe(200);
    expect(memberCapacityPercent(5, 0)).toBeNull();
    expect(projectRiskScore(2, 2, 10)).toBe(0.2);
    expect(projectRiskScore(1, 1, 0)).toBeNull();
  });

  it('handles comparison edge cases without misleading percentages', () => {
    expect(computeComparison(10, 5).percentChange).toBe(100);
    expect(computeComparison(5, 0).percentChange).toBeNull();
    expect(computeComparison(0, 0).percentChange).toBe(0);
    expect(computeComparison(5, null).direction).toBe('na');
  });
});
