import type { ReactElement, ReactNode } from 'react';
import { useEffect, useState } from 'react';

import { Alert } from '@shared/ui/feedback/alert';
import { Stack } from '@shared/ui/layout/stack';
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
import { Text } from '@shared/ui/typography/text';

type DeleteConfirmationProps = {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly taskTitle: string;
  readonly onConfirm: () => void | Promise<void>;
  readonly loading?: boolean;
  readonly requireTitleMatch?: boolean;
  readonly title?: string;
  readonly description?: ReactNode;
};

export const DeleteConfirmation = ({
  open,
  onOpenChange,
  taskTitle,
  onConfirm,
  loading = false,
  requireTitleMatch = false,
  title = 'Delete task',
  description,
}: DeleteConfirmationProps): ReactElement => {
  const [confirmation, setConfirmation] = useState('');

  useEffect(() => {
    if (!open) {
      setConfirmation('');
    }
  }, [open]);

  const canConfirm = requireTitleMatch ? confirmation.trim() === taskTitle && !loading : !loading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="sm" showCloseButton={!loading}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description ?? (
              <>
                This permanently deletes <strong>{taskTitle}</strong> and cannot be undone
                {requireTitleMatch ? '. Type the task title to confirm.' : '.'}
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <Stack gap={16}>
          <Alert variant="danger" title="Irreversible action">
            Deleted tasks cannot be restored.
          </Alert>
          {requireTitleMatch ? (
            <Stack gap={8}>
              <label htmlFor="delete-task-confirm">
                <Text as="span" variant="caption">
                  Task title
                </Text>
              </label>
              <Input
                id="delete-task-confirm"
                size="lg"
                value={confirmation}
                disabled={loading}
                placeholder={taskTitle}
                autoComplete="off"
                spellCheck={false}
                aria-required="true"
                aria-invalid={confirmation.length > 0 && confirmation.trim() !== taskTitle}
                onChange={(event) => {
                  setConfirmation(event.target.value);
                }}
              />
            </Stack>
          ) : null}
        </Stack>

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            size="md"
            disabled={loading}
            onClick={() => {
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="md"
            loading={loading}
            disabled={!canConfirm}
            onClick={() => {
              void onConfirm();
            }}
          >
            Delete task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export type { DeleteConfirmationProps };
