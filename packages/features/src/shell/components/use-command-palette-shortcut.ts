import { useEffect } from 'react';

import { useCommandPaletteStore } from '@features/shell/store/command-palette-store';

/**
 * Registers the global Command/Ctrl + K shortcut for the shell command palette.
 */
export const useCommandPaletteShortcut = (): void => {
  const toggle = useCommandPaletteStore((state) => state.toggle);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.defaultPrevented) {
        return;
      }

      if (event.key.toLowerCase() !== 'k') {
        return;
      }

      if (!(event.metaKey || event.ctrlKey) || event.altKey || event.shiftKey) {
        return;
      }

      event.preventDefault();
      toggle();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [toggle]);
};
