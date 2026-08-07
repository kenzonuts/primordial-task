import { X } from 'lucide-react';
import type { ReactElement, ReactNode } from 'react';

import { Icon } from '@shared/ui/icons/icon';
import { Inline } from '@shared/ui/layout/inline';
import { cn } from '@shared/ui/lib/cn';
import { IconButton } from '@shared/ui/primitives/icon-button';
import { Heading } from '@shared/ui/typography/heading';

type PanelHeaderProps = {
  readonly title: string;
  readonly onClose?: () => void;
  readonly actions?: ReactNode;
  readonly className?: string;
};

export const PanelHeader = ({
  title,
  onClose,
  actions,
  className,
}: PanelHeaderProps): ReactElement => {
  return (
    <Inline
      gap={8}
      align="center"
      justify="between"
      className={cn('h-12 shrink-0 border-b border-border-subtle px-4', className)}
    >
      <Heading level={4} className="min-w-0 truncate">
        {title}
      </Heading>
      <Inline gap={4} align="center" className="shrink-0">
        {actions}
        {onClose ? (
          <IconButton variant="ghost" size="sm" aria-label="Close panel" onClick={onClose}>
            <Icon icon={X} size="dense" decorative />
          </IconButton>
        ) : null}
      </Inline>
    </Inline>
  );
};

export type { PanelHeaderProps };
