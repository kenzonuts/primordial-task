import { create } from 'zustand';

import type { AppRoutePath } from '@features/shell/types';
import { APP_ROUTES } from '@features/shell/types';

interface NavigationStoreState {
  readonly activePath: AppRoutePath;
  readonly breadcrumbs: readonly { label: string; path?: string }[];
  setActivePath(path: AppRoutePath): void;
  setBreadcrumbs(items: readonly { label: string; path?: string }[]): void;
}

export const useNavigationStore = create<NavigationStoreState>((set) => ({
  activePath: APP_ROUTES.dashboard,
  breadcrumbs: [{ label: 'Dashboard' }],
  setActivePath: (path) => {
    set({ activePath: path });
  },
  setBreadcrumbs: (items) => {
    set({ breadcrumbs: items });
  },
}));
