import { useDroppable } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { KeyboardEvent, MouseEvent, ReactElement } from 'react';
import { useRef } from 'react';

import { ColumnMenu } from '@features/kanban/components/column-menu';
import { KanbanCard } from '@features/kanban/components/kanban-card';
import { KanbanCardContextMenu } from '@features/kanban/components/kanban-card-context-menu';
import { KanbanQuickAdd } from '@features/kanban/components/kanban-quick-add';
import {
  KANBAN_CARD_GAP,
  KANBAN_CARD_MIN_HEIGHT,
  KANBAN_VIRTUALIZE_THRESHOLD,
} from '@features/kanban/constants';
import type { ColumnWidthPreset, KanbanColumn as KanbanColumnModel } from '@features/kanban/types';
import { COLUMN_WIDTH_PRESETS } from '@features/kanban/types';
import type { Task } from '@features/task/types';
import { cn } from '@shared/ui/lib/cn';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@shared/ui/overlays/tooltip';
import { Badge } from '@shared/ui/primitives/badge';
import { IconButton } from '@shared/ui/primitives/icon-button';
import { Text } from '@shared/ui/typography/text';

type KanbanColumnProps = {
  readonly column: KanbanColumnModel;
  readonly tasks: readonly Task[];
  readonly selectedIds: ReadonlySet<string>;
  readonly focusedTaskId?: string | null;
  readonly dropIndicatorIndex?: number | null;
  readonly isOver?: boolean;
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
  readonly widthOverride?: ColumnWidthPreset;
  readonly className?: string;
};

type SortableCardProps = {
  readonly task: Task;
  readonly selected: boolean;
  readonly focused: boolean;
  readonly onOpen: (taskId: string) => void;
  readonly onSelect: (taskId: string, event: MouseEvent | KeyboardEvent) => void;
  readonly contextMenuProps: {
    readonly onEdit?: (taskId: string) => void;
    readonly onDuplicate?: (taskId: string) => void;
    readonly onMove?: (taskId: string) => void;
    readonly onArchive?: (taskId: string) => void;
    readonly onDelete?: (taskId: string) => void;
    readonly onCopyLink?: (taskId: string) => void;
    readonly onCopyId?: (taskId: string) => void;
    readonly onTogglePin?: (taskId: string) => void;
    readonly onToggleFavorite?: (taskId: string) => void;
  };
};

const SortableKanbanCard = ({
  task,
  selected,
  focused,
  onOpen,
  onSelect,
  contextMenuProps,
}: SortableCardProps): ReactElement => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { type: 'card', taskId: task.id },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    minHeight: KANBAN_CARD_MIN_HEIGHT,
  };

  return (
    <KanbanCardContextMenu task={task} onOpen={onOpen} {...contextMenuProps}>
      <div>
        <KanbanCard
          task={task}
          selected={selected}
          focused={focused}
          isDragging={isDragging}
          onOpen={onOpen}
          onSelect={onSelect}
          setNodeRef={setNodeRef}
          style={style}
          dragHandleProps={{ attributes, listeners }}
        />
      </div>
    </KanbanCardContextMenu>
  );
};

export const KanbanColumnView = ({
  column,
  tasks,
  selectedIds,
  focusedTaskId = null,
  dropIndicatorIndex = null,
  isOver = false,
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
  widthOverride,
  className,
}: KanbanColumnProps): ReactElement => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const widthPreset = widthOverride ?? column.widthPreset;
  const width = COLUMN_WIDTH_PRESETS[widthPreset];
  const wipExceeded = column.wipLimit != null && tasks.length > column.wipLimit;
  const wipNear = column.wipLimit != null && tasks.length >= column.wipLimit && !wipExceeded;

  const { setNodeRef, isOver: droppableOver } = useDroppable({
    id: column.id,
    data: { type: 'column', columnId: column.id },
  });

  const shouldVirtualize = tasks.length > KANBAN_VIRTUALIZE_THRESHOLD;
  const virtualizer = useVirtualizer({
    count: tasks.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => KANBAN_CARD_MIN_HEIGHT + KANBAN_CARD_GAP,
    overscan: 6,
    enabled: shouldVirtualize && !column.collapsed,
  });

  const taskIds = tasks.map((task) => task.id);
  const overActive = isOver || droppableOver;

  const contextMenuProps = {
    onEdit: onCardEdit,
    onDuplicate: onCardDuplicate,
    onMove: onCardMove,
    onArchive: onCardArchive,
    onDelete: onCardDelete,
    onCopyLink: onCardCopyLink,
    onCopyId: onCardCopyId,
    onTogglePin: onCardTogglePin,
    onToggleFavorite: onCardToggleFavorite,
  };

  if (column.collapsed) {
    return (
      <section
        ref={setNodeRef}
        aria-label={`${column.name} column, collapsed, ${tasks.length} tasks`}
        className={cn(
          'flex h-full w-12 shrink-0 flex-col items-center rounded-lg border border-border-subtle bg-surface-elevated',
          overActive && 'border-border-strong bg-state-hover',
          className,
        )}
      >
        <IconButton
          type="button"
          size="sm"
          variant="ghost"
          className="mt-2"
          aria-label={`Expand ${column.name}`}
          aria-expanded={false}
          onClick={() => onToggleCollapse?.(column.id)}
        >
          <ChevronRight aria-hidden="true" />
        </IconButton>
        <div className="flex flex-1 items-center justify-center py-4">
          <Text
            as="span"
            variant="caption"
            className="rotate-180 writing-mode-vertical font-medium tracking-wide"
            style={{ writingMode: 'vertical-rl' }}
          >
            {column.name}
          </Text>
        </div>
        <Badge variant="neutral" className="mb-3 tabular-nums">
          {tasks.length}
        </Badge>
      </section>
    );
  }

  return (
    <section
      ref={setNodeRef}
      aria-label={`${column.name} column`}
      className={cn(
        'flex h-full shrink-0 flex-col rounded-lg border border-border-subtle bg-surface-elevated',
        overActive && 'border-border-strong ring-1 ring-border-strong',
        className,
      )}
      style={{ width }}
    >
      <header className="sticky top-0 z-[1] flex h-11 shrink-0 items-center gap-8 border-b border-border-subtle bg-surface-elevated px-2">
        <IconButton
          type="button"
          size="sm"
          variant="ghost"
          aria-label={`Collapse ${column.name}`}
          aria-expanded={true}
          onClick={() => onToggleCollapse?.(column.id)}
        >
          <ChevronDown aria-hidden="true" />
        </IconButton>

        <TooltipProvider delayDuration={400}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Text as="h2" variant="body-sm" className="min-w-0 flex-1 truncate font-medium">
                {column.name}
              </Text>
            </TooltipTrigger>
            <TooltipContent side="top">{column.description || column.name}</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Badge
          variant={wipExceeded ? 'danger' : wipNear ? 'warning' : 'neutral'}
          className="tabular-nums"
          aria-label={
            column.wipLimit != null
              ? `${tasks.length} of ${column.wipLimit} WIP`
              : `${tasks.length} tasks`
          }
        >
          {column.wipLimit != null ? `${tasks.length}/${column.wipLimit}` : tasks.length}
        </Badge>

        <ColumnMenu
          column={column}
          onRename={onRenameColumn}
          onToggleCollapse={onToggleCollapse}
          onArchive={onArchiveColumn}
          onDelete={onDeleteColumn}
          onWidthChange={onWidthChange}
          onWipChange={onWipChange}
        />
      </header>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto p-2">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {shouldVirtualize ? (
            <div
              className="relative w-full"
              style={{ height: virtualizer.getTotalSize() }}
              role="list"
              aria-label={`${column.name} tasks`}
            >
              {virtualizer.getVirtualItems().map((virtualRow) => {
                const task = tasks[virtualRow.index];
                if (!task) {
                  return null;
                }
                const showDrop =
                  dropIndicatorIndex === virtualRow.index ||
                  (dropIndicatorIndex === tasks.length && virtualRow.index === tasks.length - 1);
                return (
                  <div
                    key={task.id}
                    className="absolute left-0 top-0 w-full"
                    style={{
                      height: virtualRow.size,
                      transform: `translateY(${virtualRow.start}px)`,
                      paddingBottom: KANBAN_CARD_GAP,
                    }}
                  >
                    {dropIndicatorIndex === virtualRow.index ? (
                      <div className="mb-1 h-0.5 rounded-full bg-text-primary" aria-hidden="true" />
                    ) : null}
                    <SortableKanbanCard
                      task={task}
                      selected={selectedIds.has(task.id)}
                      focused={focusedTaskId === task.id}
                      onOpen={onOpenTask}
                      onSelect={onSelectTask}
                      contextMenuProps={contextMenuProps}
                    />
                    {showDrop &&
                    dropIndicatorIndex === tasks.length &&
                    virtualRow.index === tasks.length - 1 ? (
                      <div className="mt-1 h-0.5 rounded-full bg-text-primary" aria-hidden="true" />
                    ) : null}
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              role="list"
              aria-label={`${column.name} tasks`}
              className="flex flex-col"
              style={{ gap: KANBAN_CARD_GAP }}
            >
              {tasks.length === 0 ? (
                <Text as="p" variant="caption" muted className="px-1 py-6 text-center">
                  No tasks
                </Text>
              ) : null}
              {tasks.map((task, index) => (
                <div key={task.id}>
                  {dropIndicatorIndex === index ? (
                    <div className="mb-1 h-0.5 rounded-full bg-text-primary" aria-hidden="true" />
                  ) : null}
                  <SortableKanbanCard
                    task={task}
                    selected={selectedIds.has(task.id)}
                    focused={focusedTaskId === task.id}
                    onOpen={onOpenTask}
                    onSelect={onSelectTask}
                    contextMenuProps={contextMenuProps}
                  />
                </div>
              ))}
              {dropIndicatorIndex === tasks.length && tasks.length > 0 ? (
                <div className="h-0.5 rounded-full bg-text-primary" aria-hidden="true" />
              ) : null}
            </div>
          )}
        </SortableContext>
      </div>

      <div className="shrink-0 border-t border-border-subtle p-2">
        <KanbanQuickAdd columnId={column.id} onAdd={onQuickAdd} />
      </div>
    </section>
  );
};

/** Alias matching file-name export convention. */
export const KanbanColumn = KanbanColumnView;

export type { KanbanColumnProps };
