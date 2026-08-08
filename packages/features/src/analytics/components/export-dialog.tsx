import { useState, type ReactElement } from 'react';

import type { ExportFormat } from '@features/analytics/types';
import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@shared/ui/overlays/dialog';
import { Button } from '@shared/ui/primitives/button';
import { RadioGroup, RadioGroupItem } from '@shared/ui/primitives/radio';
import { Text } from '@shared/ui/typography/text';

const EXPORT_OPTIONS: ReadonlyArray<{
  readonly format: ExportFormat;
  readonly label: string;
  readonly description: string;
}> = [
  { format: 'csv', label: 'CSV', description: 'Raw tabular data for spreadsheets' },
  { format: 'json', label: 'JSON', description: 'Full structured data dump' },
  { format: 'pdf', label: 'PDF', description: 'Print-ready monochrome report' },
  { format: 'xlsx', label: 'XLSX', description: 'Excel workbook export' },
];

type ExportDialogProps = {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onExport: (format: ExportFormat) => void;
  readonly loading?: boolean;
  readonly className?: string;
};

export const ExportDialog = ({
  open,
  onOpenChange,
  onExport,
  loading = false,
  className,
}: ExportDialogProps): ReactElement => {
  const [format, setFormat] = useState<ExportFormat>('csv');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="sm" className={cn(className)} aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Export analytics</DialogTitle>
          <DialogDescription>Choose a format. Exports are logged for audit.</DialogDescription>
        </DialogHeader>

        <RadioGroup
          value={format}
          onValueChange={(value) => setFormat(value as ExportFormat)}
          className="gap-2"
          aria-label="Export format"
        >
          {EXPORT_OPTIONS.map((option) => (
            <label
              key={option.format}
              className={cn(
                'flex cursor-pointer items-start gap-3 rounded-md border border-border-default p-3',
                'hover:bg-state-hover',
                format === option.format && 'border-border-strong bg-state-selected',
              )}
            >
              <RadioGroupItem value={option.format} className="mt-0.5" aria-label={option.label} />
              <Stack gap={2} className="min-w-0">
                <Text as="span" variant="body-sm" className="font-medium">
                  {option.label}
                </Text>
                <Text as="span" variant="caption" muted>
                  {option.description}
                </Text>
              </Stack>
            </label>
          ))}
        </RadioGroup>

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" loading={loading} onClick={() => onExport(format)}>
            Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export type { ExportDialogProps };
