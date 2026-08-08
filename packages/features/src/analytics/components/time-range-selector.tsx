import type { ReactElement } from 'react';

import { TIME_RANGE_PRESETS, type TimeRangePreset } from '@features/analytics/types';
import { TIME_RANGE_LABELS } from '@features/analytics/utils/time-range';
import { Inline } from '@shared/ui/layout/inline';
import { cn } from '@shared/ui/lib/cn';
import { Button } from '@shared/ui/primitives/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/ui/primitives/select';

type TimeRangeSelectorProps = {
  readonly value: TimeRangePreset;
  readonly onChange: (preset: TimeRangePreset) => void;
  readonly compact?: boolean;
  readonly disabled?: boolean;
  readonly className?: string;
};

/** Documented presets shown in the selector UI. */
const VISIBLE_PRESETS: readonly TimeRangePreset[] = [
  'today',
  'yesterday',
  'this_week',
  'last_week',
  'last_7_days',
  'last_30_days',
  'this_month',
  'last_month',
  'this_quarter',
  'this_year',
  'custom',
];

export const TimeRangeSelector = ({
  value,
  onChange,
  compact = false,
  disabled = false,
  className,
}: TimeRangeSelectorProps): ReactElement => {
  const options = VISIBLE_PRESETS.filter((preset) =>
    (TIME_RANGE_PRESETS as readonly string[]).includes(preset),
  );

  if (compact) {
    return (
      <Select
        value={value}
        onValueChange={(next) => onChange(next as TimeRangePreset)}
        disabled={disabled}
      >
        <SelectTrigger size="sm" aria-label="Time range" className={cn('w-[160px]', className)}>
          <SelectValue placeholder="Time range" />
        </SelectTrigger>
        <SelectContent>
          {options.map((preset) => (
            <SelectItem key={preset} value={preset}>
              {TIME_RANGE_LABELS[preset]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <Inline
      gap={4}
      align="center"
      wrap
      role="group"
      aria-label="Time range"
      className={cn('rounded-md border border-border-subtle bg-surface-elevated p-1', className)}
    >
      {options.map((preset) => {
        const isActive = value === preset;
        return (
          <Button
            key={preset}
            type="button"
            size="sm"
            variant={isActive ? 'secondary' : 'ghost'}
            disabled={disabled}
            aria-pressed={isActive}
            onClick={() => onChange(preset)}
            className={cn('h-7 px-2.5', isActive && 'bg-state-selected text-text-primary')}
          >
            {TIME_RANGE_LABELS[preset]}
          </Button>
        );
      })}
    </Inline>
  );
};

export type { TimeRangeSelectorProps };
