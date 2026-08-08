import type { FormEvent, ReactElement } from 'react';
import { useEffect, useState } from 'react';

import { parseDateIso, toDateIso } from '@features/calendar/utils/date-utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@shared/ui/overlays/dialog';
import { Button } from '@shared/ui/primitives/button';
import { Input } from '@shared/ui/primitives/input';

type CalendarDialogProps = {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly initialDate?: number;
  /** Preferred: receives YYYY-MM-DD. */
  readonly onSubmit?: (dateIso: string) => void;
  /** Alternate: receives epoch ms. */
  readonly onConfirm?: (dateMs: number) => void;
};

/**
 * Go To Date dialog.
 */
export const CalendarDialog = ({
  open,
  onOpenChange,
  initialDate = Date.now(),
  onSubmit,
  onConfirm,
}: CalendarDialogProps): ReactElement => {
  const [value, setValue] = useState(() => toDateIso(initialDate));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setValue(toDateIso(initialDate));
      setError(null);
    }
  }, [open, initialDate]);

  const handleSubmit = (event: FormEvent): void => {
    event.preventDefault();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      setError('Enter a date as YYYY-MM-DD.');
      return;
    }
    const ms = parseDateIso(value);
    if (Number.isNaN(ms)) {
      setError('Invalid date.');
      return;
    }
    onSubmit?.(value);
    onConfirm?.(ms);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>Go to date</DialogTitle>
          <DialogDescription>Jump the calendar to a specific day.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="date"
            value={value}
            onChange={(changeEvent) => {
              setValue(changeEvent.target.value);
              setError(null);
            }}
            aria-label="Date"
            aria-invalid={error != null}
            error={error != null}
          />
          {error ? (
            <p className="text-xs text-danger" role="alert">
              {error}
            </p>
          ) : null}
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Go</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export type { CalendarDialogProps };
