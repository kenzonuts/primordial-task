import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SidebarStoreState {
  readonly collapsed: boolean;
  readonly width: number;
  setCollapsed(collapsed: boolean): void;
  toggleCollapsed(): void;
  setWidth(width: number): void;
}

export const SIDEBAR_EXPANDED_WIDTH = 264;
export const SIDEBAR_COLLAPSED_WIDTH = 72;

export const useSidebarStore = create<SidebarStoreState>()(
  persist(
    (set, get) => ({
      collapsed: false,
      width: SIDEBAR_EXPANDED_WIDTH,
      setCollapsed: (collapsed) => {
        set({
          collapsed,
          width: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH,
        });
      },
      toggleCollapsed: () => {
        get().setCollapsed(!get().collapsed);
      },
      setWidth: (width) => {
        set({ width });
      },
    }),
    {
      name: 'primordial-shell-sidebar',
      partialize: (state) => ({
        collapsed: state.collapsed,
        width: state.width,
      }),
    },
  ),
);
