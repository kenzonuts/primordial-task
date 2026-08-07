import { Search } from 'lucide-react';
import type { ReactElement } from 'react';
import { useMemo } from 'react';

import { useCommandPaletteStore } from '@features/shell/store/command-palette-store';
import { Icon } from '@shared/ui/icons/icon';
import { cn } from '@shared/ui/lib/cn';
import { Button } from '@shared/ui/primitives/button';
import { Text } from '@shared/ui/typography/text';

type GlobalSearchButtonProps = {
  readonly className?: string;
};

const resolveShortcutHint = (): string => {
  if (typeof navigator === 'undefined') {
    return 'Ctrl K';
  }

  const platform =
    'userAgentData' in navigator &&
    typeof (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData
      ?.platform === 'string'
      ? (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData!
          .platform!
      : navigator.platform;

  return /Mac|iPhone|iPad|iPod/i.test(platform) ? '⌘K' : 'Ctrl K';
};

export const GlobalSearchButton = ({ className }: GlobalSearchButtonProps): ReactElement => {
  const setOpen = useCommandPaletteStore((state) => state.setOpen);
  const shortcut = useMemo(() => resolveShortcutHint(), []);

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      aria-label="Search"
      aria-keyshortcuts="Meta+K Control+K"
      onClick={() => setOpen(true)}
      className={cn(
        'h-8 min-w-[180px] justify-start gap-2 border border-border-subtle bg-surface-elevated px-2.5',
        'text-text-muted hover:text-text-primary',
        className,
      )}
      leftIcon={<Icon icon={Search} size="dense" decorative />}
    >
      <Text as="span" variant="body-sm" muted className="flex-1 text-left">
        Search
      </Text>
      <kbd className="rounded border border-border-subtle bg-surface-base px-1.5 py-0.5 text-[10px] leading-none text-text-muted">
        {shortcut}
      </kbd>
    </Button>
  );
};

export type { GlobalSearchButtonProps };
