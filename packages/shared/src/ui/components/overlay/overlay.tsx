import type { ReactNode } from 'react';
import { useCallback, useEffect, useRef } from 'react';

import { Portal } from '@ui/lib';
import { cn } from '@ui/lib/cn';
import { useFocusTrap } from '@ui/lib/focus';

interface BaseOverlayProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly title?: string;
  readonly children: ReactNode;
  readonly className?: string;
}

const OverlayShell = ({
  open,
  onClose,
  title,
  children,
  className,
}: BaseOverlayProps): ReactNode => {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useFocusTrap(panelRef, open, handleClose);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', onKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <Portal>
      <div
        className="fixed inset-0 z-[50] flex items-center justify-center bg-black/64 p-4"
        onMouseDown={onClose}
      >
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className={cn(
            'w-full rounded-lg border border-border-default bg-elevated p-5 shadow-modal transition-all duration-[240ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
            className,
          )}
          onMouseDown={(event) => {
            event.stopPropagation();
          }}
        >
          {children}
        </div>
      </div>
    </Portal>
  );
};

export const Modal = (props: BaseOverlayProps): ReactNode => {
  return <OverlayShell {...props} className={cn('max-w-[560px]', props.className)} />;
};

export const Dialog = Modal;

export const Drawer = ({
  open,
  onClose,
  children,
  title,
  className,
}: BaseOverlayProps): ReactNode => {
  if (!open) {
    return null;
  }

  return (
    <Portal>
      <div className="fixed inset-0 z-[60] bg-black/64" onMouseDown={onClose}>
        <aside
          role="dialog"
          aria-label={title}
          aria-modal="true"
          className={cn(
            'absolute right-0 top-0 h-full w-[360px] border-l border-border-default bg-surface p-4 shadow-lg transition-transform duration-[240ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
            className,
          )}
          onMouseDown={(event) => {
            event.stopPropagation();
          }}
        >
          {children}
        </aside>
      </div>
    </Portal>
  );
};

export const Tooltip = ({
  text,
  children,
}: {
  readonly text: string;
  readonly children: ReactNode;
}): ReactNode => {
  return (
    <span className="group relative inline-flex">
      {children}
      <span className="pointer-events-none absolute bottom-full left-1/2 z-[40] mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-border-default bg-elevated px-2.5 py-1.5 text-xs text-text-secondary shadow-popover group-hover:block group-focus-within:block">
        {text}
      </span>
    </span>
  );
};

export const Popover = ({
  open,
  children,
  className,
}: {
  readonly open: boolean;
  readonly children: ReactNode;
  readonly className?: string;
}): ReactNode => {
  if (!open) {
    return null;
  }

  return (
    <div
      role="dialog"
      className={cn(
        'absolute z-[30] min-w-[240px] rounded-lg border border-border-default bg-elevated p-3 shadow-popover',
        className,
      )}
    >
      {children}
    </div>
  );
};
