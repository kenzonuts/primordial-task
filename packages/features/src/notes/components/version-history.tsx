import type { ReactElement } from 'react';
import { useState } from 'react';

import { VersionItem } from '@features/notes/components/version-item';
import type { NoteVersion } from '@features/notes/types';
import { ScrollArea } from '@shared/ui/layout/scroll-area';
import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@shared/ui/overlays/dialog';
import { Button } from '@shared/ui/primitives/button';
import { Text } from '@shared/ui/typography/text';

type VersionHistoryProps = {
  readonly versions: readonly NoteVersion[];
  readonly selectedVersionId?: string | null;
  readonly status?: 'idle' | 'loading' | 'ready' | 'error';
  readonly onSelect?: (version: NoteVersion) => void;
  readonly onRestore?: (version: NoteVersion) => void | Promise<void>;
  readonly onCreateSnapshot?: () => void | Promise<void>;
  readonly className?: string;
};

export const VersionHistory = ({
  versions,
  selectedVersionId = null,
  status = 'ready',
  onSelect,
  onRestore,
  onCreateSnapshot,
  className,
}: VersionHistoryProps): ReactElement => {
  const [pendingRestore, setPendingRestore] = useState<NoteVersion | null>(null);
  const [restoring, setRestoring] = useState(false);

  const confirmRestore = async (): Promise<void> => {
    if (!pendingRestore || !onRestore) {
      return;
    }
    setRestoring(true);
    try {
      await onRestore(pendingRestore);
      setPendingRestore(null);
    } finally {
      setRestoring(false);
    }
  };

  return (
    <aside
      aria-label="Version history"
      className={cn(
        'flex h-full min-h-0 w-[280px] flex-col border-l border-border-default bg-surface-sidebar',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border-subtle px-3 py-2.5">
        <Text variant="caption" muted className="uppercase tracking-wide font-medium">
          History
        </Text>
        {onCreateSnapshot ? (
          <Button type="button" size="sm" variant="ghost" onClick={() => void onCreateSnapshot()}>
            Snapshot
          </Button>
        ) : null}
      </div>
      <ScrollArea className="min-h-0 flex-1">
        <Stack gap={4} className="p-2">
          {status === 'loading' ? (
            <Text variant="caption" muted className="px-2 py-2">
              Loading versions…
            </Text>
          ) : null}
          {status === 'ready' && versions.length === 0 ? (
            <Text variant="caption" muted className="px-2 py-2">
              No versions yet
            </Text>
          ) : null}
          {versions.map((version) => (
            <VersionItem
              key={version.id}
              version={version}
              selected={selectedVersionId === version.id}
              onSelect={onSelect}
              onRestore={onRestore ? (item) => setPendingRestore(item) : undefined}
            />
          ))}
        </Stack>
      </ScrollArea>

      <Dialog
        open={pendingRestore != null}
        onOpenChange={(open) => {
          if (!open && !restoring) {
            setPendingRestore(null);
          }
        }}
      >
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Restore version?</DialogTitle>
            <DialogDescription>
              Restoring replaces the current note content with this snapshot. A new version will
              preserve your latest state when the repository supports it.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              disabled={restoring}
              onClick={() => setPendingRestore(null)}
            >
              Cancel
            </Button>
            <Button type="button" loading={restoring} onClick={() => void confirmRestore()}>
              Restore
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  );
};

export type { VersionHistoryProps };
