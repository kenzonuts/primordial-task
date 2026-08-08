import type { ReactElement, ReactNode } from 'react';

import { toast } from '@shared/ui/feedback/toast';
import { cn } from '@shared/ui/lib/cn';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@shared/ui/overlays/dropdown-menu';
import { Button } from '@shared/ui/primitives/button';

export const AI_ACTION_IDS = [
  'summarize',
  'extract_tasks',
  'generate_docs',
  'improve_writing',
  'explain_selection',
] as const;

export type AiActionId = (typeof AI_ACTION_IDS)[number];

const AI_ACTION_ITEMS: readonly { id: AiActionId; label: string }[] = [
  { id: 'summarize', label: 'Summarize' },
  { id: 'extract_tasks', label: 'Extract Tasks' },
  { id: 'generate_docs', label: 'Generate Documentation' },
  { id: 'improve_writing', label: 'Improve Writing' },
  { id: 'explain_selection', label: 'Explain Selection' },
] as const;

export type AiActionsMenuProps = {
  readonly onAiAction?: (action: AiActionId) => void;
  /** When true, all items are disabled (no backend). */
  readonly disabled?: boolean;
  readonly trigger?: ReactNode;
  readonly className?: string;
};

/**
 * Foundation-only AI actions menu. No AI backend —
 * defaults to a “Coming soon” toast unless `onAiAction` is provided.
 */
export const AiActionsMenu = ({
  onAiAction,
  disabled = false,
  trigger,
  className,
}: AiActionsMenuProps): ReactElement => {
  const handleAction = (action: AiActionId, label: string): void => {
    if (onAiAction) {
      onAiAction(action);
      return;
    }
    toast.message(`${label} — Coming soon`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger ?? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-label="AI actions"
            disabled={disabled}
            className={className}
          >
            AI
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={cn('min-w-[200px]', className)}>
        <DropdownMenuLabel>AI actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {AI_ACTION_ITEMS.map((item) => (
          <DropdownMenuItem
            key={item.id}
            disabled={disabled}
            aria-label={item.label}
            onSelect={() => handleAction(item.id, item.label)}
          >
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
