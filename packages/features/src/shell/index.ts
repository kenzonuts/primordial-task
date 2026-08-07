export { APP_ROUTES } from '@features/shell/types';
export type {
  AppRoutePath,
  NavigationGroup,
  NavigationGroupId,
  NavigationItem,
  ShellWorkspaceOption,
  UtilityPanelMode,
} from '@features/shell/types';

export {
  ALL_NAVIGATION_ITEMS,
  NAVIGATION_GROUPS,
  findNavigationItem,
} from '@features/shell/navigation';

export {
  useSidebarStore,
  SIDEBAR_EXPANDED_WIDTH,
  SIDEBAR_COLLAPSED_WIDTH,
} from '@features/shell/store/sidebar-store';
export { useNavigationStore } from '@features/shell/store/navigation-store';
export { useCommandPaletteStore } from '@features/shell/store/command-palette-store';
export {
  useUtilityPanelStore,
  UTILITY_PANEL_DEFAULT_WIDTH,
  UTILITY_PANEL_MIN_WIDTH,
  UTILITY_PANEL_MAX_WIDTH,
} from '@features/shell/store/utility-panel-store';
export { useWorkspaceUiStore } from '@features/shell/store/workspace-ui-store';
export { useThemeUiStore } from '@features/shell/store/theme-ui-store';

export { AuthenticatedLayout } from '@features/shell/layouts/authenticated-layout';
export { ContentLayout } from '@features/shell/layouts/content-layout';
export { ModulePlaceholderPage, PlaceholderPage } from '@features/shell/pages/placeholder-page';
export { AuthenticatedAppShell, AppShellRoutes } from '@features/shell/routes/app-shell-routes';

export * from '@features/shell/components';
