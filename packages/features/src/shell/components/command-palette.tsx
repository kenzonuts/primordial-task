import type { ReactElement } from 'react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { useCommandPaletteStore } from '@features/shell/store/command-palette-store';
import { APP_ROUTES } from '@features/shell/types';
import {
  CommandMenu,
  CommandMenuContent,
  CommandMenuEmpty,
  CommandMenuGroup,
  CommandMenuInput,
  CommandMenuItem,
  CommandMenuList,
} from '@shared/ui/composites/command-menu';

type CommandPaletteProps = {
  readonly className?: string;
};

type PaletteCommand = {
  readonly id: string;
  readonly label: string;
  readonly path: string;
  readonly shortcut?: string;
};

const RECENT_COMMANDS: readonly PaletteCommand[] = [
  {
    id: 'nav-dashboard',
    label: 'Navigate to Dashboard',
    path: APP_ROUTES.dashboard,
    shortcut: 'G D',
  },
  {
    id: 'nav-projects',
    label: 'Navigate to Projects',
    path: APP_ROUTES.projects,
  },
  {
    id: 'nav-tasks',
    label: 'Navigate to Tasks',
    path: APP_ROUTES.tasks,
  },
  {
    id: 'nav-kanban',
    label: 'Navigate to Kanban',
    path: APP_ROUTES.kanban,
  },
  {
    id: 'nav-calendar',
    label: 'Navigate to Calendar',
    path: APP_ROUTES.calendar,
  },
  {
    id: 'nav-notes',
    label: 'Navigate to Notes',
    path: APP_ROUTES.notes,
  },
  {
    id: 'nav-docs',
    label: 'Navigate to Documentation',
    path: APP_ROUTES.docs,
  },
  {
    id: 'nav-analytics',
    label: 'Navigate to Analytics',
    path: APP_ROUTES.analytics,
  },
  {
    id: 'nav-ai',
    label: 'Navigate to AI Workspace',
    path: APP_ROUTES.aiWorkspace,
  },
  {
    id: 'nav-developer',
    label: 'Navigate to Developer Workspace',
    path: APP_ROUTES.developerWorkspace,
  },
  {
    id: 'nav-settings',
    label: 'Navigate to Settings',
    path: APP_ROUTES.settings,
  },
] as const;

export const CommandPalette = ({ className }: CommandPaletteProps): ReactElement => {
  const navigate = useNavigate();
  const open = useCommandPaletteStore((state) => state.open);
  const query = useCommandPaletteStore((state) => state.query);
  const setOpen = useCommandPaletteStore((state) => state.setOpen);
  const setQuery = useCommandPaletteStore((state) => state.setQuery);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return RECENT_COMMANDS;
    }
    return RECENT_COMMANDS.filter((command) => command.label.toLowerCase().includes(normalized));
  }, [query]);

  const handleSelect = (path: string): void => {
    setOpen(false);
    navigate(path);
  };

  return (
    <CommandMenu
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
      }}
    >
      <CommandMenuContent className={className} title="Command palette">
        <CommandMenuInput
          placeholder="Search commands…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search commands"
        />
        <CommandMenuList>
          {filtered.length === 0 ? (
            <CommandMenuEmpty>No commands found</CommandMenuEmpty>
          ) : (
            <CommandMenuGroup heading="Recent">
              {filtered.map((command) => (
                <CommandMenuItem
                  key={command.id}
                  shortcut={command.shortcut}
                  onClick={() => handleSelect(command.path)}
                >
                  {command.label}
                </CommandMenuItem>
              ))}
            </CommandMenuGroup>
          )}
        </CommandMenuList>
      </CommandMenuContent>
    </CommandMenu>
  );
};

export type { CommandPaletteProps };
