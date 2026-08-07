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

type DeleteDialogProps = {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly projectName: string;
  readonly onConfirm: () => void | Promise<void>;
  readonly loading?: boolean;
  readonly title?: string;
  readonly description?: ReactNode;
};

export const DeleteDialog = ({
  open,
  onOpenChange,
  projectName,
  onConfirm,
  loading = false,
  title = 'Delete project',
  description,
}: DeleteDialogProps): ReactElement => {
  const [confirmation, setConfirmation] = useState('');

  useEffect(() => {
    if (!open) {
      setConfirmation('');
    }
  }, [open]);

  const canConfirm = confirmation.trim() === projectName && !loading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="sm" showCloseButton={!loading}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description ?? (
              <>
                This permanently deletes <strong>{projectName}</strong> and cannot be undone. Type
                the project name to confirm.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <Stack gap={16}>
          <Alert variant="danger" title="Irreversible action">
            Type <strong>{projectName}</strong> to confirm deletion.
          </Alert>
          <Stack gap={8}>
            <label htmlFor="delete-project-confirm">
              <Text as="span" variant="caption">
                Project name
              </Text>
            </label>
            <Input
              id="delete-project-confirm"
              size="lg"
              value={confirmation}
              disabled={loading}
              placeholder={projectName}
              autoComplete="off"
              spellCheck={false}
              aria-required="true"
              aria-invalid={confirmation.length > 0 && confirmation.trim() !== projectName}
              onChange={(event) => {
                setConfirmation(event.target.value);
              }}
            />
          </Stack>
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
            Delete project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export type { DeleteDialogProps };
