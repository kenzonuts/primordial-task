import type { ReactElement } from 'react';

import { AnalyticsFilters } from '@features/analytics/components/analytics-filters';
import type { FilterOption } from '@features/analytics/components/analytics-filters';
import { TimeRangeSelector } from '@features/analytics/components/time-range-selector';
import {
  ANALYTICS_SECTIONS,
  type AnalyticsFilters as AnalyticsFiltersState,
  type AnalyticsSection,
  type TimeRangePreset,
} from '@features/analytics/types';
import { Inline } from '@shared/ui/layout/inline';
import { cn } from '@shared/ui/lib/cn';
import { Tabs, TabsList, TabsTrigger } from '@shared/ui/navigation/tabs';
import { Button } from '@shared/ui/primitives/button';
import { Switch } from '@shared/ui/primitives/switch';
import { Text } from '@shared/ui/typography/text';

const SECTION_LABELS: Record<AnalyticsSection, string> = {
  overview: 'Overview',
  workspace: 'Workspace',
  projects: 'Projects',
  tasks: 'Tasks',
  team: 'Team',
  time: 'Time',
  reports: 'Reports',
};

type AnalyticsToolbarProps = {
  readonly section: AnalyticsSection;
  readonly onSectionChange: (section: AnalyticsSection) => void;
  readonly timeRangePreset: TimeRangePreset;
  readonly onTimeRangeChange: (preset: TimeRangePreset) => void;
  readonly filters: AnalyticsFiltersState;
  readonly onFiltersChange: (partial: Partial<AnalyticsFiltersState>) => void;
  readonly onResetFilters?: () => void;
  readonly projectOptions?: readonly FilterOption[];
  readonly memberOptions?: readonly FilterOption[];
  readonly statusOptions?: readonly FilterOption[];
  readonly priorityOptions?: readonly FilterOption[];
  readonly aiEnabled?: boolean;
  readonly onAiToggle?: (enabled: boolean) => void;
  readonly onExport?: () => void;
  readonly className?: string;
};

export const AnalyticsToolbar = ({
  section,
  onSectionChange,
  timeRangePreset,
  onTimeRangeChange,
  filters,
  onFiltersChange,
  onResetFilters,
  projectOptions,
  memberOptions,
  statusOptions,
  priorityOptions,
  aiEnabled = false,
  onAiToggle,
  onExport,
  className,
}: AnalyticsToolbarProps): ReactElement => {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 border-b border-border-default bg-surface-base px-4 py-3',
        className,
      )}
    >
      <Inline gap={12} align="center" justify="between" wrap className="gap-y-2">
        <Tabs value={section} onValueChange={(value) => onSectionChange(value as AnalyticsSection)}>
          <TabsList variant="underline" aria-label="Analytics sections">
            {ANALYTICS_SECTIONS.map((key) => (
              <TabsTrigger key={key} value={key}>
                {SECTION_LABELS[key]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <Inline gap={8} align="center" className="shrink-0">
          <TimeRangeSelector value={timeRangePreset} onChange={onTimeRangeChange} compact />
          {onExport ? (
            <Button type="button" size="sm" variant="secondary" onClick={onExport}>
              Export
            </Button>
          ) : null}
          {onAiToggle ? (
            <label className="inline-flex items-center gap-2">
              <Switch
                size="sm"
                checked={aiEnabled}
                onCheckedChange={(checked) => onAiToggle(checked)}
                aria-label="Toggle AI insights"
              />
              <Text as="span" variant="caption" muted>
                AI
              </Text>
            </label>
          ) : null}
        </Inline>
      </Inline>

      <AnalyticsFilters
        filters={filters}
        onChange={onFiltersChange}
        onReset={onResetFilters}
        projectOptions={projectOptions}
        memberOptions={memberOptions}
        statusOptions={statusOptions}
        priorityOptions={priorityOptions}
      />
    </div>
  );
};

export type { AnalyticsToolbarProps };
