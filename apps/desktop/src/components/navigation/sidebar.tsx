import { NavLink } from 'react-router-dom'

import { WorkspaceSwitcher } from '@/components/workspace/workspace-switcher'
import { useAppStore } from '@/stores/app-store'

type NavItem = {
  label: string
  path: string
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Projects', path: '/projects' },
  { label: 'Tasks', path: '/tasks' },
  { label: 'Kanban', path: '/kanban' },
  { label: 'Calendar', path: '/calendar' },
  { label: 'Analytics', path: '/analytics' },
  { label: 'AI Workspace', path: '/ai-workspace' },
  { label: 'Developer Tools', path: '/developer-tools' },
  { label: 'Settings', path: '/settings' },
]

export function Sidebar() {
  const sidebarCollapsed = useAppStore((state) => state.sidebarCollapsed)
  const toggleSidebarCollapsed = useAppStore((state) => state.toggleSidebarCollapsed)

  return (
    <aside
      aria-label="Primary navigation"
      className={`flex h-screen shrink-0 flex-col border-r border-white/10 bg-zinc-950 p-3 transition-all ${
        sidebarCollapsed ? 'w-[72px]' : 'w-[264px]'
      }`}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-white/10 text-xs font-semibold text-white">
          PT
        </div>
        {!sidebarCollapsed ? <span className="text-sm font-semibold text-white">Primordial Task</span> : null}
      </div>

      <WorkspaceSwitcher collapsed={sidebarCollapsed} />

      <button
        type="button"
        onClick={toggleSidebarCollapsed}
        className="mt-3 rounded-md border border-white/10 px-2 py-1 text-left text-xs text-zinc-300 hover:bg-white/10"
      >
        {sidebarCollapsed ? 'Expand' : 'Collapse'}
      </button>

      <nav className="mt-4 flex-1 space-y-1" aria-label="Sidebar items">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            title={sidebarCollapsed ? item.label : undefined}
            className={({ isActive }) =>
              `flex items-center rounded-md px-2 py-2 text-sm transition ${
                isActive ? 'bg-white/15 text-white' : 'text-zinc-300 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-white/10 text-[10px]">
              {item.label.charAt(0)}
            </span>
            {!sidebarCollapsed ? <span className="ml-2 truncate">{item.label}</span> : null}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
