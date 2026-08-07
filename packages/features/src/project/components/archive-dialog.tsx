import type { ReactElement, ReactNode } from 'react';

import { Alert } from '@shared/ui/feedback/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@shared/ui/overlays/dialog';
import { Button } from '@shared/ui/primitives/button';

type ArchiveDialogProps = {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly projectName: string;
  readonly onConfirm: () => void | Promise<void>;
  readonly loading?: boolean;
  readonly title?: string;
  readonly description?: ReactNode;
};

export const ArchiveDialog = ({
  open,
  onOpenChange,
  projectName,
  onConfirm,
  loading = false,
  title = 'Archive project',
  description,
}: ArchiveDialogProps): ReactElement => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="sm" showCloseButton={!loading}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description ?? (
              <>
                Archive <strong>{projectName}</strong>? You can restore it later from the archived
                filter.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <Alert variant="warning" title="Project will be hidden">
          Archived projects are removed from the active list but are not deleted.
        </Alert>

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
            variant="secondary"
            size="md"
            loading={loading}
            disabled={loading}
            onClick={() => {
              void onConfirm();
            }}
          >
            Archive project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export type { ArchiveDialogProps };
