export {
  TASK_ROUTES,
  taskDetailPath,
  taskEditPath,
  taskHistoryPath,
  TASK_STATUSES,
  TASK_PRIORITIES,
  TASK_TYPES,
  TASK_DEPENDENCY_TYPES,
} from '@features/task/types';
export type {
  BulkTaskUpdateInput,
  CreateTaskInput,
  MoveTaskInput,
  Task,
  TaskActivityItem,
  TaskAttachment,
  TaskChecklistItem,
  TaskComment,
  TaskDependency,
  TaskDependencyType,
  TaskFilterPreset,
  TaskFiltersState,
  TaskGroupBy,
  TaskHistoryItem,
  TaskLabel,
  TaskListPageResult,
  TaskPerson,
  TaskPreferences,
  TaskPriority,
  TaskSortKey,
  TaskStatus,
  TaskType,
  TaskViewMode,
  UpdateTaskInput,
} from '@features/task/types';

export {
  TASK_STATUS_LABELS,
  TASK_PRIORITY_LABELS,
  TASK_TYPE_LABELS,
  TASK_DEPENDENCY_LABELS,
  TASK_PRIORITY_RANK,
  TASK_STATUS_RANK,
  TASK_LABEL_COLORS,
} from '@features/task/constants';

export {
  createTaskSchema,
  updateTaskSchema,
  quickCreateTaskSchema,
  checklistCreateSchema,
  commentCreateSchema,
  taskTitleSchema,
} from '@features/task/schemas/task-schemas';
export type {
  CreateTaskFormValues,
  UpdateTaskFormValues,
  QuickCreateTaskFormValues,
} from '@features/task/schemas/task-schemas';

export {
  useTaskStore,
  useTaskFilterStore,
  useTaskPreferenceStore,
  useTaskSelectionStore,
  useTaskDetailStore,
  useTaskCommentStore,
  useTaskChecklistStore,
  useTaskDependencyStore,
  useTaskListStore,
  filterAndSortTasks,
  paginateTasks,
  buildTaskGroups,
  selectChecklistProgress,
  taskService,
} from '@features/task/store';

export {
  createTaskService,
  InMemoryTaskService,
  __resetTaskStorageForTests,
  formatTaskDueDate,
  checklistProgress,
  DEFAULT_TASK_PERSON,
} from '@features/task/services/task-service';

export { TaskProvider, useTaskContext } from '@features/task/context/task-context';
export type { TaskContextValue } from '@features/task/context/task-context';

export { TaskRoutes } from '@features/task/routes/task-routes';

export {
  TaskListPage,
  TaskCreatePage,
  TaskDetailPage,
  TaskEditPage,
  TaskHistoryPage,
} from '@features/task/pages';

export * from '@features/task/components';
