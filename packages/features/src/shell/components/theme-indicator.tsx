import { Moon } from 'lucide-react';
import type { ReactElement } from 'react';

import { useThemeUiStore } from '@features/shell/store/theme-ui-store';
import { Icon } from '@shared/ui/icons/icon';
import { cn } from '@shared/ui/lib/cn';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@shared/ui/overlays/tooltip';
import { IconButton } from '@shared/ui/primitives/icon-button';

type ThemeIndicatorProps = {
  readonly className?: string;
};

export const ThemeIndicator = ({ className }: ThemeIndicatorProps): ReactElement => {
  const mode = useThemeUiStore((state) => state.mode);

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <IconButton
            variant="ghost"
            size="md"
            aria-label="Dark theme"
            aria-pressed={mode === 'dark'}
            className={cn('text-text-muted', className)}
          >
            <Icon icon={Moon} size="navigation" decorative />
          </IconButton>
        </TooltipTrigger>
        <TooltipContent side="bottom" sideOffset={8}>
          Dark theme
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export type { ThemeIndicatorProps };
