import { BarChart3, Columns3, Plus, Settings2 } from 'lucide-react';
import type { ReactElement, ReactNode } from 'react';

import { KanbanSearch } from '@features/kanban/components/kanban-search';
import type { KanbanBoard } from '@features/kanban/types';
import { Inline } from '@shared/ui/layout/inline';
import { cn } from '@shared/ui/lib/cn';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@shared/ui/overlays/tooltip';
import { Button } from '@shared/ui/primitives/button';
import { IconButton } from '@shared/ui/primitives/icon-button';
import { Text } from '@shared/ui/typography/text';

type KanbanBoardHeaderProps = {
  readonly board: KanbanBoard;
  readonly query: string;
  readonly onQueryChange: (value: string) => void;
  readonly onDebouncedQueryChange?: (value: string) => void;
  readonly showStatistics?: boolean;
  readonly onToggleStatistics?: () => void;
  readonly onCreateColumn?: () => void;
  readonly onOpenPreferences?: () => void;
  readonly onOpenFilters?: () => void;
  readonly boardSwitcherSlot?: ReactNode;
  readonly filterSlot?: ReactNode;
  readonly trailingSlot?: ReactNode;
  readonly disabled?: boolean;
  readonly className?: string;
};

export const KanbanBoardHeader = ({
  board,
  query,
  onQueryChange,
  onDebouncedQueryChange,
  showStatistics = false,
  onToggleStatistics,
  onCreateColumn,
  onOpenPreferences,
  onOpenFilters,
  boardSwitcherSlot,
  filterSlot,
  trailingSlot,
  disabled = false,
  className,
}: KanbanBoardHeaderProps): ReactElement => {
  return (
    <header
      className={cn(
        'flex h-14 shrink-0 items-center gap-12 border-b border-border-subtle px-4',
        className,
      )}
    >
      <Inline gap={8} align="center" className="min-w-0 shrink">
        <StackTitle board={board} />
        {boardSwitcherSlot}
      </Inline>

      <Inline gap={8} align="center" className="ml-auto min-w-0 flex-1 justify-end flex-wrap">
        <KanbanSearch
          value={query}
          onChange={onQueryChange}
          onDebouncedChange={onDebouncedQueryChange}
          disabled={disabled}
        />

        {filterSlot}

        {onOpenFilters ? (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            disabled={disabled}
            onClick={onOpenFilters}
          >
            Filters
          </Button>
        ) : null}

        <TooltipProvider delayDuration={300}>
          <Inline gap={4} align="center">
            {onToggleStatistics ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <IconButton
                    type="button"
                    size="sm"
                    variant={showStatistics ? 'selected' : 'ghost'}
                    disabled={disabled}
                    aria-label={showStatistics ? 'Hide statistics' : 'Show statistics'}
                    aria-pressed={showStatistics}
                    onClick={onToggleStatistics}
                  >
                    <BarChart3 aria-hidden="true" />
                  </IconButton>
                </TooltipTrigger>
                <TooltipContent side="bottom">Statistics</TooltipContent>
              </Tooltip>
            ) : null}

            {onCreateColumn ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    disabled={disabled}
                    onClick={onCreateColumn}
                  >
                    <Plus aria-hidden="true" className="size-3.5" />
                    <Columns3 aria-hidden="true" className="size-3.5" />
                    Column
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Create column</TooltipContent>
              </Tooltip>
            ) : null}

            {onOpenPreferences ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <IconButton
                    type="button"
                    size="sm"
                    variant="ghost"
                    disabled={disabled}
                    aria-label="Board preferences"
                    onClick={onOpenPreferences}
                  >
                    <Settings2 aria-hidden="true" />
                  </IconButton>
                </TooltipTrigger>
                <TooltipContent side="bottom">Preferences</TooltipContent>
              </Tooltip>
            ) : null}

            {trailingSlot}
          </Inline>
        </TooltipProvider>
      </Inline>
    </header>
  );
};

const StackTitle = ({ board }: { readonly board: KanbanBoard }): ReactElement => {
  return (
    <div className="min-w-0">
      <Text as="h1" variant="h4" truncate className="min-w-0">
        {board.name}
      </Text>
      <Text as="p" variant="caption" muted truncate>
        {board.projectName}
      </Text>
    </div>
  );
};

export type { KanbanBoardHeaderProps };
