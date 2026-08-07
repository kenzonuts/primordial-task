import type { PointerEvent as ReactPointerEvent, ReactElement, ReactNode } from 'react';
import { useCallback, useEffect, useRef } from 'react';

import { useUtilityPanelStore } from '@features/shell/store/utility-panel-store';
import { cn } from '@shared/ui/lib/cn';

type ResizablePanelProps = {
  readonly children: ReactNode;
  readonly className?: string;
  readonly 'aria-label'?: string;
};

export const ResizablePanel = ({
  children,
  className,
  'aria-label': ariaLabel = 'Utility panel',
}: ResizablePanelProps): ReactElement | null => {
  const open = useUtilityPanelStore((state) => state.open);
  const width = useUtilityPanelStore((state) => state.width);
  const setWidth = useUtilityPanelStore((state) => state.setWidth);
  const setOpen = useUtilityPanelStore((state) => state.setOpen);
  const draggingRef = useRef(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, setOpen]);

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      draggingRef.current = true;
      const startX = event.clientX;
      const startWidth = useUtilityPanelStore.getState().width;

      const onPointerMove = (moveEvent: PointerEvent): void => {
        if (!draggingRef.current) {
          return;
        }
        const delta = startX - moveEvent.clientX;
        setWidth(startWidth + delta);
      };

      const onPointerUp = (): void => {
        draggingRef.current = false;
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
      };

      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
    },
    [setWidth],
  );

  if (!open) {
    return null;
  }

  return (
    <aside
      aria-label={ariaLabel}
      className={cn(
        'relative flex h-full shrink-0 flex-col border-l border-border-subtle bg-surface-sidebar',
        className,
      )}
      style={{ width }}
    >
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize utility panel"
        aria-valuenow={Math.round(width)}
        tabIndex={0}
        className={cn(
          'absolute inset-y-0 left-0 z-10 w-1 -translate-x-1/2 cursor-col-resize',
          'bg-transparent hover:bg-border-strong focus-visible:bg-border-strong',
          'focus-visible:outline-none focus-visible:ds-focus-ring',
        )}
        onPointerDown={onPointerDown}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') {
            event.preventDefault();
            setWidth(width + 16);
          } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            setWidth(width - 16);
          }
        }}
      />
      {children}
    </aside>
  );
};

export type { ResizablePanelProps };
