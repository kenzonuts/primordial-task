import type { AnalyticsDashboardSnapshot, ExportFormat } from '@features/analytics/types';

export const exportDashboard = (
  snapshot: AnalyticsDashboardSnapshot,
  format: ExportFormat,
): string => {
  if (format === 'json') {
    return JSON.stringify(snapshot, null, 2);
  }

  if (format === 'csv' || format === 'xlsx') {
    const lines = ['metric,value,previous,percent_change'];
    for (const kpi of snapshot.kpis) {
      lines.push(
        [
          csvEscape(kpi.name),
          kpi.value ?? '',
          kpi.comparison.previous ?? '',
          kpi.comparison.percentChange ?? '',
        ].join(','),
      );
    }
    lines.push('');
    lines.push('project,progress,health,risk,overdue,blocked,velocity');
    for (const row of snapshot.projectRows) {
      lines.push(
        [
          csvEscape(row.projectName),
          row.progress,
          row.healthScore,
          row.riskScore,
          row.overdueCount,
          row.blockedCount,
          row.velocity,
        ].join(','),
      );
    }
    return lines.join('\n');
  }

  // PDF/PNG foundation: return printable text summary
  const lines = [
    'Primordial Task Analytics Report',
    `Generated: ${new Date(snapshot.generatedAt).toISOString()}`,
    `Range: ${new Date(snapshot.timeRange.start).toISOString()} – ${new Date(snapshot.timeRange.end).toISOString()}`,
    '',
    'KPIs',
  ];
  for (const kpi of snapshot.kpis) {
    lines.push(`- ${kpi.name}: ${kpi.formatted}`);
  }
  return lines.join('\n');
};

const csvEscape = (value: string): string => {
  if (value.includes(',') || value.includes('"')) {
    return `"${value.replaceAll('"', '""')}"`;
  }
  return value;
};

export const downloadTextFile = (filename: string, content: string, mime: string): void => {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};
