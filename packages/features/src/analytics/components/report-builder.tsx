import type { FormEvent, ReactElement } from 'react';

import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import { Button } from '@shared/ui/primitives/button';
import { Checkbox } from '@shared/ui/primitives/checkbox';
import { Input } from '@shared/ui/primitives/input';
import { Text } from '@shared/ui/typography/text';

type ChartOption = {
  readonly id: string;
  readonly label: string;
};

type ReportBuilderConfig = {
  readonly name: string;
  readonly chartIds: readonly string[];
};

type ReportBuilderProps = {
  readonly value: ReportBuilderConfig;
  readonly chartOptions: readonly ChartOption[];
  readonly onChange: (next: ReportBuilderConfig) => void;
  readonly onSubmit?: (config: ReportBuilderConfig) => void;
  readonly submitting?: boolean;
  readonly className?: string;
};

export const ReportBuilder = ({
  value,
  chartOptions,
  onChange,
  onSubmit,
  submitting = false,
  className,
}: ReportBuilderProps): ReactElement => {
  const toggleChart = (id: string): void => {
    const next = value.chartIds.includes(id)
      ? value.chartIds.filter((chartId) => chartId !== id)
      : [...value.chartIds, id];
    onChange({ ...value, chartIds: next });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onSubmit?.(value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('rounded-lg border border-border-default bg-surface-card p-4', className)}
    >
      <Stack gap={16}>
        <Stack gap={4}>
          <Text as="label" variant="label" htmlFor="report-name">
            Report name
          </Text>
          <Input
            id="report-name"
            value={value.name}
            onChange={(event) => onChange({ ...value, name: event.target.value })}
            placeholder="Weekly status"
            aria-required
          />
        </Stack>

        <Stack gap={8} role="group" aria-label="Charts to include">
          <Text as="p" variant="label" muted>
            Charts
          </Text>
          {chartOptions.map((option) => {
            const checked = value.chartIds.includes(option.id);
            return (
              <label key={option.id} className="inline-flex items-center gap-2">
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => toggleChart(option.id)}
                  aria-label={option.label}
                  className="size-7"
                />
                <Text as="span" variant="body-sm">
                  {option.label}
                </Text>
              </label>
            );
          })}
        </Stack>

        {onSubmit ? (
          <Button type="submit" loading={submitting} disabled={!value.name.trim()}>
            Save report
          </Button>
        ) : null}
      </Stack>
    </form>
  );
};

export type { ReportBuilderProps, ReportBuilderConfig, ChartOption };
