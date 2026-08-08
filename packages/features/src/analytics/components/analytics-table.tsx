import { ArrowDown, ArrowUp } from 'lucide-react';
import { useMemo, useState, type KeyboardEvent, type ReactElement } from 'react';

import type { MemberAnalyticsRow, ProjectAnalyticsRow } from '@features/analytics/types';
import { cn } from '@shared/ui/lib/cn';
import { Text } from '@shared/ui/typography/text';

type SortDir = 'asc' | 'desc';

type ProjectColumn = keyof Pick<
  ProjectAnalyticsRow,
  | 'projectName'
  | 'progress'
  | 'healthScore'
  | 'riskScore'
  | 'overdueCount'
  | 'blockedCount'
  | 'completedCount'
  | 'openCount'
  | 'velocity'
>;

type MemberColumn = keyof Pick<
  MemberAnalyticsRow,
  'memberName' | 'assigned' | 'completed' | 'overdue' | 'capacityPercent' | 'estimatedMinutes'
>;

type AnalyticsTableProps =
  | {
      readonly variant: 'project';
      readonly rows: readonly ProjectAnalyticsRow[];
      readonly onRowClick?: (row: ProjectAnalyticsRow) => void;
      readonly className?: string;
    }
  | {
      readonly variant: 'member';
      readonly rows: readonly MemberAnalyticsRow[];
      readonly onRowClick?: (row: MemberAnalyticsRow) => void;
      readonly className?: string;
    };

const PROJECT_COLUMNS: ReadonlyArray<{ key: ProjectColumn; label: string }> = [
  { key: 'projectName', label: 'Project' },
  { key: 'progress', label: 'Progress' },
  { key: 'healthScore', label: 'Health' },
  { key: 'riskScore', label: 'Risk' },
  { key: 'overdueCount', label: 'Overdue' },
  { key: 'blockedCount', label: 'Blocked' },
  { key: 'completedCount', label: 'Done' },
  { key: 'openCount', label: 'Open' },
  { key: 'velocity', label: 'Velocity' },
];

const MEMBER_COLUMNS: ReadonlyArray<{ key: MemberColumn; label: string }> = [
  { key: 'memberName', label: 'Member' },
  { key: 'assigned', label: 'Assigned' },
  { key: 'completed', label: 'Completed' },
  { key: 'overdue', label: 'Overdue' },
  { key: 'capacityPercent', label: 'Capacity %' },
  { key: 'estimatedMinutes', label: 'Est. min' },
];

const compareValues = (a: string | number, b: string | number, dir: SortDir): number => {
  const result =
    typeof a === 'string' && typeof b === 'string' ? a.localeCompare(b) : Number(a) - Number(b);
  return dir === 'asc' ? result : -result;
};

export const AnalyticsTable = (props: AnalyticsTableProps): ReactElement => {
  const { variant, className } = props;
  const [sortKey, setSortKey] = useState<string>(
    variant === 'project' ? 'projectName' : 'memberName',
  );
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const toggleSort = (key: string): void => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortKey(key);
    setSortDir('asc');
  };

  const onHeaderKeyDown = (event: KeyboardEvent<HTMLButtonElement>, key: string): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleSort(key);
    }
  };

  const sortedProjects = useMemo(() => {
    if (props.variant !== 'project') {
      return [];
    }
    const key = sortKey as ProjectColumn;
    return [...props.rows].sort((a, b) => compareValues(a[key], b[key], sortDir));
  }, [props, sortDir, sortKey]);

  const sortedMembers = useMemo(() => {
    if (props.variant !== 'member') {
      return [];
    }
    const key = sortKey as MemberColumn;
    return [...props.rows].sort((a, b) => compareValues(a[key], b[key], sortDir));
  }, [props, sortDir, sortKey]);

  const columns = variant === 'project' ? PROJECT_COLUMNS : MEMBER_COLUMNS;

  return (
    <div
      className={cn('w-full overflow-x-auto rounded-lg border border-border-default', className)}
    >
      <table
        className="w-full min-w-[640px] border-collapse text-left"
        aria-label={variant === 'project' ? 'Project analytics' : 'Member analytics'}
      >
        <thead className="bg-surface-elevated">
          <tr className="border-b border-border-subtle">
            {columns.map((column) => {
              const active = sortKey === column.key;
              return (
                <th key={column.key} scope="col" className="px-3 py-2.5">
                  <button
                    type="button"
                    className={cn(
                      'inline-flex items-center gap-1 rounded-sm outline-none',
                      'focus-visible:ds-focus-ring',
                    )}
                    aria-sort={active ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
                    onClick={() => toggleSort(column.key)}
                    onKeyDown={(event) => onHeaderKeyDown(event, column.key)}
                  >
                    <Text
                      as="span"
                      variant="caption"
                      muted
                      className="font-medium uppercase tracking-wide"
                    >
                      {column.label}
                    </Text>
                    {active ? (
                      sortDir === 'asc' ? (
                        <ArrowUp className="size-3 text-text-muted" aria-hidden="true" />
                      ) : (
                        <ArrowDown className="size-3 text-text-muted" aria-hidden="true" />
                      )
                    ) : null}
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {variant === 'project'
            ? sortedProjects.map((row) => (
                <tr
                  key={row.projectId}
                  className={cn(
                    'border-b border-border-subtle last:border-0',
                    props.onRowClick && 'cursor-pointer hover:bg-state-hover',
                  )}
                  onClick={() => props.onRowClick?.(row)}
                >
                  <td className="px-3 py-2.5">
                    <Text as="span" variant="body-sm">
                      {row.projectName}
                    </Text>
                  </td>
                  <td className="px-3 py-2.5 tabular-nums text-text-secondary">{row.progress}</td>
                  <td className="px-3 py-2.5 tabular-nums text-text-secondary">
                    {row.healthScore}
                  </td>
                  <td className="px-3 py-2.5 tabular-nums text-text-secondary">{row.riskScore}</td>
                  <td className="px-3 py-2.5 tabular-nums text-text-secondary">
                    {row.overdueCount}
                  </td>
                  <td className="px-3 py-2.5 tabular-nums text-text-secondary">
                    {row.blockedCount}
                  </td>
                  <td className="px-3 py-2.5 tabular-nums text-text-secondary">
                    {row.completedCount}
                  </td>
                  <td className="px-3 py-2.5 tabular-nums text-text-secondary">{row.openCount}</td>
                  <td className="px-3 py-2.5 tabular-nums text-text-secondary">{row.velocity}</td>
                </tr>
              ))
            : sortedMembers.map((row) => (
                <tr
                  key={row.memberId}
                  className={cn(
                    'border-b border-border-subtle last:border-0',
                    props.onRowClick && 'cursor-pointer hover:bg-state-hover',
                  )}
                  onClick={() => props.onRowClick?.(row)}
                >
                  <td className="px-3 py-2.5">
                    <Text as="span" variant="body-sm">
                      {row.memberName}
                    </Text>
                  </td>
                  <td className="px-3 py-2.5 tabular-nums text-text-secondary">{row.assigned}</td>
                  <td className="px-3 py-2.5 tabular-nums text-text-secondary">{row.completed}</td>
                  <td className="px-3 py-2.5 tabular-nums text-text-secondary">{row.overdue}</td>
                  <td className="px-3 py-2.5 tabular-nums text-text-secondary">
                    {row.capacityPercent}
                  </td>
                  <td className="px-3 py-2.5 tabular-nums text-text-secondary">
                    {row.estimatedMinutes}
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
};

export type { AnalyticsTableProps };
