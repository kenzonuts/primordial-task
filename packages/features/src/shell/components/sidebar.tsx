import { Hexagon } from 'lucide-react';
import type { ReactElement } from 'react';

import { SidebarFooter } from '@features/shell/components/sidebar-footer';
import { SidebarItem } from '@features/shell/components/sidebar-item';
import { SidebarSection } from '@features/shell/components/sidebar-section';
import { WorkspaceSwitcher } from '@features/shell/components/workspace-switcher';
import { NAVIGATION_GROUPS } from '@features/shell/navigation';
import { useSidebarStore } from '@features/shell/store/sidebar-store';
import { Icon } from '@shared/ui/icons/icon';
import { ScrollArea } from '@shared/ui/layout/scroll-area';
import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import { Text } from '@shared/ui/typography/text';

type SidebarProps = {
  readonly className?: string;
};

export const Sidebar = ({ className }: SidebarProps): ReactElement => {
  const collapsed = useSidebarStore((state) => state.collapsed);
  const width = useSidebarStore((state) => state.width);

  return (
    <aside
      aria-label="Primary"
      className={cn(
        'flex h-full shrink-0 flex-col border-r border-border-subtle bg-surface-sidebar',
        'ds-transition-fast',
        className,
      )}
      style={{ width }}
    >
      <div
        className={cn(
          'flex h-12 shrink-0 items-center gap-2.5 border-b border-border-subtle px-3',
          collapsed && 'justify-center px-0',
        )}
      >
        <Icon icon={Hexagon} size="navigation" decorative className="text-text-primary" />
        {!collapsed ? (
          <Text as="span" variant="h4" className="truncate">
            Primordial Task
          </Text>
        ) : (
          <span className="sr-only">Primordial Task</span>
        )}
      </div>

      <div className={cn('shrink-0 px-3 py-3', collapsed && 'px-2')}>
        <WorkspaceSwitcher collapsed={collapsed} />
      </div>

      <ScrollArea className="min-h-0 flex-1 px-3 pb-3">
        <Stack gap={20} className="w-full pt-1">
          {NAVIGATION_GROUPS.map((group) => (
            <SidebarSection key={group.id} label={group.label} collapsed={collapsed}>
              {group.items.map((item) => (
                <SidebarItem key={item.id} item={item} collapsed={collapsed} />
              ))}
            </SidebarSection>
          ))}
        </Stack>
      </ScrollArea>

      <SidebarFooter />
    </aside>
  );
};

export type { SidebarProps };
