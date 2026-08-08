import type { ReactElement } from 'react';

import type { EditorSaveState } from '@features/notes/types';
import { cn } from '@shared/ui/lib/cn';
import { Text } from '@shared/ui/typography/text';

const SAVE_STATE_LABEL: Record<EditorSaveState, string | null> = {
  idle: null,
  dirty: 'Dirty',
  saving: 'Saving',
  saved: 'Saved',
  syncing: 'Syncing',
  offline: 'Offline',
  conflict: 'Conflict',
  error: 'Error',
};

type EditorStatusProps = {
  readonly state: EditorSaveState;
  readonly error?: string | null;
  readonly className?: string;
};

/** Subtle save/sync status — never distracting. */
export const EditorStatus = ({
  state,
  error,
  className,
}: EditorStatusProps): ReactElement | null => {
  const label = SAVE_STATE_LABEL[state];
  if (!label && !error) {
    return null;
  }

  const isAttention = state === 'error' || state === 'conflict' || state === 'offline';

  return (
    <Text
      as="span"
      variant="caption"
      muted={!isAttention}
      className={cn(
        'select-none tabular-nums',
        isAttention && 'text-text-secondary',
        state === 'error' && 'text-danger',
        className,
      )}
      aria-live="polite"
      title={error ?? label ?? undefined}
    >
      {error && state === 'error' ? 'Error' : label}
    </Text>
  );
};
