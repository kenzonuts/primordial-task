import type { ReactElement } from 'react';

import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@shared/ui/overlays/modal';
import { Button } from '@shared/ui/primitives/button';

type SessionExpiredDialogProps = {
  readonly open: boolean;
  readonly onOpenChange?: (open: boolean) => void;
  readonly onSignInAgain: () => void;
  readonly title?: string;
  readonly description?: string;
  readonly actionLabel?: string;
};

export const SessionExpiredDialog = ({
  open,
  onOpenChange,
  onSignInAgain,
  title = 'Session expired',
  description = 'Your session expired. Sign in again to continue.',
  actionLabel = 'Sign in again',
}: SessionExpiredDialogProps): ReactElement => {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="sm" showCloseButton={false}>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <ModalDescription>{description}</ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <Button
            type="button"
            variant="primary"
            size="lg"
            className="w-full"
            onClick={onSignInAgain}
          >
            {actionLabel}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export type { SessionExpiredDialogProps };
