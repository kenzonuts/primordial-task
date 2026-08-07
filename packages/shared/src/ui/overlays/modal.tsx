import type { ComponentPropsWithoutRef, ReactElement } from 'react';

import { cn } from '@shared/ui/lib/cn';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  type DialogContentProps,
} from '@shared/ui/overlays/dialog';

/**
 * Thin confirmation-oriented alias around Dialog.
 * Prefer Modal for confirm / destructive decisions; Dialog for general overlays.
 */
const Modal = Dialog;
const ModalTrigger = DialogTrigger;
const ModalClose = DialogClose;
const ModalHeader = DialogHeader;
const ModalFooter = DialogFooter;
const ModalTitle = DialogTitle;
const ModalDescription = DialogDescription;

type ModalContentProps = DialogContentProps;

const ModalContent = ({
  className,
  size = 'sm',
  showCloseButton = false,
  ...props
}: ModalContentProps): ReactElement => {
  return (
    <DialogContent
      size={size}
      showCloseButton={showCloseButton}
      className={cn('gap-5', className)}
      {...props}
    />
  );
};

export {
  Modal,
  ModalTrigger,
  ModalClose,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalTitle,
  ModalDescription,
};

export type { ModalContentProps };

export type ModalProps = ComponentPropsWithoutRef<typeof Dialog>;
