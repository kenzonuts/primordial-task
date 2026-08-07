import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { UtilityPanelMode } from '@features/shell/types';

interface UtilityPanelStoreState {
  readonly open: boolean;
  readonly width: number;
  readonly mode: UtilityPanelMode;
  setOpen(open: boolean): void;
  toggle(): void;
  setWidth(width: number): void;
  setMode(mode: UtilityPanelMode): void;
}

export const UTILITY_PANEL_DEFAULT_WIDTH = 360;
export const UTILITY_PANEL_MIN_WIDTH = 280;
export const UTILITY_PANEL_MAX_WIDTH = 480;

export const useUtilityPanelStore = create<UtilityPanelStoreState>()(
  persist(
    (set) => ({
      open: true,
      width: UTILITY_PANEL_DEFAULT_WIDTH,
      mode: 'placeholder',
      setOpen: (open) => {
        set({ open });
      },
      toggle: () => {
        set((state) => ({ open: !state.open }));
      },
      setWidth: (width) => {
        const clamped = Math.min(UTILITY_PANEL_MAX_WIDTH, Math.max(UTILITY_PANEL_MIN_WIDTH, width));
        set({ width: clamped });
      },
      setMode: (mode) => {
        set({ mode, open: true });
      },
    }),
    {
      name: 'primordial-shell-utility-panel',
      partialize: (state) => ({
        open: state.open,
        width: state.width,
        mode: state.mode,
      }),
    },
  ),
);
