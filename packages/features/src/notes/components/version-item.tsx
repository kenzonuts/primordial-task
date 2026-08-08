import type { ReactElement } from 'react';

import type { NoteVersion } from '@features/notes/types';
import { cn } from '@shared/ui/lib/cn';
import { Badge } from '@shared/ui/primitives/badge';
import { Button } from '@shared/ui/primitives/button';
import { Text } from '@shared/ui/typography/text';

type VersionItemProps = {
  readonly version: NoteVersion;
  readonly selected?: boolean;
  readonly onSelect?: (version: NoteVersion) => void;
  readonly onRestore?: (version: NoteVersion) => void;
  readonly className?: string;
};

export const VersionItem = ({
  version,
  selected = false,
  onSelect,
  onRestore,
  className,
}: VersionItemProps): ReactElement => {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onClick={() => onSelect?.(version)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect?.(version);
        }
      }}
      className={cn(
        'flex flex-col gap-1 rounded-md border border-transparent px-2 py-2 text-left',
        'hover:bg-state-hover focus-visible:outline-none focus-visible:ds-focus-ring',
        selected && 'border-border-subtle bg-state-selected',
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <Text as="span" variant="body-sm" className="min-w-0 flex-1 truncate font-medium">
          {version.label ?? (version.isManual ? 'Manual snapshot' : 'Autosave')}
        </Text>
        {version.isCurrent ? (
          <Badge variant="info" size="sm">
            Current
          </Badge>
        ) : null}
      </div>
      <Text as="span" variant="caption" muted>
        {version.author.fullName} · {new Date(version.createdAt).toLocaleString()}
      </Text>
      {onRestore && !version.isCurrent ? (
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="mt-1 self-start"
          onClick={(event) => {
            event.stopPropagation();
            onRestore(version);
          }}
        >
          Restore
        </Button>
      ) : null}
    </div>
  );
};

export type { VersionItemProps };
