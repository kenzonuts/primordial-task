import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  type UniqueIdentifier,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import type { KeyboardEvent, MouseEvent, ReactElement } from 'react';
import { useCallback, useMemo, useState } from 'react';

import { KanbanCard } from '@features/kanban/components/kanban-card';
import { KanbanColumn } from '@features/kanban/components/kanban-column';
import { KanbanEmptyState } from '@features/kanban/components/kanban-empty-state';
import { KANBAN_COLUMN_GAP } from '@features/kanban/constants';
import { useKanbanDragStore } from '@features/kanban/store/drag-store';
import type {
  ColumnWidthPreset,
  KanbanColumn as KanbanColumnModel,
  KanbanSwimlane,
  SwimlaneMode,
} from '@features/kanban/types';
import type { Task } from '@features/task/types';
import { cn } from '@shared/ui/lib/cn';
import { Badge } from '@shared/ui/primitives/badge';
import { Text } from '@shared/ui/typography/text';

type KanbanBoardProps = {
  readonly workspaceId: string;
  readonly columns: readonly KanbanColumnModel[];
  readonly tasksByColumn: Readonly<Record<string, readonly Task[]>>;
  readonly selectedIds: ReadonlySet<string>;
  readonly focusedTaskId?: string | null;
  readonly columnWidthPreset?: ColumnWidthPreset;
  /** Swimlane architecture props — default none. */
  readonly swimlaneMode?: SwimlaneMode;
  readonly lanes?: readonly KanbanSwimlane[];
  readonly onOpenTask: (taskId: string) => void;
  readonly onSelectTask: (taskId: string, event: MouseEvent | KeyboardEvent) => void;
  readonly onQuickAdd: (columnId: string, title: string) => void | Promise<void>;
  readonly onToggleCollapse?: (columnId: string) => void;
  readonly onRenameColumn?: (columnId: string) => void;
  readonly onArchiveColumn?: (columnId: string) => void;
  readonly onDeleteColumn?: (columnId: string) => void;
  readonly onWidthChange?: (columnId: string, width: ColumnWidthPreset) => void;
  readonly onWipChange?: (columnId: string) => void;
  readonly onCardEdit?: (taskId: string) => void;
  readonly onCardDuplicate?: (taskId: string) => void;
  readonly onCardMove?: (taskId: string) => void;
  readonly onCardArchive?: (taskId: string) => void;
  readonly onCardDelete?: (taskId: string) => void;
  readonly onCardCopyLink?: (taskId: string) => void;
  readonly onCardCopyId?: (taskId: string) => void;
  readonly onCardTogglePin?: (taskId: string) => void;
  readonly onCardToggleFavorite?: (taskId: string) => void;
  readonly className?: string;
};

const findColumnIdForTask = (
  taskId: string,
  tasksByColumn: Readonly<Record<string, readonly Task[]>>,
): string | null => {
  for (const [columnId, tasks] of Object.entries(tasksByColumn)) {
    if (tasks.some((task) => task.id === taskId)) {
      return columnId;
    }
  }
  return null;
};

const resolveOverColumn = (
  overId: UniqueIdentifier | undefined,
  columns: readonly KanbanColumnModel[],
  tasksByColumn: Readonly<Record<string, readonly Task[]>>,
): string | null => {
  if (overId == null) {
    return null;
  }
  const asString = String(overId);
  if (columns.some((column) => column.id === asString)) {
    return asString;
  }
  return findColumnIdForTask(asString, tasksByColumn);
};

const resolveOverIndex = (
  overId: UniqueIdentifier | undefined,
  columnId: string | null,
  tasksByColumn: Readonly<Record<string, readonly Task[]>>,
): number | null => {
  if (overId == null || columnId == null) {
    return null;
  }
  const asString = String(overId);
  const tasks = tasksByColumn[columnId] ?? [];
  if (asString === columnId) {
    return tasks.length;
  }
  const index = tasks.findIndex((task) => task.id === asString);
  return index >= 0 ? index : tasks.length;
};

const collisionDetection: CollisionDetection = closestCorners;

export const KanbanBoard = ({
  workspaceId,
  columns,
  tasksByColumn,
  selectedIds,
  focusedTaskId = null,
  columnWidthPreset,
  swimlaneMode = 'none',
  lanes = [],
  onOpenTask,
  onSelectTask,
  onQuickAdd,
  onToggleCollapse,
  onRenameColumn,
  onArchiveColumn,
  onDeleteColumn,
  onWidthChange,
  onWipChange,
  onCardEdit,
  onCardDuplicate,
  onCardMove,
  onCardArchive,
  onCardDelete,
  onCardCopyLink,
  onCardCopyId,
  onCardTogglePin,
  onCardToggleFavorite,
  className,
}: KanbanBoardProps): ReactElement => {
  const drag = useKanbanDragStore((state) => state.drag);
  const startDrag = useKanbanDragStore((state) => state.startDrag);
  const setOver = useKanbanDragStore((state) => state.setOver);
  const cancelDrag = useKanbanDragStore((state) => state.cancelDrag);
  const commitMove = useKanbanDragStore((state) => state.commitMove);
  const setAnnouncement = useKanbanDragStore((state) => state.setAnnouncement);

  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const allTasks = useMemo(
    () => Object.values(tasksByColumn).flatMap((tasks) => [...tasks]),
    [tasksByColumn],
  );

  const activeTask = useMemo(
    () => allTasks.find((task) => task.id === activeTaskId) ?? null,
    [allTasks, activeTaskId],
  );

  const dragCount = drag.activeTaskIds.length > 0 ? drag.activeTaskIds.length : 1;

  const visibleColumns = useMemo(() => columns.filter((column) => !column.isArchived), [columns]);

  const columnIds = useMemo(() => visibleColumns.map((column) => column.id), [visibleColumns]);

  const handleDragStart = useCallback(
    (event: DragStartEvent): void => {
      const taskId = String(event.active.id);
      const columnId = findColumnIdForTask(taskId, tasksByColumn);
      if (!columnId) {
        return;
      }
      const isSelected = selectedIds.has(taskId);
      const movingIds = isSelected && selectedIds.size > 1 ? Array.from(selectedIds) : [taskId];
      const mode =
        event.activatorEvent instanceof globalThis.KeyboardEvent ? 'keyboard' : 'pointer';
      setActiveTaskId(taskId);
      startDrag(movingIds, columnId, mode);
      const task = allTasks.find((item) => item.id === taskId);
      setAnnouncement(
        task
          ? `Picked up ${task.title}${movingIds.length > 1 ? ` and ${movingIds.length - 1} more` : ''}.`
          : `Picked up ${movingIds.length} task${movingIds.length > 1 ? 's' : ''}.`,
      );
    },
    [tasksByColumn, selectedIds, startDrag, allTasks, setAnnouncement],
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent): void => {
      const overColumnId = resolveOverColumn(event.over?.id, visibleColumns, tasksByColumn);
      const overIndex = resolveOverIndex(event.over?.id, overColumnId, tasksByColumn);
      setOver(overColumnId, overIndex, null);
    },
    [visibleColumns, tasksByColumn, setOver],
  );

  const handleDragCancel = useCallback((): void => {
    setActiveTaskId(null);
    cancelDrag();
  }, [cancelDrag]);

  const handleDragEnd = useCallback(
    async (event: DragEndEvent): Promise<void> => {
      const { active, over } = event;
      setActiveTaskId(null);

      if (!over) {
        cancelDrag();
        return;
      }

      const sourceColumnId =
        drag.activeColumnId ?? findColumnIdForTask(String(active.id), tasksByColumn);
      const destinationColumnId = resolveOverColumn(over.id, visibleColumns, tasksByColumn);
      const destinationIndex = resolveOverIndex(over.id, destinationColumnId, tasksByColumn);

      if (!sourceColumnId || !destinationColumnId || destinationIndex == null) {
        cancelDrag();
        return;
      }

      const taskIds = drag.activeTaskIds.length > 0 ? drag.activeTaskIds : [String(active.id)];

      if (
        sourceColumnId === destinationColumnId &&
        taskIds.length === 1 &&
        String(active.id) === String(over.id)
      ) {
        cancelDrag();
        return;
      }

      const destName =
        visibleColumns.find((column) => column.id === destinationColumnId)?.name ??
        destinationColumnId;
      setAnnouncement(`Moving to ${destName}…`);

      try {
        await commitMove(workspaceId, {
          taskIds,
          sourceColumnId,
          destinationColumnId,
          destinationSwimlaneId: null,
          destinationIndex,
        });
      } catch {
        // announcement already set by store on failure
      }
    },
    [
      drag.activeColumnId,
      drag.activeTaskIds,
      tasksByColumn,
      visibleColumns,
      cancelDrag,
      commitMove,
      workspaceId,
      setAnnouncement,
    ],
  );

  if (visibleColumns.length === 0) {
    return (
      <div data-kanban-board className={cn('flex min-h-0 flex-1', className)}>
        <KanbanEmptyState variant="no-columns" />
      </div>
    );
  }

  const totalTasks = allTasks.length;

  return (
    <div
      data-kanban-board
      data-swimlane-mode={swimlaneMode}
      role="region"
      aria-label="Kanban board"
      className={cn('relative flex min-h-0 flex-1 flex-col', className)}
    >
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {drag.announcement}
      </div>

      {swimlaneMode !== 'none' && lanes.length > 0 ? (
        <Text as="p" variant="caption" muted className="px-4 py-1">
          Swimlanes: {swimlaneMode} ({lanes.length} lanes)
        </Text>
      ) : null}

      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetection}
        autoScroll
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={(event) => {
          void handleDragEnd(event);
        }}
        onDragCancel={handleDragCancel}
      >
        <SortableContext items={columnIds} strategy={horizontalListSortingStrategy}>
          <div
            className="flex min-h-0 flex-1 overflow-x-auto overflow-y-hidden px-4 pb-4 pt-2"
            style={{ gap: KANBAN_COLUMN_GAP }}
          >
            {visibleColumns.map((column) => {
              const columnTasks = tasksByColumn[column.id] ?? [];
              return (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  tasks={columnTasks}
                  selectedIds={selectedIds}
                  focusedTaskId={focusedTaskId}
                  dropIndicatorIndex={drag.overColumnId === column.id ? drag.overIndex : null}
                  isOver={drag.overColumnId === column.id && drag.isDragging}
                  widthOverride={columnWidthPreset}
                  onOpenTask={onOpenTask}
                  onSelectTask={onSelectTask}
                  onQuickAdd={onQuickAdd}
                  onToggleCollapse={onToggleCollapse}
                  onRenameColumn={onRenameColumn}
                  onArchiveColumn={onArchiveColumn}
                  onDeleteColumn={onDeleteColumn}
                  onWidthChange={onWidthChange}
                  onWipChange={onWipChange}
                  onCardEdit={onCardEdit}
                  onCardDuplicate={onCardDuplicate}
                  onCardMove={onCardMove}
                  onCardArchive={onCardArchive}
                  onCardDelete={onCardDelete}
                  onCardCopyLink={onCardCopyLink}
                  onCardCopyId={onCardCopyId}
                  onCardTogglePin={onCardTogglePin}
                  onCardToggleFavorite={onCardToggleFavorite}
                />
              );
            })}
          </div>
        </SortableContext>

        <DragOverlay dropAnimation={null}>
          {activeTask ? (
            <div className="relative w-[280px] motion-reduce:opacity-90">
              <KanbanCard
                task={activeTask}
                selected={selectedIds.has(activeTask.id)}
                onOpen={() => undefined}
                onSelect={() => undefined}
                isDragging
                className="shadow-lg opacity-90 motion-reduce:shadow-none"
              />
              {dragCount > 1 ? (
                <Badge
                  variant="info"
                  className="absolute -right-2 -top-2 tabular-nums shadow-sm"
                  aria-label={`${dragCount} tasks being moved`}
                >
                  {dragCount}
                </Badge>
              ) : null}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {totalTasks === 0 ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="pointer-events-auto">
            <KanbanEmptyState variant="no-tasks" />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export type { KanbanBoardProps };
