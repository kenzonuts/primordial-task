import type { ReactElement } from 'react';

import { TaskRow } from '@features/task/components/task-row';
import type { Task } from '@features/task/types';
import { cn } from '@shared/ui/lib/cn';

type TaskListProps = {
  readonly tasks: readonly Task[];
  readonly selectedIds?: ReadonlySet<string> | readonly string[];
  readonly expandedIds?: ReadonlySet<string> | readonly string[];
  readonly onOpen: (taskId: string) => void;
  readonly onSelectChange?: (taskId: string, selected: boolean) => void;
  readonly onToggleExpand?: (taskId: string) => void;
  readonly onToggleFavorite: (taskId: string) => void;
  readonly onTogglePinned: (taskId: string) => void;
  readonly className?: string;
};

const hasId = (
  collection: ReadonlySet<string> | readonly string[] | undefined,
  id: string,
): boolean => {
  if (!collection) {
    return false;
  }
  if (collection instanceof Set) {
    return collection.has(id);
  }
  return collection.includes(id);
};

export const TaskList = ({
  tasks,
  selectedIds,
  expandedIds,
  onOpen,
  onSelectChange,
  onToggleExpand,
  onToggleFavorite,
  onTogglePinned,
  className,
}: TaskListProps): ReactElement => {
  return (
    <div role="list" aria-label="Tasks" className={cn('flex flex-col gap-8', className)}>
      {tasks.map((task) => (
        <div key={task.id} role="listitem">
          <TaskRow
            task={task}
            selected={hasId(selectedIds, task.id)}
            expanded={hasId(expandedIds, task.id)}
            onOpen={onOpen}
            onSelectChange={onSelectChange}
            onToggleExpand={onToggleExpand}
            onToggleFavorite={onToggleFavorite}
            onTogglePinned={onTogglePinned}
          />
        </div>
      ))}
    </div>
  );
};

export type { TaskListProps };
