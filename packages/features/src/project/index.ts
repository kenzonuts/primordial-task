export {
  PROJECT_ROUTES,
  projectDetailPath,
  projectEditPath,
  projectSettingsPath,
  PROJECT_STATUSES,
  PROJECT_VISIBILITIES,
} from '@features/project/types';
export type {
  CreateProjectInput,
  Project,
  ProjectActivityItem,
  ProjectDeadlineItem,
  ProjectFilterKey,
  ProjectFiltersState,
  ProjectHealth,
  ProjectMember,
  ProjectOwner,
  ProjectPreferences,
  ProjectSettingsSection,
  ProjectSortKey,
  ProjectStatistic,
  ProjectStatus,
  ProjectViewMode,
  ProjectVisibility,
  UpdateProjectInput,
} from '@features/project/types';

export {
  PROJECT_STATUS_LABELS,
  PROJECT_VISIBILITY_LABELS,
  PROJECT_HEALTH_LABELS,
  PROJECT_COLORS,
  PROJECT_ICONS,
} from '@features/project/constants';

export {
  createProjectSchema,
  updateProjectSchema,
  slugifyProjectName,
  projectNameSchema,
  projectSlugSchema,
} from '@features/project/schemas/project-schemas';
export type {
  CreateProjectFormValues,
  UpdateProjectFormValues,
} from '@features/project/schemas/project-schemas';

export {
  useProjectStore,
  selectFilteredProjects,
  selectRecentProjects,
  selectFavoriteProjects,
  selectPinnedProjects,
} from '@features/project/store/project-store';

export { ProjectProvider, useProjectContext } from '@features/project/context/project-context';
export type { ProjectContextValue } from '@features/project/context/project-context';

export { ProjectRoutes } from '@features/project/routes/project-routes';

export {
  ProjectListPage,
  ProjectCreatePage,
  ProjectOverviewPage,
  ProjectEditPage,
  ProjectSettingsPage,
} from '@features/project/pages';

export * from '@features/project/components';
