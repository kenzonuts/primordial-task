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

type DeleteConfirmationDialogProps = {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly workspaceName: string;
  readonly onConfirm: () => void | Promise<void>;
  readonly loading?: boolean;
  readonly title?: string;
  readonly description?: ReactNode;
};

export const DeleteConfirmationDialog = ({
  open,
  onOpenChange,
  workspaceName,
  onConfirm,
  loading = false,
  title = 'Delete workspace',
  description,
}: DeleteConfirmationDialogProps): ReactElement => {
  const [confirmation, setConfirmation] = useState('');

  useEffect(() => {
    if (!open) {
      setConfirmation('');
    }
  }, [open]);

  const canConfirm = confirmation.trim() === workspaceName && !loading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="sm" showCloseButton={!loading}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description ?? (
              <>
                This permanently deletes <strong>{workspaceName}</strong> and cannot be undone. Type
                the workspace name to confirm.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <Stack gap={16}>
          <Alert variant="danger" title="Irreversible action">
            Type <strong>{workspaceName}</strong> to confirm deletion.
          </Alert>
          <Stack gap={8}>
            <label htmlFor="delete-workspace-confirm">
              <Text as="span" variant="caption">
                Workspace name
              </Text>
            </label>
            <Input
              id="delete-workspace-confirm"
              size="lg"
              value={confirmation}
              disabled={loading}
              placeholder={workspaceName}
              autoComplete="off"
              spellCheck={false}
              aria-required="true"
              aria-invalid={confirmation.length > 0 && confirmation.trim() !== workspaceName}
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
            Delete workspace
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export type { DeleteConfirmationDialogProps };
